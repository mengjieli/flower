var EventDispatcher = (function () {

    function EventDispatcher() {
        this.changeBacks = {};
        this._hasListener = false;
    }

    var d = __define, c = EventDispatcher;
    p = c.prototype;


    p.addEventListener = function (valueName, back, owner) {
        this._hasListener = true;
        if (!this.changeBacks[valueName]) {
            this.changeBacks[valueName] = [];
        }
        this.changeBacks[valueName].push({
            back: back,
            owner: owner
        });
    }

    p.hasEventListener = function (valueName) {
        return this.changeBacks && this.changeBacks[valueName] ? true : false;
    }

    p.dispatchEvent = function (event) {
        event.currentTarget = this;
        var list = this.changeBacks[event.type];
        if (list) {
            var copy = [];
            for (var i = 0; i < list.length; i++) {
                copy[i] = list[i];
            }
            for (i = 0; i < copy.length; i++) {
                copy[i].back.apply(copy[i].owner, [event]);
            }
        }
    }

    p.removeEventListener = function (valueName, back) {
        if (!this.changeBacks[valueName]) {
            return;
        }
        for (var i = 0; i < this.changeBacks[valueName].length; i++) {
            if (this.changeBacks[valueName][i].back == back) {
                this.changeBacks[valueName][i] = null;
                this.changeBacks[valueName].splice(i, 1);
                if (this.changeBacks[valueName].length == 0) {
                    delete this.changeBacks[valueName];
                }
                break;
            }
        }
    }

    p.removeEventsByOwner = function (owner) {
        var list = Object.keys(this.changeBacks);
        var o;
        for (var j = 0; j < list.length; j++) {
            o = list[j]
            for (var i = 0; i < this.changeBacks[o].length; i++) {
                if (this.changeBacks[o][i].owner == owner) {
                    this.changeBacks[o].splice(i, 1);
                    i--;
                }
            }
        }
    }

    p.dispose = function () {
        var list = Object.keys(this.changeBacks);
        var o;
        for (var j = 0; j < list.length; j++) {
            o = list[j];
            delete this.changeBacks[o];
        }
        this._hasListener = false;
    }

    return EventDispatcher;
})();

global.EventDispatcher = EventDispatcher;
