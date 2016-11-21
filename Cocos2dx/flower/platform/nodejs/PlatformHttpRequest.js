class PlatformHttpRequest extends flower.EventDispatcher {

    constructor(serverIp, port, path, encoding) {
        super();
        this.hasEnd = false;
        this.serverIp = serverIp;
        this.port = port || 0;
        this.path = path || "";
        this.encoding = encoding || "utf8";
        if (this.encoding == "utf8") {
            this.data = "";
        } else if (this.encoding == "binary") {
            this.data = new ArrayBuffer();
        }
    }

    get(data, method) {
        data = data || {};
        var content = querystring.stringify(data);
        var options = {
            hostname: this.serverIp,
            path: this.path,
            method: method || 'GET'
        };
        if (this.port) {
            options.port = this.port;
        }
        var req = http.request(options, this.onConnect.bind(this));
        req.on("error", this.onError.bind(this));
        req.on("end", this.onComplete.bind(this));
        req.on("close", this.onClose.bind(this));
        req.end();
        this.req = req;
    }

    onConnect(request) {
        request.setEncoding(this.encoding);
        request.on("data", this.onData.bind(this));
        this.request = request;
    }

    onData(data) {
        if (this.encoding == "utf8") {
            this.data += data;
        } else if (this.encoding == "binary") {
            this.data = this.data.concat(data);
        }
    }

    onComplete() {
        if (!this.hasEnd) {
            this.hasEnd = true;
            this.dispatchWith(Event.COMPLETE);
        }
    }

    onClose() {
        if (!this.hasEnd) {
            this.hasEnd = true;
            this.dispatchWith(Event.COMPLETE);
        }
    }

    onError(e) {
        //console.log('problem with request: ' + e.message);
        if (!this.hasEnd) {
            this.hasEnd = true;
            this.dispatchWith(Event.ERROR);
        }
    }
}