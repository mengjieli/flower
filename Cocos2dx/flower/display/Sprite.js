class Sprite extends DisplayObject {

    _childs;

    constructor() {
        super();
        this._childs = [];
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlag(flags);
        var childs = this._childs;
        for (var i = 0; i < childs.length; i++) {
            childs[i].$addFlagsDown(flags);
        }
    }
}