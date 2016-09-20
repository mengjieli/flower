class Scroller extends MaskUI {

    constructor() {
        super();

        this.$Scroller = {
            0: null,  //viewport
            1: flower.Size.create(0, 0), //viewSize
            2: 0,  //startX
            3: 0,  //startY
            4: [], //scrollDisX
            5: [], //scrollDisY
            6: [], //scrollTime
            //7: 0,  //lastTouchTime
            8: 0,  //throw Tween
            9: 18, //upGap
            10: null, //horizontalScrollBar
            11: null, //verticalScrollBar
            52: 0,//contentWidth
            53: 0,//contentHeight
        }
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
        this.width = this.height = 100;
        //var bg = new Rect();
        //bg.fillColor = 0x555555;
        //bg.percentWidth = 100;
        //bg.percentHeight = 100;
        //this.addChild(bg);
    }

    addChildAt(child, index) {
        if (child instanceof flower.HScrollBar) {
            _super.prototype.addChildAt.call(this, child, index);
            this.horizontalScrollBar = child;
        } else if (child instanceof flower.VScrollBar) {
            _super.prototype.addChildAt.call(this, child, index);
            this.verticalScrollBar = child;
        } else {
            if (index == this.numChildren || index == this.numChildren - 1) {
                if (index == this.numChildren && this.getChildAt(this.numChildren) instanceof flower.ScrollBar) {
                    index--;
                }
                if (index == this.numChildren - 1 && this.getChildAt(this.numChildren - 1) instanceof flower.ScrollBar) {
                    index--;
                }
            }
            _super.prototype.addChildAt.call(this, child, index);
        }
    }

    $createShape() {
        var shape = new Rect();
        shape.percentWidth = 100;
        shape.percentHeight = 100;
        return shape;
    }

    __onTouchScroller(e) {
        var p = this.$Scroller;
        if (!p[0]) {
            return;
        }
        var x = this.lastTouchX;
        var y = this.lastTouchY;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                if (p[8]) {
                    p[8].dispose();
                    p[8] = null;
                }
                p[2] = x - p[0].x;
                p[3] = y - p[0].y;
                p[4].length = p[5].length = p[6].length = 0;
                break;
            case flower.TouchEvent.TOUCH_MOVE:
                if (Math.abs(x - p[2]) > p[9] || Math.abs(y - p[3]) > p[9]) {
                    p[0].$releaseItem();
                }
                var _x = p[0].x;
                var _y = p[0].y;
                if (p[0].contentWidth > this.width) {
                    p[0].x = x - p[2];
                }
                if (p[0].contentHeight > this.height) {
                    p[0].y = y - p[3];
                }
                if (p[0].y > this.height) {
                    p[0].y = this.height;
                }
                if (p[0].y < -p[0].contentHeight) {
                    p[0].y = -p[0].contentHeight;
                }
                if (p[0].x > this.width) {
                    p[0].x = this.width;
                }
                if (p[0].x < -p[0].contentWidth) {
                    p[0].x = -p[0].contentWidth;
                }
                p[4].push(p[0].x - _x);
                p[5].push(p[0].y - _y);
                p[6].push(flower.CoreTime.currentTime);
                if (p[4].length > 4) {
                    p[4].shift();
                    p[5].shift();
                    p[6].shift();
                }
                //p[7] = flower.CoreTime.currentTime;
                break;
            case flower.TouchEvent.TOUCH_END:
            case flower.TouchEvent.TOUCH_RELEASE:
                var timeGap = 0.5;
                if (p[6].length) {
                    timeGap = flower.CoreTime.currentTime - p[6][0];
                }
                var disX = 0;
                var disY = 0;
                for (var i = 0; i < p[4].length; i++) {
                    disX += p[4][i];
                    disY += p[5][i];
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
                var toX = p[0].x + disX * 5;
                var toY = p[0].y + disY * 5;
                var flag = true;
                if (-toX + this.width > p[0].contentWidth) {
                    toX = this.width - p[0].contentWidth;
                    flag = false;
                }
                if (toX > 0) {
                    toX = 0;
                    flag = false;
                }
                if (-toY + this.height > p[0].contentHeight) {
                    toY = this.height - p[0].contentHeight;
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
                var timeX = Math.abs(toX - p[0].x) / 350;
                var timeY = Math.abs(toY - p[0].y) / 350;
                var time = timeX > timeY ? timeX : timeY;
                if (time < 0.5) {
                    time = 0.5;
                }
                if (time > 5) {
                    time = 5;
                }
                p[8] = flower.Tween.to(p[0], time, {
                    x: toX,
                    y: toY
                }, flower.Ease.CUBIC_EASE_OUT);
                break;
        }
    }

    $onFrameEnd() {
        var p = this.$Scroller;
        if (p[0]) {
            p[0].width = this.width;
            p[0].height = this.height;
        }
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
        this.$resetLayout();
    }

    dispose() {
        flower.Size.release(this.$Scroller[1]);
        super.dispose();
    }

    $setViewport(val) {
        var p = this.$Scroller;
        if (typeof val == "string") {
            var clazz = $root[val];
            if (!clazz) {
                clazz = flower.UIParser.getLocalUIClass(val.split(":")[val.split(":").length - 1], val.split(":").length > 1 ? val.split(":")[0] : "");
                if (!clazz) {
                    sys.$error(3201, val);
                }
            }
            val = new clazz();
        }
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        p[0].viewer = this;
        if (p[0].parent != this) {
            this.addChild(p[0]);
        }
        if (p[10]) {
            p[10].viewport = p[0];
        }
        if (p[11]) {
            p[11].viewport = p[0];
        }
    }

    /**
     * 设置水平滚动条
     * @param val
     */
    $setHorizontalScrollBar(val) {
        var p = this.$Scroller;
        if (p[10] == val) {
            return;
        }
        if (val == null) {
            p[10].viewport = null;
        }
        p[10] = val;
        if (p[10]) {
            p[10].viewport = p[0];
            if (p[10].parent != this) {
                this.addChild(p[10]);
            }
        }
    }

    /**
     * 设置垂直滚动条
     * @param val
     */
    $setVerticalScrollBar(val) {
        var p = this.$Scroller;
        if (p[11] == val) {
            return;
        }
        if (val == null) {
            p[11].viewport = null;
        }
        p[11] = val;
        if (p[11]) {
            p[11].viewport = p[0];
            if (p[11].parent != this) {
                this.addChild(p[11]);
            }
        }
    }

    $setWidth(val) {
        this.$Scroller[1].width = val;
    }

    $setHeight(val) {
        this.$Scroller[1].height = val;
    }

    $getWidth() {
        return this.$Scroller[1].width;
    }

    $getHeight() {
        return this.$Scroller[1].height;
    }

    //////////////////////////////////get&set//////////////////////////////////
    set viewport(val) {
        this.$setViewport(val);
    }

    get viewport() {
        return this.$Scroller[0];
    }

    get releaseItemDistance() {
        return this.$Scroller[9];
    }

    set releaseItemDistance(val) {
        this.$Scroller[9] = +val || 0;
    }

    set horizontalScrollBar(val) {
        this.$setHorizontalScrollBar(val);
    }

    set verticalScrollBar(val) {
        this.$setVerticalScrollBar(val);
    }
}

exports.Scroller = Scroller;