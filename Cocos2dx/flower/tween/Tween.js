class Tween {
    constructor(target, time, propertiesTo, ease = "None", propertiesFrom = null) {
        if (flower.Tween.plugins == null) {
            flower.Tween.registerPlugin("center", flower.TweenCenter);
            flower.Tween.registerPlugin("path", flower.TweenPath);
            flower.Tween.registerPlugin("physicMove", flower.TweenPhysicMove);
        }
        time = +time;
        if (time < 0) {
            time = 0;
        }
        this.$time = time * 1000;
        this._target = target;
        this._propertiesTo = propertiesTo;
        this._propertiesFrom = propertiesFrom;
        this.ease = ease || "None";
        var timeLine = new flower.TimeLine();
        timeLine.addTween(this);
    }

    invalidProperty = false;
    _propertiesTo;
    set propertiesTo(value) {
        if (value == this._propertiesTo) {
            return;
        }
        this._propertiesTo = value;
        this.invalidProperty = false;
    }

    _propertiesFrom;
    set propertiesFrom(value) {
        if (value == this._propertiesFrom) {
            return;
        }
        this._propertiesFrom = value;
        this.invalidProperty = false;
    }

    $time;

    get time() {
        return this.$time / 1000;
    }

    set time(value) {
        value = +value | 0;
        this.$time = (+value) * 1000;
        if (this._timeLine) {
            this._timeLine.$invalidateTotalTime();
        }
    }

    $startTime = 0;

    get startTime() {
        return this.$startTime / 1000;
    }

    set startTime(value) {
        value = +value | 0;
        if (value < 0) {
            value = 0;
        }
        if (value == this.$startTime) {
            return;
        }
        this.$startTime = value * 1000;
        if (this._timeLine) {
            this._timeLine.$invalidateTotalTime();
        }
        this.invalidProperty = false;
    }

    _currentTime = 0;
    _target;
    get target() {
        return this._target;
    }

    set target(value) {
        if (value == this.target) {
            return;
        }
        this.removeTargetEvent();
        this._target = value;
        this.invalidProperty = false;
        this.addTargetEvent();
    }

    _ease;
    _easeData;

    get ease() {
        return this._ease;
    }

    set ease(val) {
        if (!flower.Tween.easeCache[val]) {
            var func = EaseFunction[val];
            if (func == null) {
                return;
            }
            var cache = [];
            for (var i = 0; i <= 2000; i++) {
                cache[i] = func(i / 2000);
            }
            flower.Tween.easeCache[val] = cache;
        }
        this._ease = val;
        this._easeData = flower.Tween.easeCache[val];
    }

    _startEvent = "";
    get startEvent() {
        return this._startEvent;
    }

    set startEvent(type) {
        this.removeTargetEvent();
        this._startEvent = type;
        this.addTargetEvent();
    }

    _startTarget;
    get startTarget() {
        return this._startTarget;
    }

    set startTarget(value) {
        this.removeTargetEvent();
        this._startTarget = value;
        this.addTargetEvent();
    }

    removeTargetEvent() {
        var target;
        if (this._startTarget) {
            target = this._startTarget;
        }
        else {
            target = this._target;
        }
        if (target && this._startEvent && this._startEvent != "") {
            target.removeListener(this._startEvent, this.startByEvent, this);
        }
    }

    addTargetEvent() {
        var target;
        if (this._startTarget) {
            target = this._startTarget;
        }
        else {
            target = this._target;
        }
        if (target && this._startEvent && this._startEvent != "") {
            target.addListener(this._startEvent, this.startByEvent, this);
        }
    }

    play() {
        this.timeLine.play();
    }

    stop() {
        this.timeLine.stop();
    }

    startByEvent() {
        this._timeLine.gotoAndPlay(0);
    }

    _timeLine;
    get timeLine() {
        if (!this._timeLine) {
            this._timeLine = new flower.TimeLine();
            this._timeLine.addTween(this);
        }
        return this._timeLine;
    }

    $setTimeLine(value) {
        if (this._timeLine) {
            this._timeLine.removeTween(this);
        }
        this._timeLine = value;
    }

    pugins = [];

    initParmas() {
        var controller;
        var params = this._propertiesTo;
        var allPlugins = flower.Tween.plugins;
        if (params) {
            var keys = flower.ObjectDo.keys(allPlugins);
            var deletes = [];
            for (var i = 0, len = keys.length; i < len; i++) {
                if (keys[i] in params) {
                    var plugin = allPlugins[keys[i]];
                    controller = new plugin();
                    deletes = deletes.concat(controller.init(this, params, this._propertiesFrom));
                    this.pugins.push(controller);
                }
            }
            for (i = 0; i < deletes.length; i++) {
                delete params[deletes[i]];
            }
            keys = flower.ObjectDo.keys(params);
            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!(typeof(key) == "string")) {
                    delete params[key];
                    keys.splice(i, 1);
                    i--;
                    continue;
                }
                var attribute = params[key];
                if (!(typeof(attribute) == "number") || !(key in this._target)) {
                    delete params[key];
                    keys.splice(i, 1);
                    i--;
                    continue;
                }
            }
            if (keys.length) {
                controller = new flower.BasicPlugin();
                controller.init(this, params, this._propertiesFrom);
                this.pugins.push(controller);
            }
        }
        this.invalidProperty = true;
    }

    invalidate() {
        this.invalidProperty = false;
    }

    _complete;
    _completeThis;
    _completeParams;

    call(callBack, thisObj = null, ...args) {
        this._complete = callBack;
        this._completeThis = thisObj;
        this._completeParams = args;
        return this;
    }

    _update;
    _updateThis;
    _updateParams;

    update(callBack, thisObj = null, ...args) {
        this._update = callBack;
        this._updateThis = thisObj;
        this._updateParams = args;
        return this;
    }

    $update(time) {
        if (!this.invalidProperty) {
            this.initParmas();
        }
        this._currentTime = time - this.$startTime;
        if (this._currentTime > this.$time) {
            this._currentTime = this.$time;
        }
        var length = this.pugins.length;
        var s = this._easeData[2000 * (this._currentTime / this.$time) | 0];
        for (var i = 0; i < length; i++) {
            this.pugins[i].update(s);
        }
        if (this._update != null) {
            this._update.apply(this._updateThis, this._updateParams);
        }
        if (this._currentTime == this.$time) {
            if (this._complete != null) {
                this._complete.apply(this._completeThis, this._completeParams);
            }
        }
        return true;
    }

    dispose() {
        if (this.timeLine) {
            this.timeLine.removeTween(this);
        }
    }

    static to(target, time, propertiesTo, ease = "None", propertiesFrom = null) {
        var tween = new flower.Tween(target, time, propertiesTo, ease, propertiesFrom);
        tween.timeLine.play();
        return tween;
    }

    static plugins;
    static easeCache = {};

    static registerPlugin(paramName, plugin) {
        if (flower.Tween.plugins == null) {
            flower.Tween.plugins = {};
        }
        flower.Tween.plugins[paramName] = plugin;
    }

    static hasPlugin(paramName) {
        return flower.Tween.plugins[paramName] ? true : false;
    }

}

exports.Tween = Tween;