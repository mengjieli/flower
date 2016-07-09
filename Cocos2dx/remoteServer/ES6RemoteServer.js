"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//////////////////////////File:remoteServer/RemoteServer.js///////////////////////////
require("./com/requirecom");
require("./ftp/requireftp");
require("./net/requirenet");
require("./shell/requireshell");

var RemoteServer = function RemoteServer() {
    _classCallCheck(this, RemoteServer);

    var file = new File("./");
    files = file.readDirectionList();
    console.log(files);
};
//////////////////////////End File:remoteServer/RemoteServer.js///////////////////////////