const fs = require('fs');
const Message = require('..');

const message = new Message();

fs.createReadStream(__dirname + '/../docs/smtp-gmail.txt').pipe(message);

message.on('end', () => {
  console.log(message.headers);
});