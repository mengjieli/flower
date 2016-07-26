class PlatformSprite extends PlatformDisplayObject {

    constructor() {
        super();
        this.initShow();
    }

    initShow() {
        //this.show = new cc.Node();
        //this.show.setAnchorPoint(0, 0);
        //this.show.retain();
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = "0px";
        div.style.top = "0px";
        div.style.width = "auto";
        div.style.height = "auto";
        div.style["transform-origin"] = "left top";
        this.show = div;
    }

    addChild(child) {
        this.show.appendChild(child.show);
    }

    removeChild(child) {
        this.show.removeChild(child.show);
    }

    resetChildIndex(children) {
        //for (var i = 0, len = children.length; i < len; i++) {
        //    children[i].$nativeShow.show.setLocalZOrder(i);
        //}
    }

    setFilters(filters) {

    }
}