class DisplayObject {

    $DisplayObject;
    $parent;

    /**
     * 标志位
     * @type {number}
     * @private
     * 0x0001 链接矩阵失效位
     * 0x0002 链接矩阵的逆矩阵失效位
     * 0x0004 矩阵失效
     * 0x0008 自身显示区域变化
     * 0x0010 自身或子项显示区域变化
     * 0x0020 最终的透明度，从舞台开始计算，到对象本身 alpha*alpha*...
     */
    _DisplayFlags = 0;

    constructor() {
        super();
        this.$DisplayObject = {
            0: 1, //scaleX
            1: 1, //scaleY
            2: 0, //rotation
            3: 0, //skewX
            4: 0, //skewY
            5: 0, //skewXdeg
            6: 0, //skewYdeg,
            7: "", //name
            8: new Matrix(), //matrix
            9: new Matrix(), //concatMatrix 连接矩阵，到舞台的链接矩阵
            10: new Matrix(), //invertedConcatMatrix 连接矩阵的逆矩阵
            11: new Rectangle(), //bounds
            12: new Rectangle(), //contentBounds
            13: 0, //anchorOffsetX
            14: 0, //anchorOffsetY
            15: 0, //explicitWidth
            16: 0, //explicitHeight
        };
    }

    $addFlags(flags) {
        this._DisplayFlags |= flags;
    }

    $addFlagsUp(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlag(flags);
        var parent = this.parent;
        if (parent) {
            parent.$addFlagsUp(flags);
        }
    }

    $addFlagsDown(flags) {
        this.$addFlag(flags);
    }

    $removeFlags(flags) {
        this._DisplayFlags &= ~flags;
    }

    $removeFlagsUp(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlag(flags);
        var parent = this.parent;
        if (parent) {
            parent.$removeFlagsUp(flags);
        }
    }

    $hasFlags(flags) {
        return this._DisplayFlags & flags == flags;
    }

    get x() {
        return this.$DisplayObject[8].tx;
    }

    set x(val) {
        this.$setX(+val || 0);
    }

    $setX(val) {
        val = +val || 0;
        var m = this.$DisplayObject[8];
        if (val == m.tx) {
            return false;
        }
        m.tx = val;
        this.invalidatePosition();
        return true;
    }

    get y() {
        return this.$DisplayObject[8].ty;
    }

    set y(val) {
        this.$setY(+val || 0);
    }

    $setY(val) {
        val = +val || 0;
        var m = this.$DisplayObject[8];
        if (val == m.ty) {
            return false;
        }
        m.ty = val;
        this.invalidatePosition();
        return true;
    }

    get scaleX() {
        return this.$DisplayObject[0];
    }

    set scaleX(val) {
        this.$setScaleX(val);
    }

    $setScaleX(val) {
        val = +val || 0;
        var values = this.$DisplayObject;
        if (val == values[0]) {
            return false;
        }
        values[0] = val;
        this.invalidateMatrix();
        return true;
    }

    get scaleY() {
        return this.$DisplayObject[1];
    }

    set scaleY(val) {
        this.$setScaleY(val);
    }

    $setScaleY(val) {
        val = +val || 0;
        var values = this.$DisplayObject;
        if (val == values[1]) {
            return false;
        }
        values[1] = val;
        this.invalidateMatrix();
        return true;
    }

    get rotation() {
        return this.$DisplayObject[2];
    }

    set rotation(val) {
        this.$setRotation(val);
    }

    $setRotation(val) {
        val = +val || 0;
        val = clampRotation(val);
        var values = this.$DisplayObject;
        if (val == values[2]) {
            return false;
        }
        var delta = val - values[2];
        var angle = delta / 180 * Math.PI;
        values[2] = val;
        values[3] += angle;
        values[4] += angle;
        this.invalidateMatrix();
        return true;
    }

    get skewX() {
        return this.$DisplayObject[5];
    }

    set skewX(val) {
        this.$setSkewX(val);
    }

    $setSkewX(val) {
        val = +val || 0;
        var values = this.$DisplayObject;
        if (val == values[3]) {
            return false;
        }
        values[5] = val;
        val = clampRotation(val);
        val = val / 180 * Math.PI;
        values[3] = val;
        this.invalidateMatrix();
        return true;
    }

    get skewY() {
        return this.$DisplayObject[6];
    }

    set skewY(val) {
        this.$setSkewY(val);
    }

    $setSkewY(val) {
        val = +val || 0;
        var values = this.$DisplayObject;
        if (val == values[4]) {
            return false;
        }
        values[6] = val;
        val = clampRotation(val);
        val = val / 180 * Math.PI;
        values[4] = val;
        this.invalidateMatrix();
        return true;
    }

    get width() {
        return this.$getWidth();
    }

    $getWidth() {
        return isNaN(this.$getExplicitWidth()) ? this.$getOriginalBounds().width : this.$getExplicitWidth();
    }

    $getExplicitWidth() {
        return this.$DisplayObject[15];
    }

    set width(val) {
        this.$setWidth(val);
    }

    $setWidth(val) {
        this.$DisplayObject[15] = isNaN(val) ? NaN : val;
        val = +val || 0;
        if (val < 0) {
            return false;
        }
        //if (false) {
        //    var values = this.$DisplayObject;
        //    var originalBounds = this.$getOriginalBounds();
        //    var bounds = this.$getTransformedBounds(this.$parent, $TempRectangle);
        //    var angle = values[Keys.rotation] / 180 * Math.PI;
        //    var baseWidth = originalBounds.$getBaseWidth(angle);
        //    if (!baseWidth) {
        //        return false;
        //    }
        //    var baseHeight = originalBounds.$getBaseHeight(angle);
        //    values[Keys.scaleY] = bounds.height / baseHeight;
        //    values[Keys.scaleX] = val / baseWidth;
        //}
        this.invalidateMatrix();
        return true;
    }

