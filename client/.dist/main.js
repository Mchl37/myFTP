"use strict";

var _net = require("net");

var _fs = _interopRequireDefault(require("fs"));

var _readline = _interopRequireDefault(require("readline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rl = _readline["default"].createInterface({
  input: process.stdin,
  output: process.stdout
});

var client = (0, _net.createConnection)({
  port: 4242
}, function () {
  console.log("✅ Client connected ! \r\n");
});
client.on("data", function (data) {
  var message = data.toString();
  console.log("Message received : ", message);
  rl.question('FTP >> ', function (answer) {
    var args = answer.split(' ');

    switch (args[0]) {
      case 'QUIT':
        rl.close();
        client.write("".concat(answer));
        console.log('You will be disconnected.');
        client.destroy(); // executer ficher bach pour rediriger vers terminal

        break;

      case 'STOR':
        var _data = _fs["default"].readFileSync(args[1], {
          encoding: 'utf8',
          flag: 'r'
        });

        var myArray = [args[0], args[1], _data];
        client.write(myArray.join(' '));
        break;

      default:
        client.write("".concat(answer));
        break;
    }
  });
});