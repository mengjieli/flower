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
            20: null //horizontal:true vertical:false
        };
    }


    $onFrameEnd() {
        var p = this.$ScrollerBar;
        if (p[0] && p[20]) {
            var viewport = p[0];
            if (p[20]) {
                if ((p[3] != viewport.x || p[5] != viewport.scrollH || p[7] != viewport.contentWidth || p[9] != viewport.width)) {
                    if (viewport.x < viewport.scrollH) {
                        viewport.x = viewport.scrollH;
                    }
                    if (viewport.x + viewport.width > viewport.scrollH + viewport.contentWidth) {
                        viewport.x = viewport.scrollH + viewport.contentWidth - viewport.width;
                    }
                    p[3] = viewport.x;
                    p[5] = viewport.scrollH;
                    p[7] = viewport.contentWidth;
                    p[9] = viewport.width;
                    if (p[2]) {
                        p[2].width = this.width * p[9] / p[7];
                        p[2].x = (this.width - p[2].width) * (p[3] - p[5]) / (p[7] - p[9]);
                        if (p[1]) {
                            if (p[7] <= p[9]) {
                                p[2].visible = false;
                            } else {
                                p[2].visible = true;
                            }
                        }
                    }
                }
            }
            if (!p[20] && (p[4] != viewport.y || p[6] != viewport.scrollV || p[8] != viewport.contentHeight || p[10] != viewport.height)) {
                if (viewport.y < viewport.scrollV) {
                    viewport.y = viewport.scrollV;
                }
                if (viewport.y + viewport.height > viewport.scrollV + viewport.contentHeight) {
                    viewport.y = viewport.scrollV + viewport.contentHeight - viewport.height;
                }
                p[4] = viewport.y;
                p[6] = viewport.scrollV;
                p[8] = viewport.contentHeight;
                p[10] = viewport.height;
                if (p[2]) {
                    p[2].height = this.height * p[10] / p[8];
                    p[2].y = (this.height - p[2].height) * (p[4] - p[6]) / (p[8] - p[10]);
                    if (p[1]) {
                        if (p[8] <= p[10]) {
                            p[2].visible = false;
                        } else {
                            p[2].visible = true;
                        }
                    }
                }
            }
        }
        super.$onFrameEnd();
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
}