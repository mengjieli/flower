class Group extends Sprite {

    $UIComponent;

    constructor() {
        super();
        this.$UIComponent = {
            0: null,//left
            1: null,//right
            2: null,//horizontalCenter
            3: null,//top
            4: null,//bottom
            5: null,//verticalCenter
            6: null,//percentWidth
            7: null,//percentHeight
        };
    }

    $setLeft(val) {
        var p = this.$UIComponent;
        if (p[0] == val) {
            return false;
        }
        p[0] = true;
        this.$invalidatePosition();
        if (p[1] != null || p[2] != null) {
            this.$invalidateContentBounds();
        }
        return true;
    }

    $setRight(val) {
        var p = this.$UIComponent;
        if (p[1] == val) {
            return false;
        }
        p[1] = true;
        this.$invalidatePosition();
        if (p[0] != null || p[2] != null) {
            this.$invalidateContentBounds();
        }
        return true;
    }

    $setHorizontalCenter(val) {
        var p = this.$UIComponent;
        if (p[2] == val) {
            return false;
        }
        p[2] = true;
        this.$invalidatePosition();
        if (p[0] != null || p[1] != null) {
            this.$invalidateContentBounds();
        }
        return true;
    }

    $setTop(val) {
        var p = this.$UIComponent;
        if (p[3] == val) {
            return false;
        }
        p[3] = true;
        this.$invalidatePosition();
        if (p[4] != null || p[5] != null) {
            this.$invalidateContentBounds();
        }
        return true;
    }

    $setBottom(val) {
        var p = this.$UIComponent;
        if (p[4] == val) {
            return false;
        }
        p[4] = true;
        this.$invalidatePosition();
        if (p[3] != null || p[5] != null) {
            this.$invalidateContentBounds();
        }
        return true;
    }

    $setVerticalCenter(val) {
        var p = this.$UIComponent;
        if (p[5] == val) {
            return false;
        }
        p[5] = true;
        this.$invalidatePosition();
        if (p[3] != null || p[4] != null) {
            this.$invalidateContentBounds();
        }
        return true;
    }

    $setPercentWidth(val) {
        if (val > 100) {
            val = 100;
        }
        if (val < 0) {
            val = 0;
        }
        var p = this.$UIComponent;
        if (p[6] == val) {
            return false;
        }
        p[6] = val;
        this.$invalidateContentBounds();
        return true;
    }

    $setPercentWidth(val) {
        if (val > 100) {
            val = 100;
        }
        if (val < 0) {
            val = 0;
        }
        var p = this.$UIComponent;
        if (p[7] == val) {
            return false;
        }
        p[7] = val;
        this.$invalidateContentBounds();
        return true;
    }

    $invalidateContentBounds() {
        super.$invalidateContentBounds();
    }

    $getX() {
        var p = this.$UIComponent;
        while (this.$hasFlags(0x1000)) {
            this.$removeFlags(0x1000);
            if (p[2] != null) {
                if (p[0] != null && p[1] == null) { //设置了 left、horizontalCenter
                    this.width = (p[2] - p[0]) * 2;
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null) { //设置了 right、horizontalCenter
                    this.width = (p[1] - p[2]) * 2;
                    this.x = 2 * p[2] - p[1];
                } else if (p[0] == null && p[1] == null) { //设置了 horizontalCenter
                    this.x = p[2] - this.width * 2;
                } else { //设置了 left、right、horizontalCenter  以 left 和 right 为主，horizontalCenter 不生效
                    this.width = p[1] - p[0];
                    this.x = p[0];
                }
            } else if (p[0] != null || p[1] == null) {
                if (p[0] != null && p[1] == null) { //设置了 left
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null) { //设置了 right
                    if (this.parent) {
                        this.x = this.parent.width - this.width * this.scaleX;
                    }
                } else { //设置了 left 和 right
                    this.width = p[1] - p[0];
                    this.x = p[0];
                }
            }
        }
        return super.$getX();
    }

    $getY() {
        var p = this.$UIComponent;
        while (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (p[5] != null) {
                if (p[3] != null && p[4] == null) { //设置了 left、horizontalCenter
                    this.height = (p[5] - p[3]) * 2;
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null) { //设置了 right、horizontalCenter
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] == null && p[4] == null) { //设置了 horizontalCenter
                    this.y = p[5] - this.height * 2;
                } else { //设置了 left、right、horizontalCenter  以 left 和 right 为主，horizontalCenter 不生效
                    this.height = p[4] - p[3];
                    this.y = p[3];
                }
            } else if (p[3] != null || p[4] == null) {
                if (p[3] != null && p[4] == null) { //设置了 left
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null) { //设置了 right
                    if (this.parent) {
                        this.y = this.parent.height - this.height * this.scaleY;
                    }
                } else { //设置了 left 和 right
                    this.height = p[4] - p[3];
                    this.y = p[3];
                }
            }
        }
        return super.$getY();
    }

    $invalidateX() {
        this.$addFlags(0x1000);
    }

    $invalidateY() {
        this.$addFlags(0x2000);
    }

    $invalidateScaleX() {
        this.$addFlags(0x4000);
    }

    $invalidateScaleY() {
        this.$addFlags(0x8000);
    }

    $getContentBounds() {
        var p = this.$UIComponent;
        while (this.$hasFlags(0x0001)) {
            super.$getContentBounds();
            if (p[0] != null && p[1] == null && p [2] != null) {
                this.width = (p[2] - p[0]) * 2;
                this.x = p[0];
            }
            else if (p[0] == null && p[1] != null && p[2] != null) {
                this.width = (p[1] - p[2]) * 2;
                this.x = 2 * p[2] - p[1];
            } else if (p[0] != null && p[1] != null) {
                this.width = p[1] - p[0];
                this.x = p[0];
            } else if (p[6]) {
                if (parent) {
                    this.width = this.parent.width * p[6] / 100;
                }
            }
            if (p[3] != null && p[4] == null && p [5] != null) {
                this.height = (p[5] - p[3]) * 2;
                this.y = p[3];
            }
            else if (p[3] == null && p[4] != null && p[5] != null) {
                this.height = (p[4] - p[5]) * 2;
                this.y = 2 * p[5] - p[4];
            } else if (p[3] != null && p[4] != null) {
                this.height = p[4] - p[3];
                this.y = p[3];
            } else if (p[7]) {
                if (parent) {
                    this.height = this.parent.height * p[6] / 100;
                }
            }
        }
    }

    $getScaleX() {
        this.$getContentBounds();
        return super.$getScaleX();
    }

    $getScaleY() {
        this.$getContentBounds();
        return super.$getScaleY();
    }

    $measureComponent() {
        if (this.$hasFlags(0x1000)) {
            this.$getX();
        }
        if (this.$hasFlags(0x2000)) {
            this.$getY();
        }
        if (this.$hasFlags(0x0001)) {
            this.$getContentBounds();
        }
    }

    get left() {
        var p = this.$UIComponent;
        return p[0];
    }

    set left(val) {
        this.$setLeft(val);
    }

    get right() {
        var p = this.$UIComponent;
        return p[1];
    }

    set right(val) {
        this.$setRight(val);
    }

    get horizontalCenter() {
        var p = this.$UIComponent[2];
        return p[2];
    }

    set horizontalCenter(val) {
        this.$setHorizontalCenter(val);
    }

    $onFrameEnd() {
        this.$measureComponent();
        super.$onFrameEnd();
    }
}