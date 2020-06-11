const Stream = require('stream');
const types  = require('./types');

/**
 * [MIME description]
 */
class MIME extends Stream {
  constructor(headers, body){
    super();
    this.status = 0;
    this.body = body || '';
    this.headers = Array.isArray(headers) ? 
      headers.map(x => new Header(x)) : 
      Object.keys(headers || {}).map(name => new Header(name, headers[name]));
    return this;
  }
};

MIME.CRLF = '\r\n';
MIME.TYPES = types;

/**
 * [PARSE_STATUS description]
 * @type {Object}
 */
MIME.PARSE_STATUS = {
  HEADER : 0x00,
  BODY   : 0x01,
};

MIME.parse = function(content){
  return new MIME().end(content);
};

MIME.trim = function(s){
  return s.replace(/^"|"$/g, '');
}

MIME.filter = function(str){
  return !!str.trim();
};

/**
 * [extension description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
MIME.extension = function(type){
  return MIME.TYPES[ type ].extensions;
};

/**
 * [lookup description]
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
MIME.lookup = function(filename){
  var ext = filename.replace(/.*[\.\/\\]/, '').toLowerCase();
  return Object.keys(MIME.TYPES).filter(function(type){
    var def = MIME.TYPES[ type ];
    return ~(def.extensions||[]).indexOf(ext);
  })[0];
};

class Header {
  constructor(name, value, options){
    if(arguments.length === 1){
      Object.assign(this,
        typeof name === 'string' ? Header.parse(name) : name);
    }else{
      this.name = name;
      this.value = value;
      this.options = options;
    }
  }
  toString(){
    const { name, value, options } = this;
    return Object.keys(options || {}).reduce((s, k) => {
      return `${s}; ${k}=${options[k]}`;
    }, `${name}: ${value}`);
  }
  static parse(str){
    // a: b; a=1;b=2
    var p = str.indexOf(':');
    if(p > -1){
      const k = str.substr(0, p).trim();
      const s = str.substr(++p).trim();
      const h = Header.parseValue(s);
      h.name = k;
      return h;
    }
    throw new SyntaxError(`[mime] header syntax error: ${str}`);
  }
  static parseValue(str){
    var v, o = {};
    str.split(/;\s?/).forEach(p => {
      const kv = p.match(/^(.+?)=(.*)$/);
      if(kv) o[kv[1]] = MIME.trim(kv[2]);
      else {
        v && (v = [v]);
        Array.isArray(v) ? v.push(p) : v = p;
      }
    });
    return new Header(null, v, o);
  }
}

MIME.Header = Header;

MIME.prototype.addHeader = function(header, value, options){
  if(!(header instanceof Header))
    header = new Header(header, value, options);
  this.headers.push(header);
  return this;
};

MIME.prototype.setHeader = function(header, value, options){
  if(!(header instanceof Header))
    header = new Header(header, value, options);
  const i = this.headers.findIndex(h => {
    return h.name.toLowerCase() === header.name.toLowerCase();
  });
  if(i === -1){
    this.headers.push(header);
  }else{
    this.headers[i] = header;
  }
  return this;
};

'from,to,cc'.split(',').forEach(field => {
  MIME.prototype.__defineGetter__(field, function(){
    const header = this.getHeader(field);
    return header && MIME.parseAddress(header.value);
  });
  MIME.prototype.__defineSetter__(field, function(address){
    const value = MIME.parseAddress(address);
    const name = field.charAt(0).toUpperCase() + field.slice(1);
    return this.setHeader(name, value.toString());
  });
});

/**
 * [write description]
 * @param  {[type]} buf [description]
 * @return {[type]}     [description]
 */
MIME.prototype.write = function(buf){
  this.content = this.content || '';
  this.content += buf;
  this.content = this.content
    .replace(/\n\t/g, '')
    .replace(/\n +/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '\r\n');
  if(this.status === MIME.PARSE_STATUS.HEADER){
    var p;
    while(~(p = this.content.indexOf('\r\n'))){
      const h = this.content.slice(0, p);
      if(!h){
        this.emit('headers', this.headers);
        this.status = MIME.PARSE_STATUS.BODY;
        break;
      }
      const header = Header.parse(h);
      this.headers.push(header);
      this.emit('header', header);
      this.content = this.content.slice(p+2);
    }
  }
  if(this.status === MIME.PARSE_STATUS.BODY){
    const contentType = this.getHeader('content-type');
    if(contentType && contentType.value.indexOf('multipart/') === 0){
      var r;
      const { boundary } = contentType.options;
      this.body = Array.isArray(this.body) ? this.body : [];
      while(r = new RegExp(`--${boundary}(--)?\r\n`).exec(this.content)){
        this.body.push(MIME.parse(this.content.slice(0, r.index).trim()))
        this.content = this.content.slice(r.index+boundary.length+2);
      }
    }else{
      this.body = this.content;
    }
  }
  return this;
};

/**
 * [end description]
 * @param  {[type]} buf [description]
 * @return {[type]}     [description]
 */
MIME.prototype.end = function(buf){
  if(buf) this.write(buf);
  this.status === 0 && (this.body = this.content);
  this.emit('end', this.headers, this.body, this);
  return this;
};

MIME.prototype.getHeader = function(name){
  const low = x => x.toLowerCase();
  return this.headers.find(x => low(x.name) === low(name));
};

/**
 * toString
*/
MIME.prototype.toString = function(){
  const { headers, body } = this;
  var message = [], boundary;
  if(Array.isArray(body)){
    boundary = (Math.random() + Date.now()).toString(36);
    this.addHeader('Content-Type', 'multipart/alternative', {
      boundary
    });
  }
  headers.forEach(header => 
      message.push(header.toString()));
  message.push(null);
  if(boundary){
    body.forEach(part => {
      message.push('--' + boundary);
      message.push(part.toString());
      message.push(null);
    });
    message.push('--' + boundary + '--');
  }else{
    message.push(body);
  }
  message.push(null);
  return message.join(MIME.CRLF);
};

/**
 * [parseAddress description]
 * @docs https://tools.ietf.org/html/rfc2822#section-3.4
 * @param  {[type]} address [description]
 * @return {[type]}         [description]
 */
MIME.parseAddress = function(address){
  const r1 = /(.+)@(.+)/;
  const r2 = /^([^<]+)?<(.+)@(.+)>$/;
  if(typeof address !== 'string') 
    throw new TypeError(`[MIME] address must be a string, but got ${address}`);
  if(!r1.test(address))
    throw new SyntaxError(`[MIME] address syntax error: ${address}`);
  var _, name, user, host;
  if(r2.test(address)){
    // Liu song <hi@lsong.org>
    [ _, name, user, host ] = address.match(r2);
  }else{
    // hi@lsong.org
    [ _, user, host ] = address.match(r1);
  }
  host = host.trim();
  user = user.trim();
  name = (name || '').trim();
  return {
    host,
    user,
    name,
    address: `${user}@${host}`,
    toString(){
      name = name ? `"${name}"` : name;
      return `${name}<${this.address}>`;
    }
  };
};

module.exports = MIME;
