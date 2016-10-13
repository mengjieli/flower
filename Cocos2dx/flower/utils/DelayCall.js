class DelayCall {

    _func;
    _thisObj;
    _data;

    constructor(time, func, thisObj, args = null) {
        this._func = func;
        this._thisObj = thisObj;
        this._data = args || [];
        this._time = time;
        this._start = flower.CoreTime.currentTime;
        this.$complete = false;
        DelayCall._next.push(this);
    }

    $update() {
        if (!this.$complete && flower.CoreTime.currentTime - this._start > this._time) {
            this._func.apply(this._thisObj, this._data);
            this._func = null;
            this._thisObj = null;
            this._data = null;
            this.$complete = true;
        }
    }

    dispose() {
        this.$complete = true;
    }


    static _list = [];
    static _next = [];

    static $run() {
        var list = DelayCall._list;
        for (var i = 0; i < list.length; i++) {
            list[i].$update();
        }
        for (var i = 0; i < list.length; i++) {
            if (list[i].$complete) {
                list.splice(i, 1);
                i--;
            }
        }
        DelayCall._list = DelayCall._list.concat(DelayCall._next);
        DelayCall._next.length = 0;
    }

}

exports.DelayCall = DelayCall;