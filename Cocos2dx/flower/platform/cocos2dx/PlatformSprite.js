class PlatformSprite {

    show;

    constructor() {
        this.show = new cc.Node();
        this.show.setAnchorPoint(0, 0);
        this.show.retain();
    }

    addChild(child) {
        this.show.addChild(child.show);
    }

    removeChild(child) {
        this.show.removeChild(child.show);
    }

    resetChildIndex(children) {
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].$nativeShow.show.setLocalZOrder(i);
        }
    }

    set x(val) {
        this.show.setPositionX(val);
    }

    set y(val) {
        this.show.setPositionY(-val);
    }

    set scaleX(val) {
        console.log("set scaleX ," + val);
        this.show.setScaleX(val);
    }

    set scaleY(val) {
        console.log("set scaleY ," + val);
        this.show.setScaleY(val);
    }

    set rotation(val) {
        this.show.setRotation(val);
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
    }
}