    get height() {
        return this.$getHeight();
    }

    $getHeight() {
        return isNaN(this.$getExplicitHeight()) ? this.$getOriginalBounds().height : this.$getExplicitHeight();
    }

    $getExplicitHeight() {
        return this.$DisplayObject[16];
    }

    set height(val) {
        this.$setHeight(val);
    }

    $setHeight(value) {
        this.$DisplayObject[16] = isNaN(value) ? NaN : value;
        value = +value;
        if (value < 0) {
            return false;
        }
        //if (false) {
        //    var values = this.$DisplayObject;
        //    var originalBounds = this.$getOriginalBounds();
        //    var bounds = this.$getTransformedBounds(this.$parent, $TempRectangle);
        //    var angle = values[Keys.rotation] / 180 * Math.PI;
        //    var baseHeight = originalBounds.$getBaseHeight(angle);
        //    if (!baseHeight) {
        //        return false;
        //    }
        //    var baseWidth = originalBounds.$getBaseWidth(angle);
        //    values[Keys.scaleY] = value / baseHeight;
        //    values[Keys.scaleX] = bounds.width / baseWidth;
        //}
        this.invalidateMatrix();
        return true;
    }

    get measuredWidth() {
        return this.$getOriginalBounds().width;
    }

    get measuredHeight() {
        return this.$getOriginalBounds().height;
    }

    $visible = true;

    get visible() {
        return this.$visible;
    }

    set visible(val) {
        this.$setVisible(val);
    }

    $setVisible(val) {
        val = !!val;
        if (val == this.$visible) {
            return false;
        }
        this.$visible = val;
        return true;
    }

    $alpha = 1;

    get alpha() {
        return this.$alpha;
    }

    set alpha(val) {
        this.$setAlpha(val);
    }

    $setAlpha(val) {
        val = +val || 0;
        if (val == this.$alpha) {
            return;
        }
        this.$alpha = val;
        this.$addFlagsDown(0x0020);
    }

    $renderAlpha = 1;

    $getConcatenatedAlpha() {
        if (this.$hasFlags(0x0020)) {
            if (this.$parent) {
                var parentAlpha = this.$parent.$getConcatenatedAlpha();
                this.$renderAlpha = parentAlpha * this.$alpha;
            }
            else {
                this.$renderAlpha = this.$alpha;
            }
            this.$removeFlags(sys.DisplayObjectFlags.InvalidConcatenatedAlpha);
        }
        return this.$renderAlpha;
    }

    $touchEnabled = true;

    get touchEnabeld() {
        return this.$getTouchEnabeld();
    }

    $getTouchEnabled() {
        return this.$touchEnabled;
    }

    set touchEnabeld(val) {
        this.$setTouchEnabeld(val);
    }

    $setTouchEnabeld(val) {
        val = !!val;
        if (val == this.$touchEnabled) {
            return false;
        }
        this.$touchEnabled = val;
        return true;
    }

    $blendMode = 0;

    get blendMode() {
        return numberToBlendMode(this.$blendMode);
    }

    set blendMode(val) {
        this.$setBlendMode(val);
    }

    $setBlendMode(val) {
        val = blendModeToNumber(val);
        if (val == this.$blendMode) {
            return false;
        }
        this.$blendMode = val;
        return true;
    }

    get parent() {
        this.$parent;
    }

    get name() {
        return this.$DisplayObject[5];
    }

    set name(val) {
        this.$DisplayObject[5] = val;
    }

    /**
     * 标识位置失效
     * @private
     */
    invalidatePosition() {
        this.$addFlagsDown(0x0001 | 0x0002);
        if (this.parent) {
            this.parent.$addFlagsUp(0x0010);
        }
    }

    /**
     * @private
     * 标记矩阵失效
     */
    invalidateMatrix() {
        this.$addFlags(0x0004);
        this.invalidatePosition();
    }

    /**
     * @private
     * 标记自身的测量尺寸失效
     */
    $invalidateContentBounds() {
        this.$addFlags(0x0008);
        this.$propagateFlagsUp(0x0010);
    }

    /**
     * @private
     * 获取显示对象占用的矩形区域集合，通常包括自身绘制的测量区域，如果是容器，还包括所有子项占据的区域。
     */
    $getOriginalBounds() {
        var bounds = this.$DisplayObject[9];
        if (this.$hasFlags(0x0010)) {
            bounds.copyFrom(this.$getContentBounds());
            this.$measureChildBounds(bounds);
            this.$removeFlags(0x0010);
        }
        return bounds;
    }

    /**
     * @private
     * 测量子项占用的矩形区域
     * @param bounds 测量结果存储在这个矩形对象内
     */
    $measureChildBounds(bounds) {

    }

    /**
     * @private
     */
    $getContentBounds() {
        var bounds = this.$DisplayObject[10];
        if (this.$hasFlags(0x0008)) {
            this.$measureContentBounds(bounds);
            this.$removeFlags(0x0008);
        }
        return bounds;
    }

    /**
     * @private
     * 测量自身占用的矩形区域，注意：此测量结果并不包括子项占据的区域。
     * @param bounds 测量结果存储在这个矩形对象内
     */
    $measureContentBounds(bounds) {
    }
}

exports.DisplayObject = DisplayObject;