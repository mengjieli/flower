class Mask extends Sprite {

    __shape;

    constructor() {
        super();
    }

    $initContainer() {
        this.__children = [];
        this.$nativeShow = Platform.create("Mask");
        this.__shape = new Shape();
        this.$nativeShow.setShape(this.__shape.$nativeShow);
    }

    $getMouseTarget(matrix, multiply) {
        if (this.touchEnabled == false || this.visible == false)
            return null;
        if (multiply == true && this.multiplyTouchEnabled == false)
            return null;
        matrix.save();
        matrix.translate(-this.x, -this.y);
        if (this.rotation)
            matrix.rotate(-this.radian);
        if (this.scaleX != 1 || this.scaleY != 1) {
            matrix.scale(1 / this.scaleX, 1 / this.scaleY);
        }
        var touchX = Math.floor(matrix.tx);
        var touchY = Math.floor(matrix.ty);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        var bounds = this.shape.$getContentBounds();
        if (touchX >= bounds.x && touchY >= bounds.y && touchX < bounds.x + bounds.width && touchY < bounds.y + bounds.height) {
            var target;
            var childs = this.__children;
            var len = childs.length;
            for (var i = len - 1; i >= 0; i--) {
                if (childs[i].touchEnabled && (multiply == false || (multiply == true && childs[i].multiplyTouchEnabled == true))) {
                    target = childs[i].$getMouseTarget(matrix, multiply);
                    if (target) {
                        break;
                    }
                }
            }
            matrix.restore();
            return target;
        }
        return null;
    }

    get shape() {
        return this.__shape;
    }

    $releaseContainer() {
        Platform.release("Mask", this.$nativeShow);
    }
}

exports.Mask = Mask;