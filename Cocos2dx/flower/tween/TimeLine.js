class TimeLine {
    tweens;

    constructor() {
        this.tweens = [];
    }

    lastTime = -1;
    _currentTime = 0;

    get totalTime() {
        return this.getTotalTime();
    }

    getTotalTime() {
        if (this.invalidTotalTime == true) {
            return this._totalTime;
        }
        this.invalidTotalTime = true;
        var tweens = this.tweens;
        var endTime = 0;
        var time;
        for (var i = 0, len = tweens.length; i < len; i++) {
            time = tweens[i].startTime + tweens[i].time;
            if (time > endTime) {
                endTime = time;
            }
        }
        this._totalTime = endTime * 1000;
        return this._totalTime;
    }

    _totalTime = 0;
    invalidTotalTime = true;

    $invalidateTotalTime() {
        if (this.invalidTotalTime == false) {
            return;
        }
        this.invalidTotalTime = false;
    }

    _loop = false;
    get loop() {
        return this._loop;
    }

    set loop(value) {
        this._loop = value;
    }

    _isPlaying = false;
    get isPlaying() {
        return this._isPlaying;
    }

    update(timeStamp, gap) {
        var totalTime = this.getTotalTime();
        var lastTime = this._currentTime;
        this._currentTime += timeStamp - this.lastTime;
        var currentTime = -1;
        var loopTime = 0;
        if (this._currentTime >= totalTime) {
            currentTime = this._currentTime % totalTime;
            loopTime = math.floor(this._currentTime / totalTime);
            if (!this._loop) {
                this.$setPlaying(false);
            }
        }
        while (loopTime > -1) {
            if (loopTime && currentTime != -1) {
                this._currentTime = totalTime;
            }
            var calls = this.calls;
            var call;
            var len = calls.length;
            for (i = 0; i < len; i++) {
                call = calls[i];
                if (call.time > lastTime && call.time <= this._currentTime || (call.time == 0 && lastTime == 0 && this._currentTime)) {
                    call.callBack.apply(call.thisObj, call.args);
                }
            }
            var tweens = this.tweens;
            var tween;
            len = tweens.length;
            for (var i = 0; i < len; i++) {
                tween = tweens[i];
                if (tween.$startTime + tween.$time > lastTime && tween.$startTime <= this._currentTime || (tween.$startTime == 0 && lastTime == 0 && this._currentTime)) {
                    tween.$update(this._currentTime);
                }
            }
            loopTime--;
            if (loopTime == 0) {
                if (currentTime != -1) {
                    lastTime = 0;
                    this._currentTime = currentTime;
                }
            }
            else {
                if (loopTime) {
                    lastTime = 0;
                }
            }
            if (this._loop == false) {
                break;
            }
        }
        this.lastTime = timeStamp;
        return true;
    }

    play() {
        var now = flower.CoreTime.currentTime;
        this.$setPlaying(true, now);
    }

    stop() {
        this.$setPlaying(false);
    }

    $setPlaying(value, time = 0) {
        if (value) {
            this.lastTime = time;
        }
        if (this._isPlaying == value) {
            return;
        }
        this._isPlaying = value;
        if (value) {
            flower.EnterFrame.add(this.update, this);
            this.update(flower.CoreTime.currentTime, 0);
        }
        else {
            flower.EnterFrame.remove(this.update, this);
        }
    }

    gotoAndPlay(time) {
        if (!this.tweens.length) {
            return;
        }
        time = +time | 0;
        time = time < 0 ? 0 : time;
        if (time > this.totalTime) {
            time = this.totalTime;
        }
        this._currentTime = time;
        var now = flower.CoreTime.currentTime;
        this.$setPlaying(true, now);
    }

    gotoAndStop(time) {
        if (!this.tweens.length) {
            return;
        }
        time = +time | 0;
        time = time < 0 ? 0 : time;
        if (time > this.totalTime) {
            time = this.totalTime;
        }
        this._currentTime = time;
        var now = flower.CoreTime.currentTime;
        this.$setPlaying(false);
    }

    addTween(tween) {
        this.tweens.push(tween);
        tween.$setTimeLine(this);
        this.$invalidateTotalTime();
        return tween;
    }

    removeTween(tween) {
        var tweens = this.tweens;
        for (var i = 0, len = tweens.length; i < len; i++) {
            if (tweens[i] == tween) {
                tweens.splice(i, 1)[0].$setTimeLine(null);
                this.$invalidateTotalTime();
                break;
            }
        }
        if (tweens.length == 0) {
            this.$setPlaying(false);
        }
    }

    calls = [];

    call(time, callBack, thisObj = null, ...args) {
        this.calls.push({"time": time, "callBack": callBack, "thisObj": thisObj, "args": args});
    }
}

exports.TimeLine = TimeLine;