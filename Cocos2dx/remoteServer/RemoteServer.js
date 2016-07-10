class RemoteServer extends WebSocketServer {

    constructor() {
        super(RemoteClient);


        var txt = (new File("./data/Command.json")).readContent();
        Config.cmds = JSON.parse(txt);
    }


    sendDataToAll(bytes) {
        for (var i = 0; i < this.clients.length; i++) {
            //this.clients[i].sendDataGameClient.js(bytes);
        }
    }
}

var serverPort = 9900;