var plists = {};
var NativeSprite = cc.Sprite.extend({

    ctor: function (url) {
        this._super();
        this.image = new flower.Image();
        this.image.addListener(flower.Event.COMPLETE, this.loadTextureComplete, this);
        this.addChild(this.image.$nativeShow.show);
        this.removeFlag = false;
        this.url = url;
        flower.EnterFrame.add(this.update, this);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                this.loadPlist(arguments[i]);
            }
        } else {
            this.image.source = url;
        }
        this.retain();
        this.setAnchorPoint(0.5, 0.5);
    },

    setAnchorPoint: function (x, y) {
        if (x != null && y != null) {
            this._anchorX = x;
            this._anchorY = y;
        } else {
            this._anchorX = x.x;
            this._anchorY = x.y;
        }
        this.image.x = -this.image.width * this._anchorX;
        this.image.y = -this.image.height * (1 - this._anchorY);
    },

    setAnchorPointX: function (x) {
        this.setAnchorPoint(x, this._anchorY);
    },

    setAnchorPointY: function (y) {
        this.setAnchorPoint(this._anchorX, y);
    },

    loadPlist: function (url) {
        if (this.image.source) {
            return;
        }
        if (!plists[url]) {
            var res = new flower.ResItem(url, flower.ResType.TEXT);
            res.addURL(url);
            var loader = new flower.URLLoader(res);
            loader.addListener(flower.Event.COMPLETE, this.loadPlistComplete, this);
            loader.load();
            plists[url] = {
                url: url,
                state: "loading",
                loader: loader,
                backList: [this]
            }
        } else {
            if (plists[url].state == "loading") {
                plists[url].backList.push(this);
            } else {
                this.getPlist(plists[url]);
            }
        }
    },

    loadPlistComplete: function (e) {
        var url = e.currentTarget.url;
        var content = e.data;
        var xml = flower.XMLElement.parse(content);
        xml = xml.list[0];
        var reslist;
        var attributes;
        var frames = [];
        for (var i = 0; i < xml.list.length; i++) {
            if (xml.list[i].name == "key") {
                if (xml.list[i].value == "frames") {
                    reslist = xml.list[i + 1];
                }
                else if (xml.list[i].value == "metadata") {
                    attributes = xml.list[i + 1];
                }
                i++;
            }
        }
        var frame;
        for (i = 0; i < reslist.list.length; i++) {
            if (reslist.list[i].name == "key") {
                frame = new flower.PlistFrame(reslist.list[i].value);
                frame.decode(reslist.list[i + 1]);
                frames.push(frame);
                i++;
            }
        }
        var item = plists[url];
        item.state = "complete";
        item.frames = frames;
        var list = item.backList;
        for (var i = 0; i < list.length; i++) {
            list[i].getPlist(item);
        }
        item.backList = null;
    },

    getPlist: function (plist) {
        if (this.removeFlag) {
            return;
        }
        for (var i = 0; i < plist.frames.length; i++) {
            if (plist.frames[i].name == this.url) {
                this.image.source = this.url + "#PLIST#" + plist.url;
                return;
            }
        }
    },

    loadTextureComplete: function (e) {
        this.setAnchorPoint(this._anchorX, this._anchorY);
    },

    update: function () {
        this.image.$onFrameEnd();
    },

    dispose: function () {
        if (this.removeFlag) {
            return;
        }
        flower.EnterFrame.remove(this.update, this);
        this.removeFlag = true;
        this.removeChild(this.image.$nativeShow.show);
        this.image.dispose();
        if (this.getParent()) {
            this.getParent().removeChild(this);
        }
        this.release();
    }

});
