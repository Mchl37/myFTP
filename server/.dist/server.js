"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Launch = Launch;

var _net = require("net");

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function Launch(port) {
  var server = (0, _net.createServer)(function (socket) {
    console.log("New connection.");
    socket.on('data', function (data) {
      var message = data.toString();

      var _message$trim$split = message.trim().split(" "),
          _message$trim$split2 = _toArray(_message$trim$split),
          command = _message$trim$split2[0],
          args = _message$trim$split2.slice(1);

      console.log(command, args);

      switch (command) {
        case "USER":
          socket.write("230 User logged in, proceed.\r\n");
          break;

        case "SYST":
          socket.write("215 \r\n");
          break;

        case "FEAT":
          socket.write("211 \r\n");
          break;

        case "PWD":
          socket.write("257 /users/michel\r\n");
          break;

        case "TYPE":
          socket.write("200 \r\n");
          break;

        default:
          console.log("command not supported:", command, args);
      }
    });
    socket.write("220 Hello world \r\n");
  });
  server.listen(port, function () {
    console.log("server started at localhost:".concat(port));
  });
}