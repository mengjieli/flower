class EventDispatcher {

    __EventDispatcher;
    __inDispatcher;
    __hasDispose = false;

    constructor(target) {
        this.__EventDispatcher = {
            0: target || this,
            1: {}
        }
    }

    get isDispose() {
        return this.__hasDispose;
    }

    dispose() {
        this.__EventDispatcher = null;
        this.__hasDispose = true;
    }

    $release() {
        this.__EventDispatcher = {
            0: this,
            1: {}
        }
    }

    /**
     *
     * @param type
     * @param listener
     * @param thisObject
     * @param priority 监听事件的优先级，暂未实现
     */
    once(type, listener, thisObject, priority = 0, args = null) {
        this.__addListener(type, listener, thisObject, priority, true, args);
    }

    /**
     *
     * @param type
     * @param listener
     * @param thisObject
     * @param priority 监听事件的优先级，暂未实现
     */
    addListener(type, listener, thisObject, priority = 0, args = null) {
        this.__addListener(type, listener, thisObject, priority, false, args);
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
    __addListener(type, listener, thisObject, priority, once, args) {
        if (DEBUG) {
            if (this.__hasDispose) {
                $error(1002);
            }
            if (type == null) {
                $error(1100);
            }
            if (listener == null) {
                $error(1101);
            }
        }
        var values = this.__EventDispatcher;
        var events = values[1];
        var list = events[type];
        if (!list) {
            list = values[1][type] = [];
        }
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i];
            var agrsame = item.args == args ? true : false;
            if (!agrsame && item.args && args) {
                var arg1 = item.args.length ? item.args : [item.args];
                var arg2 = args.length ? args : [args];
                if (arg1.length == arg2.length) {
                    agrsame = true;
                    for (var a = 0; a < arg1.length; a++) {
                        if (arg1[a] != arg2[a]) {
                            agrsame = false;
                            break;
                        }
                    }
                }
            }
            if (item.listener == listener && item.thisObject == thisObject && item.del == false && agrsame) {
                return false;
            }
        }
        list.push({"listener": listener, "thisObject": thisObject, "once": once, "del": false, args: args});
    }

    removeListener(type, listener, thisObject) {
        if (this.__hasDispose) {
            return;
        }
        var values = this.__EventDispatcher;
        var events = values[1];
        var list = events[type];
        if (!list) {
            return;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].listener == listener && list[i].thisObject == thisObject && list[i].del == false) {
                if (this.__inDispatcher && this.__inDispatcher[type]) {
                    list[i].listener = null;
                    list[i].thisObject = null;
                    list[i].del = true;
                } else {
                    list.splice(i, 1);
                }
                break;
            }
        }
    }

    removeAllListener() {
        if (this.__hasDispose) {
            return;
        }
        var values = this.__EventDispatcher;
        var events = values[1];
        events = {};
    }

    hasListener(type) {
        if (DEBUG) {
            if (this.__hasDispose) {
                $error(1002);
            }
        }
        var events = this.__EventDispatcher[1];
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
        if (!this.__EventDispatcher) {
            return;
        }
        if (DEBUG) {
            if (this.__hasDispose) {
                $error(1002);
            }
        }
        var list = this.__EventDispatcher[1][event.type];
        if (!list) {
            return;
        }
        if (!this.__inDispatcher) {
            this.__inDispatcher = {};
        }
        var inDispatcher = false;
        if (!this.__inDispatcher[event.type]) {
            this.__inDispatcher[event.type] = true;
        } else {
            inDispatcher = true;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].del == false) {
                var listener = list[i].listener;
                var thisObj = list[i].thisObject;
                if (event.$target == null) {
                    event.$target = this;
                }
                event.$currentTarget = this;
                var args = [event];
                if (list[i].args) {
                    args = args.concat(list[i].args);
                }
                if (list[i].once) {
                    list[i].listener = null;
                    list[i].thisObject = null;
                    list[i].del = true;
                }
                listener.apply(thisObj, args);
            }
        }
        if (!inDispatcher) {
            delete this.__inDispatcher[event.type];
            for (i = 0; i < list.length; i++) {
                if (list[i].del == true) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    dispatchWith(type, data = null, bubbles = false) {
        if (DEBUG) {
            if (this.__hasDispose) {
                $error(1002);
            }
        }
        var e = flower.Event.create(type, data, bubbles);
        e.$target = this;
        this.dispatch(e);
        flower.Event.release(e);
    }
}

exports.EventDispatcher = EventDispatcher;