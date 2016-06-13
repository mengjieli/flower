var Event = (function () {
    function Event(type,data) {
        this.type = type;
        this.data = data;
    }

    var d = __define, c = Event;
    p = c.prototype;

    Event.CONNECT = "connect";
    Event.CLOSE = "close";
    Event.UPDATE = "update";
    Event.DATA = "data";

    return Event;
})();

global.Event = Event;