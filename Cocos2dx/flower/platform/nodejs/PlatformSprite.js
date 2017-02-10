class PlatformSprite extends PlatformDisplayObject {

    __children = [];

    constructor(id) {
        super(id);
        this.initShow();
    }

    initShow() {
        //this.show = new cc.Node();
        //this.show.setAnchorPoint(0, 0);
        //this.show.retain();
        var msg = new flower.VByteArray();
        msg.writeUInt(6);
        msg.writeUInt(this.id);
        msg.writeUTF("Sprite");
        Platform.sendToClient(msg);
    }

    addChild(child) {
        var msg = new flower.VByteArray();
        msg.writeUInt(7);
        msg.writeUInt(this.id);
        msg.writeUInt(child.id);
        Platform.sendToClient(msg);
        this.__children.push(child);
    }

    removeChild(child) {
        for (var i = 0; i < this.__children.length; i++) {
            if (this.__children[i] == child) {
                this.__children.splice(i, 1);
                var msg = new flower.VByteArray();
                msg.writeUInt(8);
                msg.writeUInt(this.id);
                msg.writeUInt(child.id);
                Platform.sendToClient(msg);
                break;
            }
        }
    }

    resetChildIndex(children) {
        for (var i = 0, len = children.length; i < len; i++) {

            var msg = new flower.VByteArray();
            msg.writeUInt(9);
            msg.writeUInt(this.id);
            msg.writeUInt(children[i].$nativeShow.id);
            msg.writeUInt(i);
            Platform.sendToClient(msg);

            //children[i].$nativeShow.show.setLocalZOrder(i);
        }
    }

    setFilters(filters) {

    }
}