var DelayCall = (function () {

    /**
     *
     * @param time 毫秒
     * @param func
     * @param thisObj
     * @constructor
     */
    function DelayCall(time,func,thisObj) {
        this.func = func;
        this.thisObj = thisObj;
        setTimeout(this.call.bind(this),time);
    }

    var d = __define, c = DelayCall;
    var p = c.prototype;

    p.call = function() {
        if(this.func) {
            this.func.apply(this.thisObj);
        }
        this.dispose();
    }

    p.dispose = function () {
        this.func = null;
        this.thisObj = null;
    }

    return DelayCall;
})();

global.DelayCall = DelayCall;