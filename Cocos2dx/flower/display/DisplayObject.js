class DisplayObject extends EventDispatcher {

    static id = 0;

    $DisplayObject;

    /**
     * 脏标识
     * 0x0001 contentBounds 显示尺寸失效，自身显示区域失效，或者容器的子对象位置大小发生改变
     *        1) 父容器 contentBounds 失效 (并且设置了 percentWidth 或 percentHeight 或 left&right 或
     *        left&horizontalCenter 或 right& horizontalCenter或 top&bottom 或 top&verticalCenter 或 bottom&verticalCenter)
     * 0x0002 alpha 最终 alpha，即 alpha 值从根节点开始连乘到此对象
     * 0x0004 bounds 在父类中的尺寸失效
     * 0x0008 matrix
     * 0x0010 reverseMatrix
     * 0x0100 重排子对象顺序
     * 0x0400 shape需要重绘
     * 0x0800 文字内容改变
     * 0x1000 UI 属性失效
     */
    __flags = 0;

    /**
     * 父对象
     */
    __parent;

    /**
     * 舞台类
     */
    __stage;

    __alpha = 1;
    __parentAlpha = 1;
    __concatAlpha = 1;

    /**
     * native 显示，比如 cocos2dx 的显示对象或者 egret 的显示对象等...
     */
    $nativeShow;

    constructor() {
        super();
        this.$DisplayObject = {
            0: 1, //scaleX
            1: 1, //scaleY
            2: 0, //rotation
            3: null, //settingWidth
            4: null, //settingHeight
            5: "instance" + DisplayObject.id++, //name
            6: new Rectangle(), //contentBounds 自身显示尺寸失效
            7: new Rectangle(), //bounds 在父类中的表现尺寸
            8: true, //touchEnabeld
            9: true, //multiplyTouchEnabled
            10: 0, //lastTouchX
            11: 0, //lastTouchY
            12: new Matrix(), //matrix
            13: new Matrix(), //reverseMatrix
            14: 0, //radian
            50: false, //focusEnabeld
            60: [], //filters
            61: [], //parentFilters
        }
    }

    /**
     * 是否有此标识位
     * @param flags
     * @returns {boolean}
     */
    $hasFlags(flags) {
        return (this.__flags & flags) == flags ? true : false;
    }

    $addFlags(flags) {
        this.__flags |= flags;
    }

    $addFlagsUp(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
        if (this.__parent) {
            this.__parent.$addFlags(flags);
        }
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
    }

    $removeFlags(flags) {
        this.__flags &= ~flags;
    }

    $removeFlagsUp(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
        if (this.__parent) {
            this.__parent.$removeFlags(flags);
        }
    }

    $removeFlagsDown(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
    }

    $getX() {
        return this.$DisplayObject[12].tx;
    }

    $setX(val) {
        val = +val || 0;
        var matrix = this.$DisplayObject[12];
        if (val == matrix.tx) {
            return;
        }
        matrix.tx = val;
        this.$nativeShow.setX(val);
        this.$invalidateReverseMatrix();
    }

    $getY() {
        return this.$DisplayObject[12].ty;
    }

    $setY(val) {
        val = +val || 0;
        var matrix = this.$DisplayObject[12];
        if (val == matrix.ty) {
            return;
        }
        matrix.ty = val;
        this.$nativeShow.setY(val);
        this.$invalidateReverseMatrix();
    }

    $setScaleX(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$nativeShow.setScaleX(val);
        this.$invalidateMatrix();
    }

    $getScaleX() {
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getContentBounds();
        }
        return p[0];
    }

    $setScaleY(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        this.$nativeShow.setScaleY(val);
        this.$invalidateMatrix();
    }

    $getScaleY() {
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getContentBounds();
        }
        return p[1];
    }

    $setRotation(val) {
        val = +val || 0;
        if (val < 0) {
            val = 360 - (-val) % 360;
        } else {
            val = val % 360;
        }
        var p = this.$DisplayObject;
        if (p[2] == val) {
            return;
        }
        p[2] = val;
        p[14] = val * Math.PI / 180;
        this.$nativeShow.setRotation(val);
        this.$invalidateMatrix();
    }

    $getMatrix() {
        var p = this.$DisplayObject;
        var matrix = p[12];
        if (this.$hasFlags(0x0008)) {
            this.$removeFlags(0x0008);
            matrix.$updateSR(p[0], p[1], p[14]);
        }
        return matrix;
    }

    $getReverseMatrix() {
        var p = this.$DisplayObject;
        var matrix = p[13];
        if (this.$hasFlags(0x0010)) {
            this.$removeFlags(0x0010);
            matrix.$updateRST(-p[14], 1 / p[0], 1 / p[1], -p[12].tx, -p[12].ty);
        }
        return matrix;
    }

    $setAlpha(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        if (val == this.__alpha) {
            return;
        }
        this.__alpha = val;
        this.$addFlagsDown(0x0002);
    }

    $getConcatAlpha() {
        if (this.$hasFlags(0x0002)) {
            this.__concatAlpha = this.__alpha;
            if (this.__parent) {
                this.__concatAlpha *= this.__parent.$getConcatAlpha();
            }
            this.$removeFlags(0x0002);
        }
        return this.__concatAlpha;
    }

    $setWidth(val) {
        val = +val || 0;
        val = val < 0 ? 0 : val;
        var p = this.$DisplayObject;
        if (p[3] == val) {
            return false;
        }
        p[3] = val;
        this.$invalidatePosition();
        return true;
    }

    $getWidth() {
        var p = this.$DisplayObject;
        return p[3] != null ? p[3] : this.$getContentBounds().width;
    }

    $setHeight(val) {
        val = +val || 0;
        val = val < 0 ? 0 : val;
        var p = this.$DisplayObject;
        if (p[4] == val) {
            return false;
        }
        p[4] = val;
        this.$invalidatePosition();
        return true;
    }

    $getHeight() {
        var p = this.$DisplayObject;
        return p[4] != null ? p[4] : this.$getContentBounds().height;
    }

    $getBounds() {
        var rect = this.$DisplayObject[7];
        if (this.$hasFlags(0x0004)) {
            this.$removeFlags(0x0004);
            var contentRect = this.$getContentBounds();
            rect.copyFrom(contentRect);
            var matrix = this.$getMatrix();
            matrix.$transformRectangle(rect);
        }
        return rect;
    }

    $getContentBounds() {
        var rect = this.$DisplayObject[6];
        while (this.$hasFlags(0x0001)) {
            this.$removeFlags(0x0001);
            this.$measureContentBounds(rect);
            this.$checkSettingSize(rect);
        }
        return rect;
    }

    $setTouchEnabled(val) {
        var p = this.$DisplayObject;
        if (p[8] == val) {
            return false;
        }
        p[8] = val;
        return true;
    }

    $setMultiplyTouchEnabled(val) {
        varp = this.$DisplayObject;
        if (p[9] == val) {
            return false;
        }
        p[9] = val;
        return true;
    }

    $checkSettingSize(rect) {
        var p = this.$DisplayObject;
        /**
         * 尺寸失效， 并且约定过 宽 或者 高
         */
        if (p[3] != null) {
            if (rect.width == 0) {
                if (p[3] == 0) {
                    this.scaleX = 0;
                } else {
                    this.scaleX = 1;
                }
            } else {
                this.scaleX = p[3] / rect.width;
            }
        }
        if (p[4]) {
            if (rect.height == 0) {
                if (p[4] == 0) {
                    this.scaleY = 0;
                } else {
                    this.scaleY = 1;
                }
            } else {
                this.scaleY = p[4] / rect.height;
            }
        }
    }

    $setParent(parent, stage) {
        this.__parent = parent;
        this.__stage = stage;
        var parentAlpha = parent ? parent.$getConcatAlpha() : 1;
        if (this.__parentAlpha != parentAlpha) {
            this.__parentAlpha = parentAlpha;
            this.$addFlagsDown(0x0002);
        }
        if (this.__parent) {
            this.$setParentFilters(this.__parent.$getAllFilters());
            this.dispatchWidth(Event.ADDED);
        } else {
            this.$setParentFilters(null);
            this.dispatchWidth(Event.REMOVED);
        }
    }

    $dispatchAddedToStageEvent() {
        if (this.__stage) {
            this.dispatchWidth(Event.ADDED_TO_STAGE);
        }
    }

    $dispatchRemovedFromStageEvent() {
        if (!this.__stage) {
            this.dispatchWidth(Event.REMOVED_FROM_STAGE);
        }
    }

    $setFilters(val) {
        if (val == null) {
            val = [];
        }
        var p = this.$DisplayObject;
        p[60] = val;
        this.$changeAllFilters();
        return true;
    }

    $setParentFilters(val) {
        if (val == null) {
            val = [];
        }
        var p = this.$DisplayObject;
        p[61] = val;
        this.$changeAllFilters();
    }

    $changeAllFilters() {
        this.$nativeShow.setFilters(this.$getAllFilters());
    }

    $getAllFilters() {
        var p = this.$DisplayObject;
        return [].concat(p[60]).concat(p[61]);
    }

    dispatch(e) {
        super.dispatch(e);
        if (e.bubbles && this.__parent) {
            this.__parent.dispatch(e);
        }
    }

    get x() {
        return this.$getX();
    }

    set x(val) {
        this.$setX(val);
    }

    get y() {
        return this.$getY();
    }

    set y(val) {
        this.$setY(val);
    }

    get scaleX() {
        return this.$getScaleX();
    }

    set scaleX(val) {
        this.$setScaleX(val);
    }

    get scaleY() {
        return this.$getScaleY();
    }

    set scaleY(val) {
        this.$setScaleY(val);
    }

    get rotation() {
        var p = this.$DisplayObject;
        return p[2];
    }

    set rotation(val) {
        this.$setRotation(val);
    }

    get radian() {
        return this.$DisplayObject[14];
    }

    get alpha() {
        return this.__alpha;
    }

    set alpha(val) {
        this.$setAlpha(val);
    }

    get width() {
        return this.$getWidth();
    }

    set width(val) {
        this.$setWidth(val);
    }

    get height() {
        return this.$getHeight();
    }

    set height(val) {
        this.$setHeight(val);
    }

    get parent() {
        return this.__parent;
    }

    get stage() {
        return this.__stage;
    }

    get name() {
        var p = this.$DisplayObject;
        return p[5];
    }

    get touchEnabled() {
        var p = this.$DisplayObject;
        return p[8];
    }

    set touchEnabled(val) {
        this.$setTouchEnabeld(val);
    }

    get multiplyTouchEnabled() {
        var p = this.$DisplayObject;
        return p[9];
    }

    set multiplyTouchEnabled(val) {
        this.$setMultiplyTouchEnabled(val);
    }

    get lastTouchX() {
        var p = this.$DisplayObject;
        return p[10];
    }

    get lastTouchY() {
        var p = this.$DisplayObject;
        return p[11];
    }

    get filters() {
        return this.$getAllFilters();
    }

    set filters(val) {
        this.$setFilters(val);
    }

    get $focusEnabled() {
        var p = this.$DisplayObject;
        return p[50];
    }

    set $focusEnabled(val) {
        var p = this.$DisplayObject;
        p[50] = val;
    }

    /**
     * 计算自身尺寸
     * 子类实现
     * @param size
     */
    $measureContentBounds(rect) {

    }

    /**
     * 计算自身在父类中的尺寸
     * @param rect
     */
    $measureBounds(rect) {

    }

    /**
     * 本身尺寸失效
     */
    $invalidateContentBounds() {
        this.$addFlagsUp(0x0001 | 0x0004);
    }

    /**
     * 矩阵失效
     */
    $invalidateMatrix() {
        this.$addFlags(0x0008 | 0x0010);
        this.$invalidatePosition();
    }

    /**
     * 逆矩阵失效
     */
    $invalidateReverseMatrix() {
        this.$addFlags(0x0010);
        this.$invalidatePosition();
    }

    /**
     * 位置失效
     */
    $invalidatePosition() {
        this.$addFlagsUp(0x0004);
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.touchEnabled == false || this._visible == false)
            return null;
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = Math.floor(point.x);
        touchY = Math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        var bounds = this.$getContentBounds();
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + this.width && touchY < bounds.y + this.height) {
            return this;
        }
        return null;
    }

    $onFrameEnd() {
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.setAlpha(this.$getConcatAlpha());
        }
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getContentBounds();
        }
    }

    dispose() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.dispose();
    }
}