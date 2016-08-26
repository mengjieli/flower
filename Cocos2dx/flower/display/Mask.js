class Mask extends Sprite {

    __shape;

    constructor() {
        super();
    }

    $initContainer() {
        this.__children = [];
        this.$nativeShow = Platform.create("Mask");
        this.__shape = this.$createShape();
        this.$nativeShow.setShape(this.__shape.$nativeShow,this.__shape);
    }

    $createShape() {
        return new Shape();
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.touchEnabled == false || this.visible == false)
            return null;
        if (multiply == true && this.multiplyTouchEnabled == false)
            return null;
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = math.floor(point.x);
        touchY = math.floor(point.y);
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
                    target = childs[i].$getMouseTarget(touchX, touchY, multiply);
                    if (target) {
                        break;
                    }
                }
            }
            return target;
        }
        return null;
    }

    get shape() {
        return this.__shape;
    }

    $releaseContainer() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        Platform.release("Mask", this.$nativeShow);
        this.$nativeShow = null;
    }
}

exports.Mask = Mask;