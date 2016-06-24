class DisplayObject extends EventDispatcher {

    static id = 0;

    __x = 0;
    __y = 0;

    $DisplayObject;

    /**
     * 脏标识
     * 0x0001 contentBounds 显示尺寸失效，自身显示区域失效，或者容器的子对象位置大小发生改变
     * 0x0002 alpha 最终 alpha，即 alpha 值从根节点开始连乘到此对象
     * 0x0004 bounds 在父类中的尺寸失效
     * 0x0100 重排子对象顺序
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

    $setX(val) {
        val = +val || 0;
        if (val == this.__x) {
            return;
        }
        this.__x = val;
        this.$nativeShow.setX(val);
        this.$invalidatePosition();
    }

    $setY(val) {
        val = +val || 0;
        if (val == this.__y) {
            return;
        }
        this.__y = val;
        this.$nativeShow.setY(val);
        this.$invalidatePosition();
    }

    $setScaleX(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$nativeShow.setScaleX(val);
        this.$invalidatePosition();
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
        this.$invalidatePosition();
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
        var p = this.$DisplayObject;
        if (p[2] == val) {
            return;
        }
        p[2] = val;
        this.$nativeShow.setRotation(val);
        this.$invalidatePosition();
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
            return;
        }
        p[3] = val;
        this.$invalidatePosition();
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
            return;
        }
        p[4] = val;
        this.$invalidatePosition();
    }

    $getHeight() {
        var p = this.$DisplayObject;
        return p[4] != null ? p[4] : this.$getContentBounds().height;
    }

    $getBounds() {
        var rect = this.$DisplayObject[7];
        if (this.$hasFlags(0x0004)) {
            var contentRect = this.$getContentBounds();
            var x = this.x;
            var y = this.y;
            var scaleX = this.scaleX;
            var scaleY = this.scaleY;
            var rotation = this.radian;
            var list = [[contentRect.x, contentRect.y], [contentRect.x + contentRect.width, contentRect.y],
                [contentRect.x, contentRect.y + contentRect.height], [contentRect.x + contentRect.width, contentRect.y + contentRect.height]];
            var matrix = Matrix.create();
            var minX;
            var maxX;
            var minY;
            var maxY;
            for (var i = 0; i < list.length; i++) {
                matrix.identity();
                matrix.tx = list[i][0];
                matrix.ty = list[i][1];
                matrix.scale(scaleX, scaleY);
                matrix.rotate(rotation);
                matrix.translate(x, y);
                if (i == 0) {
                    minX = maxX = matrix.tx;
                    minY = maxY = matrix.ty;
                } else {
                    if (matrix.tx < minX) {
                        minX = matrix.tx;
                    }
                    if (matrix.ty < minY) {
                        minY = matrix.ty;
                    }
                    if (matrix.tx > maxX) {
                        maxX = matrix.tx;
                    }
                    if (matrix.ty > maxY) {
                        maxY = matrix.ty;
                    }
                }
            }
            Matrix.release(matrix);
            rect.x = minX;
            rect.y = minY;
            rect.width = maxX - minX;
            rect.height = maxY - minY;
            this.$removeFlags(0x0004);
        }
        return rect;
    }

    $getContentBounds() {
        var rect = this.$DisplayObject[6];
        if (this.$hasFlags(0x0001)) {
            this.$measureContentBounds(rect);
            this.$measureChildrenBounds(rect);
            this.$removeFlags(0x0001);
            if (rect.width == 0) {
                this.$measureContentBounds(rect);
                this.$measureChildrenBounds(rect);
            }
            this.__checkSettingSize(rect);
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

    __checkSettingSize(rect) {
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
        this.$addFlagsDown(0x0002);
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
        return this.__x;
    }

    set x(val) {
        this.$setX(val);
    }

    get y() {
        return this.__y;
    }

    set y(val) {
        this.$setY(val);
    }

    get scaleX() {
        var p = this.$DisplayObject;
        return p[0];
    }

    set scaleX(val) {
        this.$setScaleX(val);
    }

    get scaleY() {
        var p = this.$DisplayObject;
        return p[1];
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
        return this.rotation * Math.PI / 180;
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

    /**
     * 计算自身尺寸
     * 子类实现
     * @param size
     */
    $measureContentBounds(rect) {

    }

    /**
     * 测量子对象的尺寸
     * @param size
     */
    $measureChildrenBounds(rect) {

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
     * 位置失效
     */
    $invalidatePosition() {
        this.$addFlagsUp(0x0004);
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
    }

    $getMouseTarget(matrix, multiply) {
        if (this.touchEnabled == false || this._visible == false)
            return null;
        matrix.save();
        matrix.translate(-this.x, -this.y);
        if (this.rotation)
            matrix.rotate(-this.radian);
        if (this.scaleX != 1 || this.scaleY != 1)
            matrix.scale(1 / this.scaleX, 1 / this.scaleY);
        var touchX = Math.floor(matrix.tx);
        var touchY = Math.floor(matrix.ty);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        var bounds = this.$getContentBounds();
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.width && touchY < bounds.height) {
            return this;
        }
        matrix.restore();
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