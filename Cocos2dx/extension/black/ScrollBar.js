class ScrollBar extends Group {

    constructor() {
        super();
        this.$ScrollerBar = {
            0: null,  //viewport
            1: true,  //autoVisibility
            2: null,  //thumb
            3: 0, //viewportX
            4: 0, //viewportY
            5: 0, //viewportScrollH
            6: 0, //viewportScrollV
            7: 0, //viewportContentWidth
            8: 0,  //viewportContentHeight
            9: 0, //viewportWidth
            10: 0, //viewportHeight
            20: null, //horizontal:true vertical:false
            50: 0, //touchStartPosition
            51: 0, //touchStartThumbPosition
        };
    }

    $onFrameEnd() {
        var p = this.$ScrollerBar;
        if (p[0] && p[20] != null) {
            var viewport = p[0];
            if (p[20]) {
                if ((p[3] != viewport.x || p[5] != viewport.scrollH || p[7] != viewport.contentWidth || p[9] != viewport.width)) {
                    p[3] = viewport.x;
                    p[5] = viewport.scrollH;
                    p[7] = viewport.contentWidth;
                    p[9] = viewport.width;
                    if (p[2]) {
                        if (p[7] < p[9]) {
                            p[2].width = this.width;
                            p[2].x = 0;
                        } else {
                            p[2].width = this.width * p[9] / p[7];
                            var x = -(this.width - p[2].width) * (p[3] - p[5]) / (p[7] - p[9]);
                            if (x < 0) {
                                x = 0;
                            }
                            if (x + p[2].width > this.width) {
                                x = this.width - p[2].width;
                            }
                            p[2].x = x;
                        }
                    }
                }
            }
            if (!p[20]) {
                if ((p[4] != viewport.y || p[6] != viewport.scrollH || p[8] != viewport.contentHeight || p[10] != viewport.height)) {
                    p[4] = viewport.y;
                    p[6] = viewport.scrollH;
                    p[8] = viewport.contentHeight;
                    p[10] = viewport.height;
                    if (p[2]) {
                        if (p[8] < p[10]) {
                            p[2].height = this.height;
                            p[2].y = 0;
                        } else {
                            p[2].height = this.height * p[10] / p[8];
                            var y = -(this.height - p[2].height) * (p[4] - p[6]) / (p[8] - p[10]);
                            if (y < 0) {
                                y = 0;
                            }
                            if (y + p[2].height > this.height) {
                                y = this.height - p[2].height;
                            }
                            p[2].y = y;
                        }
                    }
                }
            }
        }
        super.$onFrameEnd();
    }

    __onTouchThumb(e) {
        var p = this.$ScrollerBar;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                if (p[20]) {
                    p[50] = e.stageX;
                    p[51] = p[2].x;
                } else {
                    p[50] = e.stageY;
                    p[51] = p[2].y;
                }
                break;
            case flower.TouchEvent.TOUCH_MOVE:
                if (p[20]) {
                    if (p[7] < p[9]) {
                        return;
                    }
                    var x = p[51] - p[50] + e.stageX;
                    if (x < 0) {
                        x = 0;
                    }
                    if (x + p[2].width > this.width) {
                        x = this.width - p[2].width;
                    }
                    //p[2].x = x;
                    if (p[0]) {
                        p[0].x = -x * (p[7] - p[9]) / (this.width - p[2].width) + p[5];
                    }
                } else {
                    if (p[8] < p[10]) {
                        return;
                    }
                    var y = p[51] - p[50] + e.stageY;
                    if (y < 0) {
                        y = 0;
                    }
                    if (y + p[2].height > this.height) {
                        y = this.height - p[2].height;
                    }
                    //p[2].y = y;
                    if (p[0]) {
                        p[0].y = -y * (p[8] - p[10]) / (this.height - p[2].height) + p[6];
                    }
                }
                break;
        }
    }

    set viewport(val) {
        var p = this.$ScrollerBar;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
    }

    get viewport() {
        return this.$ScrollerBar[0];
    }

    set thumb(val) {
        var p = this.$ScrollerBar;
        if (p[2] == val) {
            return;
        }
        if (p[2]) {
            p[2].removeListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchThumb, this);
            p[2].removeListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchThumb, this);
        }
        p[2] = val;
        if (p[2]) {
            if (p[2].parent != this) {
                this.addChild(p[2]);
            }
            p[2].addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchThumb, this);
            p[2].addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchThumb, this);
        }
    }

    get thumb() {
        return this.$ScrollerBar[2];
    }

    set autoVisibility(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        this.$ScrollerBar[1] = val;
    }

    get autoVisibility() {
        return this.$ScrollerBar[1];
    }
}

exports.ScrollBar = ScrollBar;