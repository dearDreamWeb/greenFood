## mime2 [![mime2](https://img.shields.io/npm/v/mime2.svg)](https://npmjs.org/mime2)

> MIME in node.js

### Installation

```bash
$ npm i mime2
```

### Example

```js
const MIME = require('mime2');

var mime = new MIME();

mime.on('header', function(headers){
  console.log('headers', headers);
});

mime.on('body', function(body){
  console.log('body', body);
});

fs.createReadStream('mail.txt').pipe(mime);

```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---