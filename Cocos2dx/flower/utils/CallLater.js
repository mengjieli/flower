class CallLater {
    _func;
    _thisObj;
    _data;

    constructor(func, thisObj, args = null) {
        this._func = func;
        this._thisObj = thisObj;
        this._data = args || [];
        flower.CallLater._next.push(this);
    }

    $call() {
        this._func.apply(this._thisObj, this._data);
        this._func = null;
        this._thisObj = null;
        this._data = null;
    }

    static add(func, thisObj, args = null) {
        for (var i = 0, len = flower.CallLater._next.length; i < len; i++) {
            if (flower.CallLater._next[i]._func == func && flower.CallLater._next[i]._thisObj == thisObj) {
                flower.CallLater._next[i]._data = args || [];
                return;
            }
        }
        new flower.CallLater(func, thisObj, args);
    }

    static _next = [];
    static _list = [];

    static $run() {
        if (!flower.CallLater._next.length) {
            return;
        }
        flower.CallLater._list = flower.CallLater._next;
        flower.CallLater._next = [];
        var list = flower.CallLater._list;
        while (list.length) {
            list.pop().$call();
        }
    }

    static $dispose() {
        flower.CallLater._list = [];
        flower.CallLater._next = [];
    }

}

exports.CallLater = CallLater;