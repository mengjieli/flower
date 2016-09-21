class Sprite extends DisplayObject {

    __children;
    __childrenBounds;

    constructor() {
        super();
        this.$Sprite = {
            0: new flower.Rectangle() //childrenBounds
        }
        this.$initContainer();
    }

    $initContainer() {
        this.__children = [];
        this.$nativeShow = Platform.create("Sprite");
    }

    //$addFlags(flags) {
    //    if (flags == 0x0001) {
    //        this.$addFlagsDown()
    //    }
    //    //this.__flags |= flags;
    //}

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
        return child;
    }

    addChildAt(child, index) {
        var children = this.__children;
        if (index < 0 || index > children.length) {
            return child;
        }
        if (child.parent == this) {
            this.setChildIndex(child, index);
        } else {
            if (child.parent) {
                child.parent.$removeChild(child);
            }
            if (!this.$nativeShow) {
                $warn(1002, this.name);
                return null;
            }
            this.$nativeShow.addChild(child.$nativeShow);
            children.splice(index, 0, child);
            child.$setStage(this.stage);
            child.$setParent(this);
            if (child.parent == this) {
                child.$dispatchAddedToStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
            }
        }
        return child;
    }

    $setStage(stage) {
        super.$setStage(stage);
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$setStage(this.stage);
        }
    }

    $dispatchAddedToStageEvent() {
        super.$dispatchAddedToStageEvent();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$dispatchAddedToStageEvent();
        }
    }

    $dispatchRemovedFromStageEvent() {
        super.$dispatchRemovedFromStageEvent();
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$dispatchRemovedFromStageEvent();
        }
    }

    $removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                return child;
            }
        }
        return null;
    }

    removeChild(child) {
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i] == child) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.removeChild(child.$nativeShow);
                children.splice(i, 1);
                child.$setStage(null);
                child.$setParent(null);
                child.$dispatchRemovedFromStageEvent();
                this.$invalidateContentBounds();
                this.$addFlags(0x0100);
                return child;
            }
        }
        return null;
    }

    removeChildAt(index) {
        var children = this.__children;
        if (index < 0 || index >= children.length) {
            return;
        }
        return this.removeChild(children[index]);
    }

    setChildIndex(child, index) {
        var childIndex = this.getChildIndex(child);
        if (childIndex == index || childIndex < 0) {
            return null;
        }
        var children = this.__children;
        children.splice(childIndex, 1);
        children.splice(index, 0, child);
        this.$addFlags(0x0100);
        return child;
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

    getChildAt(index) {
        index = index & ~0;
        if (index < 0 || index > this.__children.length - 1) {
            $error(1007, "getChildAt", index, this.__children.length);
            return null;
        }
        return this.__children[index];
    }

    removeAll() {
        while (this.numChildren) {
            this.removeChildAt(0);
        }
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
    $measureContentBounds(rect) {
        var minX = 0;
        var minY = 0;
        var maxX = 0;
        var maxY = 0;
        var children = this.__children;
        for (var i = 0, len = children.length; i < len; i++) {
            if (!children[i].alpha || !children[i].visible) {
                continue;
            }
            var bounds = children[i].$getBounds(true);
            if (i == 0) {
                maxX = bounds.x + bounds.width;
                maxY = bounds.y + bounds.height;
            } else {
                if (bounds.x + bounds.width > maxX) {
                    maxX = bounds.x + bounds.width;
                }
                if (bounds.y + bounds.height > maxY) {
                    maxY = bounds.y + bounds.height;
                }
            }
        }
        rect.x = minX;
        rect.y = minY;
        rect.width = maxX - minX;
        rect.height = maxY - minY;
        var childrenBounds = this.$Sprite[0];
        childrenBounds.x = rect.x;
        childrenBounds.y = rect.y;
        childrenBounds.width = rect.width;
        childrenBounds.height = rect.height;
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
        var target;
        var childs = this.__children;
        var len = childs.length;
        for (var i = len - 1; i >= 0; i--) {
            if (childs[i].touchEnabled && childs[i].visible && (multiply == false || (multiply == true && childs[i].multiplyTouchEnabled == true))) {
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
            if (!this.$nativeShow) {
                $warn(1002, this.name);
                return;
            }
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

    get $childrenBounds() {
        return this.$Sprite[0];
    }

    $releaseContainer() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        Platform.release("Sprite", this.$nativeShow);
        this.$nativeShow = null;
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