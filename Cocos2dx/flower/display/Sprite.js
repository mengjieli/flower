class Sprite extends DisplayObject {

    __children;

    constructor() {
        super();
        this.$initContainer();
    }

    $initContainer() {
        this.__children = [];
        this.$nativeShow = Platform.create("Sprite");
    }

    $addFlags(flags) {
        if (flags == 0x0001) {
            this.$addFlagsDown()
        }
        //this.__flags |= flags;
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$addFlagsDown(flags);
        }
    }

    $removeFlagsDown(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$removeFlagsDown(flags);
        }
    }

    addChild(child) {
        this.addChildAt(child, this.__children.length);
    }

    addChildAt(child, index) {
        var children = this.__children;
        if (index < 0 || index > children.length) {
            return;
        }
        if (child.parent == this) {
            this.setChildIndex(child, index);
        } else {
            if (child.parent) {
                child.parent.$removeChild(child);
            }
            this.$nativeShow.addChild(child.$nativeShow);
            children.splice(index, 0, child);
            child.$setParent(this, this.stage);
            if (child.parent == this) {
                child.$dispatchAddedToStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
            }
        }
    }

    $removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                break;
            }
        }
    }

    removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                this.$nativeShow.removeChild(child);
                children.splice(i, 1);
                child.$setParent(null, null);
                child.$dispatchRemovedFromStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                break;
            }
        }
    }

    removeChildAt(index) {
        var children = this.__children;
        if (index < 0 || index >= children.length) {
            return;
        }
        this.removeChild(children[index]);
    }

    setChildIndex(child, index) {
        var childIndex = this.getChildIndex(child);
        if (childIndex == index) {
            return;
        }
        var children = this.__children;
        children.splice(childIndex, 1);
        children.splice(index, 0, child);
        this.$addFlags(0x0100);
    }

    getChildIndex(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (child == children[i]) {
                return i;
            }
        }
        return -1;
    }

    $changeAllFilters() {
        super.$changeAllFilters();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$setParentFilters(this.$getAllFilters());
        }
    }

    /**
     * 测量子对象的区域
     * @param rect
     */
    $measureChildrenBounds(rect) {
        var minX = 0;
        var minY = 0;
        var maxX = 0;
        var maxY = 0;
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            var bounds = children[i].$getBounds();
            if (i == 0) {
                minX = bounds.x;
                minY = bounds.y;
                maxX = bounds.x + bounds.width;
                maxY = bounds.y + bounds.height;
            } else {
                if (bounds.x < minX) {
                    minX = bounds.x;
                }
                if (bounds.y < minY) {
                    minY = bounds.y;
                }
                if (bounds.x + bounds.width > maxX) {
                    maxX = bounds.x + bounds.width;
                }
                if (bounds.y + bounds.height > maxY) {
                    maxY = bounds.y + bounds.height;
                }
            }
        }
        rect.x = minX;
        rect.y = minX;
        rect.width = maxX - minX;
        rect.height = maxY - minY;
    }

    $getMouseTarget(touchX, touchY, multiply) {
        if (this.touchEnabled == false || this.visible == false)
            return null;
        if (multiply == true && this.multiplyTouchEnabled == false)
            return null;
        var point = this.$getReverseMatrix().transformPoint(touchX, touchY, Point.$TempPoint);
        touchX = Math.floor(point.x);
        touchY = Math.floor(point.y);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
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

    $onFrameEnd() {
        var children = this.__children;
        /**
         * 子对象序列改变
         */
        if (this.$hasFlags(0x0100)) {
            this.$nativeShow.resetChildIndex(children);
            this.$removeFlags(0x0100);
        }
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$onFrameEnd();
        }
        super.$onFrameEnd();
    }

    get numChildren() {
        return this.__children.length;
    }

    $releaseContainer() {
        Platform.release("Sprite", this.$nativeShow);
    }

    dispose() {
        var children = this.__children;
        while (children.length) {
            var child = children[children.length - 1];
            child.dispose();
        }
        super.dispose();
        this.$releaseContainer();
    }
}

exports.Sprite = Sprite;