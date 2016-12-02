var __define = this.__define || function (o, p, g, s) {
        Object.defineProperty(o, p, {configurable: true, enumerable: true, get: g, set: s});
    };

function __extends(d, b) {
    if (b == null) {
        console.log("bug !!", arguments.callee.caller);
    }
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }

    __.prototype = b.prototype;
    d.prototype = new __();
}

global.__define = __define;

global.__extends = __extends;

/*
Example get & set
function File(){
}
global.__define(File.prototype, "content",
    function () {
        return fs.readFileSync(this.url, "utf-8");
    },
    function (val) {
    }
);*/