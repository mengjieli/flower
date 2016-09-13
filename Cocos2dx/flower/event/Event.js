class Event {

    $type;
    $bubbles;
    $cycle = false;
    $target = null;
    $currentTarget = null;
    data;
    _isPropagationStopped = false;

    constructor(type, bubbles = false) {
        this.$type = type;
        this.$bubbles = bubbles;
    }

    stopPropagation() {
        this._isPropagationStopped = true;
    }

    get isPropagationStopped() {
        return this._isPropagationStopped;
    }

    get type() {
        return this.$type;
    }

    get bubbles() {
        return this.$bubbles;
    }

    get target() {
        return this.$target;
    }

    get currentTarget() {
        return this.$currentTarget;
    }

    static READY = "ready";
    static COMPLETE = "complete";
    static ADDED = "added";
    static REMOVED = "removed";
    static ADDED_TO_STAGE = "added_to_stage";
    static REMOVED_FROM_STAGE = "removed_from_stage";
    static CONNECT = "connect";
    static CLOSE = "close";
    static CHANGE = "change";
    static ERROR = "error";
    static UPDATE = "update";
    static FOCUS_IN = "focus_in";
    static FOCUS_OUT = "focus_out";
    static CONFIRM = "confirm";
    static CANCEL = "cancel";
    static START_INPUT = "start_input";
    static STOP_INPUT = "stop_input";
    static DISTORT = "distort";
    static CREATION_COMPLETE = "creation_complete";
    static SELECTED_ITEM_CHANGE = "selected_item_change";
    static CLICK_ITEM = "click_item";
    static TOUCH_BEGIN_ITEM = "touch_begin_item";

    static _eventPool = [];

    static create(type, data = null, bubbles = false) {
        var e;
        if (!flower.Event._eventPool.length) {
            e = new flower.Event(type);
        }
        else {
            e = flower.Event._eventPool.pop();
            e.$cycle = false;
        }
        e.$type = type;
        e.$bubbles = bubbles;
        e.data = data;
        return e;
    }

    static release(e) {
        if (e.$cycle) {
            return;
        }
        e.$cycle = true;
        e.data = null;
        flower.Event._eventPool.push(e);
    }
}

exports.Event = Event;