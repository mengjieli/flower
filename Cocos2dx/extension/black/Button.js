class Button extends Group {

    _enabled = true;

    constructor() {
        super();
        this.absoluteState = true;
        this.currentState = "up";
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this._onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this._onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouch, this);
    }

    _getMouseTarget(matrix, mutiply) {
        var target = super._getMouseTarget(matrix, mutiply);
        if (target) {
            target = this;
        }
        return target;
    }

    _onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                this.currentState = "down";
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                this.currentState = "up";
                break;
        }
    }

    _setEnabled(val) {
        this._enabled = val;
        if (this._enabled) {
            this.currentState = "up";
        }
        else {
            this.currentState = "disabled";
        }
    }

    set enabled(val) {
        val = !!val;
        if (this._enabled == val) {
            return;
        }
        this._setEnabled(val);
    }

    get enabled() {
        return this._enabled;
    }

    addUIEvents() {
        super.addUIEvents();
        this.addListener(flower.TouchEvent.TOUCH_END, this.onEXEClick, this);
    }

    onClickEXE;

    set onClick(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onClickEXE = val;
    }

    get onClick() {
        return this.onClickEXE;
    }

    onEXEClick(e) {
        if (this.onClickEXE && e.target == this) {
            this.onClickEXE.call(this);
        }
    }
}

exports.Button = Button;