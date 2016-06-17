class PlatformTextField {

    show;

    constructor() {
        this.show = new cc.LabelTTF("", "Times Roman", 12);
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
        show.setString("");
        show.setFontSize(12);
        show.setFontFillColor({r: 0, g: 0, b: 0}, true);
    }
}