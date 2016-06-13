module flower {
    export class Scroller extends MaskUI {

        private _viewport:IViewPort;
        private _viewSize:flower.Size = flower.Size.create(0, 0);
        private _startX:number;
        private _startY:number;
        private _scrollDisX = [];
        private _scrollDisY = [];
        private _scrollTime = [];
        private _lastTouchTime;
        private _throw:flower.Tween;
        private _upGap = 18;

        public constructor() {
            super();
            flower.Component.init(this);
            var rect = new RectUI();
            rect.percentWidth = 100;
            rect.percentHeight = 100;
            this.shape = rect;
        }

        private touchScroller(e:TouchEvent) {
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
                    this._scrollTime.push(Time.currentTime);
                    if (this._scrollDisX.length > 4) {
                        this._scrollDisX.shift();
                        this._scrollDisY.shift();
                        this._scrollTime.shift();
                    }
                    this._lastTouchTime = Time.currentTime;
                    break;
                case flower.TouchEvent.TOUCH_END:
                case flower.TouchEvent.TOUCH_RELEASE:
                    var timeGap = 0.5;
                    if (this._scrollTime.length) {
                        timeGap = flower.Time.currentTime - this._scrollTime[0];
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
                    }, Ease.CUBIC_EASE_OUT);
                    break;
            }
        }

        protected resetUIProperty():void {
            super.resetUIProperty();
            if (this._viewport) {
                this._viewport.width = this.width;
                this._viewport.height = this.height;
            }
        }

        public dispose() {
            flower.Size.release(this._viewSize);
            super.dispose();
        }

        //////////////////////////////////get&set//////////////////////////////////
        public set viewport(val:IViewPort) {
            if (this._viewport == val) {
                return;
            }
            if (this._viewport) {
                this._viewport.removeListener(flower.TouchEvent.TOUCH_BEGIN, this.touchScroller, this);
                this._viewport.removeListener(flower.TouchEvent.TOUCH_MOVE, this.touchScroller, this);
                this._viewport.removeListener(flower.TouchEvent.TOUCH_END, this.touchScroller, this);
                this._viewport.removeListener(flower.TouchEvent.TOUCH_RELEASE, this.touchScroller, this);
            }
            this._viewport = val;
            this._viewport.viewer = this;
            this._viewport.addListener(flower.TouchEvent.TOUCH_BEGIN, this.touchScroller, this);
            this._viewport.addListener(flower.TouchEvent.TOUCH_MOVE, this.touchScroller, this);
            this._viewport.addListener(flower.TouchEvent.TOUCH_END, this.touchScroller, this);
            this._viewport.addListener(flower.TouchEvent.TOUCH_RELEASE, this.touchScroller, this);
            if (this._viewport.parent != this) {
                this.addChild(this._viewport);
            }
        }

        public get viewport():IViewPort {
            return this._viewport;
        }

        public get releaseItemDistance() {
            return this._upGap;
        }

        public set releaseItemDistance(val:number) {
            this._upGap = +val || 0;
        }
    }
}