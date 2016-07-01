var $UI3 = (function (_super) {
    __extends($UI3, _super);
    function $UI3(_data) {
        if(_data) this._data = _data;
        _super.call(this);
        this.$UI3_initMain(this);
    }

    $UI3.prototype.$UI3_initMain = function(parentObject) {
        parentObject.addChild(this.$UI3_getImage(parentObject));
    }

    $UI3.prototype.$UI3_getColorFilter = function(parentObject) {
        var colorfilter = new flower.ColorFilter();
        if(colorfilter.__UIComponent) colorfilter.eventThis = this;
        colorfilter.h = 90;
        colorfilter.s = 0;
        colorfilter.l = 0;
        return colorfilter;
    }

    $UI3.prototype.$UI3_getArray = function(parentObject) {
        var array = new Array();
        if(array.__UIComponent) array.eventThis = this;
        array.push(this.$UI3_getColorFilter(array));
        return array;
    }

    $UI3.prototype.$UI3_getImage = function(parentObject) {
        var image = new flower.Image();
        if(image.__UIComponent) image.eventThis = this;
        image.source = "res/font@100x100@cn@2.png";
        image.setStatePropertyValue("scaleX", "up", "2", [this]);
        image.setStatePropertyValue("scaleX", "down", "3", [this]);
        image.scaleY = 2;
        image.scale9Grid = new flower.Rectangle(30,25,40,50);
        image.filters = this.$UI3_getArray(image);
        return image;
    }

    return $UI3;
})(flower.Button);


UIParser.registerLocalUIClass("$UI3", $UI3);