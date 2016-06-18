class DisplayObject extends EventDispatcher {

    __x;
    __y;

    __DisplayObject;

    /**
     * 脏标识
     * 0x0001 size 显示尺寸失效，自身显示区域失效，或者容器的子对象位置大小发生改变
     * 0x0002 alpha 最终 alpha，即 alpha 值从根节点开始连乘到此对象
     * 0x0100 重排子对象顺序
     */
    __flags;

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
        this.__DisplayObject = {
            0: 1, //scaleX
            1: 1, //scaleY
            2: 0, //rotation
            3: null, //settingWidth
            4: null, //settingHeight
            5: "", //name
            6: new Size() //size 自身尺寸
        }
        this.__flags = 0;
    }

    /**
     * 是否有此标识位
     * @param flags
     * @returns {boolean}
     */
    $hasFlags(flags) {
        return this.__flags & flags == flags ? true : false;
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
        this.$nativeShow.x = val;
        this.$invalidPositionScale();
    }

    $setY(val) {
        val = +val || 0;
        if (val == this.__y) {
            return;
        }
        this.__y = val;
        this.$nativeShow.y = val;
        this.$invalidPositionScale();
    }

    $setScaleX(val) {
        val = +val || 0;
        var p = this.__DisplayObject;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$nativeShow.scaleX = val;
        this.$invalidPositionScale();
    }

    $setScaleY(val) {
        val = +val || 0;
        var p = this.__DisplayObject;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        this.$nativeShow.scaleY = val;
        this.$invalidPositionScale();
    }

    $setRotation(val) {
        val = +val || 0;
        console.log("rot1? " + val);
        var p = this.__DisplayObject;
        console.log("rot12 " + val + "," + p[2]);
        if (p[2] == val) {
            console.log("rot0!? " + val);
            return;
        }
        p[2] = val;
        this.$nativeShow.rotation = val;
        this.$invalidPositionScale();
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
        var p = this.__DisplayObject;
        if (p[3] == val) {
            return;
        }
        p[3] = val;
        this.invalidSize();
    }

    $getWidth() {
        var p = this.__DisplayObject;
        return p[2] != null ? p[2] : this.$getSize().height;
    }

    $setHeight(val) {
        val = +val || 0;
        val = val < 0 ? 0 : val;
        var p = this.__DisplayObject;
        if (p[4] == val) {
            return;
        }
        p[4] = val;
        this.invalidSize();
    }

    $getHeight() {
        var p = this.__DisplayObject;
        return p[3] != null ? p[3] : this.$getSize().width;
    }

    $getSize() {
        var size = this.__DisplayObject[6];
        if (this.$hasFlags(0x0001)) {
            this.calculateSize();
            this.$removeFlags(0x0001);
        }
        return size;
    }

    $setParent(parent, stage) {
        this.__parent = parent;
        this.__stage = stage;
        this.$addFlagsDown(0x0002);
        if (this.__parent) {
            this.dispatchWidth(Event.ADDED);
        } else {
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

    dispatch(e) {
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
        var p = this.__DisplayObject;
        return p[0];
    }

    set scaleX(val) {
        this.$setScaleX(val);
    }

    get scaleY() {
        var p = this.__DisplayObject;
        return p[1];
    }

    set scaleY(val) {
        this.$setScaleY(val);
    }

    get rotation() {
        var p = this.__DisplayObject;
        return p[2];
    }

    set rotation(val) {
        this.$setRotation(val);
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

    /**
     * 计算尺寸
     * 子类实现
     * @param size
     */
    calculateSize(size) {

    }

    /**
     * 本身尺寸失效
     */
    invalidSize() {
        this.$addFlagsUp(0x0001);
    }

    $invalidPositionScale() {
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.alpha = this.$getConcatAlpha();
        }
    }

    dispose() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.dispose();
    }
}