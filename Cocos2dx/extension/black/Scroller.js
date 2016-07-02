class Scroller extends MaskUI {

    _viewport;
    _viewSize = flower.Size.create(0, 0);
    _startX;
    _startY;
    _scrollDisX = [];
    _scrollDisY = [];
    _scrollTime = [];
    _lastTouchTime;
    _throw;
    _upGap = 18;

    constructor() {
        super();
        this.width = this.height = 100;
        var bg = new RectUI();
        bg.fillColor = 0x555555;
        bg.percentWidth = 100;
        bg.percentHeight = 100;
        this.addChild(bg);
    }

    $createShape() {
        var shape = new RectUI();
        shape.percentWidth = 100;
        shape.percentHeight = 100;
        return shape;
    }

    __onTouchScroller(e) {
        if (!this._viewport) {
            return;
        }
        var x = this.touchX;
        var y = this.touchY;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                if (this._throw) {
                    this._throw.dispose();
                    this._throw = null;
                }
                this._startX = x - this._viewport.x;
                this._startY = y - this._viewport.y;
                this._scrollDisX.length = this._scrollDisY.length = this._scrollTime.length = 0;
                break;
            case flower.TouchEvent.TOUCH_MOVE:
                if (Math.abs(x - this._startX) > this._upGap || Math.abs(y - this._startY) > this._upGap) {
                    this._viewport.$releaseItem();
                }
                var _x = this._viewport.x;
                var _y = this._viewport.y;
                if (this._viewport.contentWidth > this.width) {
                    this._viewport.x = x - this._startX;
                }
                if (this._viewport.contentHeight > this.height) {
                    this._viewport.y = y - this._startY;
                }
                if (this._viewport.y > this.height) {
                    this._viewport.y = this.height;
                }
                if (this._viewport.y < -this._viewport.contentHeight) {
                    this._viewport.y = -this._viewport.contentHeight;
                }
                if (this._viewport.x > this.width) {
                    this._viewport.x = this.width;
                }
                if (this._viewport.x < -this._viewport.contentWidth) {
                    this._viewport.x = -this._viewport.contentWidth;
                }
                this._scrollDisX.push(this._viewport.x - _x);
                this._scrollDisY.push(this._viewport.y - _y);
                this._scrollTime.push(flower.CoreTime.currentTime);
                if (this._scrollDisX.length > 4) {
                    this._scrollDisX.shift();
                    this._scrollDisY.shift();
                    this._scrollTime.shift();
                }
                this._lastTouchTime = flower.CoreTime.currentTime;
                break;
            case flower.TouchEvent.TOUCH_END:
            case flower.TouchEvent.TOUCH_RELEASE:
                var timeGap = 0.5;
                if (this._scrollTime.length) {
                    timeGap = flower.CoreTime.currentTime - this._scrollTime[0];
                }
                var disX = 0;
                var disY = 0;
                for (var i = 0; i < this._scrollDisX.length; i++) {
                    disX += this._scrollDisX[i];
                    disY += this._scrollDisY[i];
                }
                disX = disX * 100 / timeGap;
                disY = disY * 100 / timeGap;
                if (disX < -600) {
                    disX = -600;
                }
                if (disX > 600) {
                    disX = 600;
                }
                if (disY < -600) {
                    disY = -600;
                }
                if (disY > 600) {
                    disY = 600;
                }
                var toX = this._viewport.x + disX * 5;
                var toY = this._viewport.y + disY * 5;
                var flag = true;
                if (-toX + this.width > this._viewport.contentWidth) {
                    toX = this.width - this._viewport.contentWidth;
                    flag = false;
                }
                if (toX > 0) {
                    toX = 0;
                    flag = false;
                }
                if (-toY + this.height > this._viewport.contentHeight) {
                    toY = this.height - this._viewport.contentHeight;
                    flag = false;
                }
                if (toY > 0) {
                    toY = 0;
                    flag = false;
                }
                if (flag && disX == 0 && disY == 0 && timeGap > 250) {
                    //trace("quit", timeGap);
                    break;
                }
                var timeX = Math.abs(toX - this._viewport.x) / 350;
                var timeY = Math.abs(toY - this._viewport.y) / 350;
                var time = timeX > timeY ? timeX : timeY;
                if (time < 0.5) {
                    time = 0.5;
                }
                if (time > 5) {
                    time = 5;
                }
                this._throw = flower.Tween.to(this._viewport, time, {
                    x: toX,
                    y: toY
                }, flower.Ease.CUBIC_EASE_OUT);
                break;
        }
    }

    $onFrameEnd() {
        if (this._viewport) {
            this._viewport.width = this.width;
            this._viewport.height = this.height;
        }
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
        this.$resetLayout();
    }

    dispose() {
        flower.Size.release(this._viewSize);
        super.dispose();
    }

    $setViewport(val) {
        if (this._viewport == val) {
            return;
        }
        if (this._viewport) {
            this._viewport.removeListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
            this._viewport.removeListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
            this._viewport.removeListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
            this._viewport.removeListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
        }
        this._viewport = val;
        this._viewport.viewer = this;
        this._viewport.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
        this._viewport.addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
        this._viewport.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
        this._viewport.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
        if (this._viewport.parent != this) {
            this.addChild(this._viewport);
        }
    }

    $setWidth(val) {
        this._viewSize.width = val;
    }

    $setHeight(val) {
        this._viewSize.height = val;
    }

    $getWidth() {
        return this._viewSize.width;
    }

    $getHeight() {
        return this._viewSize.height;
    }

    //////////////////////////////////get&set//////////////////////////////////
    set viewport(val) {
        this.$setViewport(val);
    }

    get viewport() {
        return this._viewport;
    }

    get releaseItemDistance() {
        return this._upGap;
    }

    set releaseItemDistance(val) {
        this._upGap = +val || 0;
    }
}

exports.Scroller = Scroller;