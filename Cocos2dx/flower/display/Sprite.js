class Sprite extends DisplayObject {

    __children;

    constructor() {
        super();
        this.__children = [];
        this.$nativeShow = Platform.create("Sprite");
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
                this.invalidSize();
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
                this.invalidSize();
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
                this.invalidSize();
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

    dispose() {
        var children = this.__children;
        while (children.length) {
            var child = children[children.length - 1];
            child.dispose();
        }
        super.dispose();
        Platform.release("Sprite", this.$nativeShow);
    }
}

exports.Sprite = Sprite;