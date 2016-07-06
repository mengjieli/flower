class PopManager extends Sprite {

    __panels = [];

    constructor() {
        super();
    }

    $resize(width, height) {
        this.width = width;
        this.height = height;
        var panels = this.__panels;
        for (var i = 0; i < panels.length; i++) {
            var item = panels[i];
            var panel = item.panel;
            if (item.center) {
                panel.x = (this.width - panel.width) / 2;
                panel.y = (this.height - panel.height) / 2;
            }
            if (item.mask) {
                var shape = item.mask;
                shape.clear();
                shape.drawRect(0, 0, width, height);
            }
        }
    }

    removeChild(child) {
        var panels = this.__panels;
        for (var i = 0; i < panels.length; i++) {
            if (panels[i].panel == child) {
                if (panels[i].mask) {
                    super.removeChild(panels[i].mask);
                }
                panels.splice(i, 1);
            }
        }
        super.removeChild(child);
    }

    pop(panel, mask = false, center = false) {
        var find = false;
        var item;
        var panels = this.__panels;
        for (var i = 0; i < panels.length; i++) {
            if (panels[i] == panel) {
                item = panels[i];
                if (item.mask) {
                    this.removeChild(item.mask);
                }
                panels.splice(i, 1);
                find = true;
                break;
            }
        }
        var item = {
            mask: null,
            panel: panel,
            center: center
        };
        panels.push(item);
        if (center) {
            panel.x = (this.width - panel.width) / 2;
            panel.y = (this.height - panel.height) / 2;
        }
        if (mask) {
            item.mask = new Shape();
            item.mask.fillColor = 0;
            item.mask.fillAlpha = 0.4;
            item.mask.drawRect(0, 0, this.width, this.height);
            this.addChild(item.mask);
        }
        this.addChild(panel);
    }

    static instance;

    static getInstance() {
        if (!PopManager.instance) {
            PopManager.instance = new PopManager();
        }
        return PopManager.instance;
    }

    static pop(panel, mask = false, center = false) {
        PopManager.getInstance().pop(panel, mask, center);
    }
}

exports.PopManager = PopManager;