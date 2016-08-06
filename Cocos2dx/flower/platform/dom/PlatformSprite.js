class PlatformSprite extends PlatformDisplayObject {

    __children = [];

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
        this.__children.push(child.show);
    }

    removeChild(child) {
        this.show.removeChild(child.show);
        for (var i = 0; i < this.__children.length; i++) {
            if (this.__children[i] == child.show) {
                this.__children.splice(i, 1);
                break;
            }
        }
    }

    resetChildIndex(children) {
        for (var i = 0, len = children.length; i < len; i++) {
            var show = children[i].$nativeShow.show;
            if (this.__children[i] != show) {
                this.removeChild(children[i].$nativeShow);
                this.show.insertBefore(show, this.__children[i]);
                this.__children.splice(i, 0, show);
            }
        }
    }

    setFilters(filters) {

    }
}