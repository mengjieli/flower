class ItemRenderer extends Group {

    _data;
    _itemIndex;
    _selected = false;

    constructor() {
        super();
        this.absoluteState = true;
    }

    get itemIndex() {
        return this._itemIndex;
    }

    $setItemIndex(val) {
        this._itemIndex = val;
    }

    setSelected(val) {
        this._selected = val;
        if (this._selected) {
            if (this.onSelectedEXE) {
                this.onSelectedEXE.call(this);
            }
        }
    }

    get selected() {
        return this._selected;
    }

    set selected(val) {
        if(val == "false") {
            val = false;
        }
        val = !!val;
        if (this._selected == val) {
            return;
        }
        this.setSelected(val);
    }

    $onClick() {
        if (this.onClickEXE) {
            this.onClickEXE.call(this);
        }
    }

    onClickEXE;

    set onClick(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onClickEXE = val;
    }

    get onClick() {
        return this.onClickEXE;
    }

    onSelectedEXE;

    set onSelected(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onSelectedEXE = val;
    }

    get onSelected() {
        return this.onClickEXE;
    }

    _list;

    get list() {
        return this._list;
    }

    $setList(val) {
        this._list = val;
    }
}

exports.ItemRenderer = ItemRenderer;