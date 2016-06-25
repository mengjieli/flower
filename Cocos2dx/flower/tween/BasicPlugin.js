class BasicPlugin {
    constructor() {

    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        this._attributes = propertiesTo;
        this.keys = flower.ObjectDo.keys(propertiesTo);
        var target = tween.target;
        var startAttributes = {};
        var keys = this.keys;
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (propertiesFrom && key in propertiesFrom) {
                startAttributes[key] = propertiesFrom[key];
            }
            else {
                startAttributes[key] = target[key];
            }
        }
        this.startAttributes = startAttributes;
        return null;
    }

    tween;
    keys;
    startAttributes;
    _attributes;

    update(value) {
        var target = this.tween.target;
        var keys = this.keys;
        var length = keys.length;
        var startAttributes = this.startAttributes;
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            target[key] = (this._attributes[key] - startAttributes[key]) * value + startAttributes[key];
        }
    }
}

exports.BasicPlugin = BasicPlugin;