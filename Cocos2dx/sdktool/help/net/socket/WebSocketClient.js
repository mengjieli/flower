var WSClient = require('websocket').client;

var WebScoektClient = (function () {

    function WebScoektClient() {
        this.client = new WSClient();
        this.client.on("connectFailed",this.onConnectError.bind(this));
        this.client.on("connect",this.onConnect.bind(this));
    }

    var d = __define, c = WebScoektClient;
    var p = c.prototype;

    p.connect = function(ip,port) {
        this.ip = ip;
        this.port = port;
        this.client.connect("ws://" + ip + ":" + port + "/");
    }

    p.onConnect = function(connection){
        //console.log('[connect]',"ws://" + this.ip + ":" + this.port + "/");
        this.connection = connection;
        connection.on('error',this.onError.bind(this));
        connection.on('close',this.onClose.bind(this));
        connection.on('message',this.receiveData.bind(this));
    }

    p.onConnectError = function(error){
        //console.log('Connect Error: ' + error.toString());
    }

    p.onError = function(error) {
        //console.log("Connection Error: " + error.toString());
    }

    p.onClose = function() {
        //console.log('echo-protocol Connection Closed');
    }

    p.receiveData = function(message) {

    }

    return WebScoektClient;
})();

global.WebScoektClient = WebScoektClient;