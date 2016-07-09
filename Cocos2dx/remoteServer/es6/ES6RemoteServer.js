require("./com/requirecom");
require("./ftp/requireftp");
require("./net/requirenet");
require("./shell/requireshell");
//////////////////////////File:remoteServer/RemoteClient.js///////////////////////////
class RemoteClient extends WebSocketServerClient {
    constructor(connection, big) {
        super(connection,big);
        console.log(connection.remoteAddress);
    }
}
//////////////////////////End File:remoteServer/RemoteClient.js///////////////////////////



//////////////////////////File:remoteServer/RemoteServer.js///////////////////////////
class RemoteServer extends WebSocketServer {

    constructor() {
        super(RemoteClient);
    }
}

var serverPort = 9900;
//////////////////////////End File:remoteServer/RemoteServer.js///////////////////////////



var server = new RemoteServer();
server.start(serverPort);
