class EventDispatcher {

    $EventDispatcher;
    hasDispose = false;

    constructor(target) {
        this.$EventDispatcher = {
            0: target || this,
            1: {}
        }
    }

    dispose() {
        this.$EventDispatcher = null;
        this.hasDispose = true;
    }

    /**
     *
     * @param type
     * @param listener
     * @param thisObject
     * @param priority 监听事件的优先级，暂未实现
     */
    once(type, listener, thisObject, priority = 0) {
        this.__addListener(type, listener, thisObject, priority, true);
    }

    /**
     *
     * @param type
     * @param listener
     * @param thisObject
     * @param priority 监听事件的优先级，暂未实现
     */
    addListener(type, listener, thisObject, priority = 0) {
        this.__addListener(type, listener, thisObject, priority, false);
    }

    /**
     * 监听事件
     * @param type
     * @param listener
     * @param thisObject
     * @param priority 监听事件的优先级，暂未实现
     * @param once
     * @private
     */
    __addListener(type, listener, thisObject, priority, once) {
        if (DEBUG) {
            if (this.hasDispose) {
                $error(1002);
            }
        }
        var values = this.$EventDispatcher;
        var events = values[1];
        var list = events[type];
        if (!list) {
            list = values[1][type] = [];
        }
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i];
            if (item.listener == listener && item.thisObject == thisObject && item.del == false) {
                return false;
            }
        }
        list.push({"listener": listener, "thisObject": thisObject, "once": once, "del": false});
    }

    removeListener(type, listener, thisObject) {
        if (DEBUG) {
            if (this.hasDispose) {
                $error(1002);
            }
        }
        var values = this.$EventDispatcher;
        var events = values[1];
        var list = events[type];
        if (!list) {
            return;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].listener == listener && list[i].thisObject == thisObject && list[i].del == false) {
                list[i].listener = null;
                list[i].thisObject = null;
                list[i].del = true;
                break;
            }
        }
    }

    removeAllListener() {
        if (DEBUG) {
            if (this.hasDispose) {
                $error(1002);
            }
            return;
        }
        var values = this.$EventDispatcher;
        var events = values[1];
        events = {};
    }

    hasListener(type) {
        if (DEBUG) {
            if (this.hasDispose) {
                $error(1002);
            }
        }
        var events = this.$EventDispatcher[1];
        var list = events[type];
        if (!list) {
            return false;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].del == false) {
                return true;
            }
        }
        return false;
    }

    dispatch(event) {
        if (DEBUG) {
            if (this.hasDispose) {
                $error(1002);
            }
        }
        var list = this.$EventDispatcher[1][event.type];
        if (!list) {
            return;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].del == false) {
                var listener = list[i].listener;
                var thisObj = list[i].thisObject;
                if (event.$target == null) {
                    event.$target = this;
                }
                event.$currentTarget = this;
                if (list[i].once) {
                    list[i].listener = null;
                    list[i].thisObject = null;
                    list[i].del = true;
                }
                listener.call(thisObj, event);
            }
        }
        for (i = 0; i < list.length; i++) {
            if (list[i].del == true) {
                list.splice(i, 1);
                i--;
            }
        }
    }

    dispatchWidth(type, data = null) {
        if (DEBUG) {
            if (this.hasDispose) {
                $error(1002);
            }
        }
        var e = flower.Event.create(type, data);
        e.$target = this;
        this.dispatch(e);
        flower.Event.release(e);
    }
}

exports.EventDispatcher = EventDispatcher;