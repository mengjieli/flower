var $UI7 = (function (_super) {
    __extends($UI7, _super);
    function $UI7(_data) {
        if(_data) this._data = _data;
        _super.call(this);
        this.$UI7_binds = [];
        this.$UI7_initMain(this);
        this.$UI7_setBindProperty();
        this.dispatchWidth(flower.UIEvent.CREATION_COMPLETE);
    }

    $UI7.prototype.$UI7_initMain = function(parentObject) {
        parentObject.width = 300;
        parentObject.height = 200;
        parentObject.scaleMode = "show_all";
        parentObject.creationComplete = "this.initPanel();";
        parentObject.addChild(this.$UI7_getRectUI(parentObject));
        parentObject.addChild(this.$UI7_getGroup(parentObject));
    }

    $UI7.prototype.$UI7_getRectUI = function(parentObject) {
        var rectui = flower.Theme.getObject("flower.RectUI") || new flower.RectUI();
        if(rectui.__UIComponent) rectui.eventThis = this;
        this.background = rectui;
        this.background.name = "background";
        rectui.percentWidth = 100;
        rectui.percentHeight = 100;
        rectui.lineColor = 0x333333;
        rectui.lineWidth = 1;
        rectui.fillColor = 0xE7E7E7;
        return rectui;
    }

    $UI7.prototype.$UI7_getRectUI2 = function(parentObject) {
        var rectui = flower.Theme.getObject("flower.RectUI") || new flower.RectUI();
        if(rectui.__UIComponent) rectui.eventThis = this;
        this.titleBar = rectui;
        this.titleBar.name = "titleBar";
        rectui.percentWidth = 100;
        rectui.percentHeight = 100;
        rectui.fillColor = 0xD0D0D0;
        rectui.touchBegin = "this.startDrag();";
        return rectui;
    }

    $UI7.prototype.$UI7_getLabel = function(parentObject) {
        var label = flower.Theme.getObject("flower.Label") || new flower.Label();
        if(label.__UIComponent) label.eventThis = this;
        this.titleLabel = label;
        this.titleLabel.name = "titleLabel";
        label.y = 3;
        label.touchEnabled = false;
        label.text = "Panel";
        label.horizontalCenter = 0;
        label.fontSize = 16;
        label.fontColor = 0x252325;
        return label;
    }

    $UI7.prototype.$UI7_getRectUI3 = function(parentObject) {
        var rectui = flower.Theme.getObject("flower.RectUI") || new flower.RectUI();
        if(rectui.__UIComponent) rectui.eventThis = this;
        rectui.percentWidth = 100;
        rectui.percentHeight = 100;
        rectui.setStatePropertyValue("fillColor", "up", "0xFC4A4A", [this]);
        rectui.setStatePropertyValue("fillColor", "down", "0x7D2525", [this]);
        return rectui;
    }

    $UI7.prototype.$UI7_getButton = function(parentObject) {
        var button = flower.Theme.getObject("flower.Button") || new flower.Button();
        if(button.__UIComponent) button.eventThis = this;
        this.closeButton = button;
        this.closeButton.name = "closeButton";
        button.width = 30;
        button.height = 24;
        button.right = 0;
        button.addChild(this.$UI7_getRectUI3(button));
        return button;
    }

    $UI7.prototype.$UI7_getGroup = function(parentObject) {
        var group = flower.Theme.getObject("flower.Group") || new flower.Group();
        if(group.__UIComponent) group.eventThis = this;
        group.left = 1;
        group.right = 1;
        group.height = 24;
        group.top = 1;
        group.addChild(this.$UI7_getRectUI2(group));
        group.addChild(this.$UI7_getLabel(group));
        group.addChild(this.$UI7_getButton(group));
        return group;
    }

    $UI7.prototype.initPanel = function() {
        this.addListener(flower.Event.ADDED, this.$onPanelAdded, this);
    }
    $UI7.prototype.$onPanelAdded = function() {
        this.getAddedTween();
    }
    $UI7.prototype.getAddedTween = function() {
        return null;
        return flower.Tween.to(this, 0.3, {
            x: (this.parent.width - this.width) / 2,
            y: (this.parent.height - this.height) / 2,
            scaleX: 1,
            scaleY: 1
        }, flower.Ease.BACK_EASE_OUT, {
            x: this.parent.width / 2,
            y: this.parent.height / 2,
            scaleX: 0,
            scaleY: 0
        });
    }
    $UI7.prototype.getCloseTween = function() {
        return null;
        return flower.Tween.to(this, 0.3, {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            scaleX: 0,
            scaleY: 0
        }, flower.Ease.SINE_EASE_IN_OUT, {
            x: this.x,
            y: this.y,
            scaleX: 1,
            scaleY: 1
        });
    }
    $UI7.prototype.close = function() {
        var tween = this.getCloseTween();
        if (tween) {
            tween.call(this.__closeComplete, this)
        } else {
            this.__closeComplete();
        }
    }
    $UI7.prototype.__closeComplete = function() {
        this.parent.dispose();
    }
    $UI7.prototype.$UI7_setBindProperty = function() {
        for(var i = 0; i < this.$UI7_binds.length; i++) this.$UI7_binds[i][0].bindProperty(this.$UI7_binds[i][1],this.$UI7_binds[i][2],[this]);
    }

    return $UI7;
})(flower.Theme.getClass("flower.Panel") || flower.Panel);


UIParser.registerLocalUIClass("$UI7", $UI7)