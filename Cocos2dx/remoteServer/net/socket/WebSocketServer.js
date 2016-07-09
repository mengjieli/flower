// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'WebSocketServer';

var webSocket = require('websocket').server;
var http = require('http');


var WebSocketServer = (function () {

    function WebSocketServer(clientClass, big) {
        if (big === void 0) {
            big = true;
        }
        this.big = big;
        this.clientClass = clientClass || WebSocketServerClient;
        this.server = null;
        this.clients = [];
    }

    var d = __define, c = WebSocketServer;
    var p = c.prototype;

    p.start = function (port) {
        var server = http.createServer(function (request, response) {
        });
        server.listen(port, function () {
            //console.log("Server on " + port);
        });
        this.server = new webSocket({
            // WebSocket server is tied to a HTTP server. WebSocket request is just
            // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
            httpServer: server
        });
        var _this = this;
        this.server.on('request', this.connectClient.bind(this));
    }

    p.connectClient = function (request) {
        var connection = request.accept(null, request.origin);
        var client = new this.clientClass(connection, this.big);
        client.addEventListener(Event.CLOSE, this.closeClient, this);
        this.clients.push(client);
        return client;
    }

    p.closeClient = function (event) {
        var client = event.currentTarget;
        for (var i = 0, len = this.clients.length; i < len; i++) {
            if (this.clients[i] == client) {
                this.clients.splice(i, 1);
                break;
            }
        }
        return client;
    }

    return WebSocketServer;
})();

global.WebSocketServer = WebSocketServer;


