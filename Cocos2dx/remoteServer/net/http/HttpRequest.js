var http = require('http');
var querystring = require('querystring');

var HttpRequest = (function (_super) {
    __extends(HttpRequest, _super);

    /**
     *
     * @param serverIp 例如 '192.168.1.201'
     * @param port 例如 13212
     * @param path 例如 '/empery/data/'
     * @constructor
     */
    function HttpRequest(serverIp, port, path, encoding) {
        _super.call(this);
        this.serverIp = serverIp;
        this.port = port;
        this.path = path || "";
        this.encoding = encoding || "utf8";
        if(this.encoding == "utf8") {
            this.data = "";
        } else if(this.encoding == "binary") {
            this.data = new ArrayBuffer();
        }
    }

    var d = __define, c = HttpRequest;
    p = c.prototype;

    p.get = function (data,method) {
        data = data || {};
        var content = querystring.stringify(data);
        var options = {
            hostname: this.serverIp,
            port: this.port,
            path: this.path,
            method: method||'GET'
        };
        var req = http.request(options, this.onConnect.bind(this));
        req.on("error", this.onError.bind(this));
        req.on("end",this.onComplete.bind(this));
        req.on("close",this.onClose.bind(this));
        req.end();
        this.req = req;
    }

    p.onConnect = function (request) {
        request.setEncoding(this.encoding);
        request.on("data", this.onData.bind(this));
        this.request = request;
    }

    p.onData = function (data) {
        if(this.encoding == "utf8") {
            this.data += data;
        } else if(this.encoding == "binary") {
            this.data = this.data.concat(data);
        }
        this.dispatchEvent(new Event(Event.DATA));
    }

    p.onComplete = function() {
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    p.onClose = function() {
        this.dispatchEvent(new Event(Event.CLOSE));
    }

    p.onError = function (e) {
        console.log('problem with request: ' + e.message);
    }

    return HttpRequest;
})(EventDispatcher);

global.HttpRequest = HttpRequest;