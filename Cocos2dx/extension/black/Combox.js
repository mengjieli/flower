class Combox extends Group {

    $combox;

    constructor() {
        super();
        this.$combox = {
            0: null, //label
            1: null, //button
            2: null, //list
            3: false, //openFlags
            4: "label", //labelField
            5: null, //dataProvider
            6: "type", //typeField
            7: null //typeValue
        }
    }

    __onClickButton(e) {
        this.isOpen = !this.isOpen;
    }

    __listRemoved(e) {
        this.$combox[3] = false;
    }

    __listSelectItemChange(e) {
        var p = this.$combox;
        var array = p[5];
        if (this.label && array && array.selectedItem) {
            this.label.text = array.selectedItem[p[4]];
        } else {
            this.label.text = "";
        }
        if (e) {
            this.dispatch(e);
        }
        if (p[6] && p[7]) {
            if (p[7] instanceof flower.Value) {
                p[7].value = array.selectedItem[p[6]];
            }
        }
    }

    __listClickItem(e) {
        flower.MenuManager.hideMenu();
    }

    __typeValueChange() {
        if (this.$combox[6] && this.$combox[7]) {
            var array = this.$combox[5];
            var value = this.$combox[7] instanceof flower.Value ? this.$combox[7].value : this.$combox[7];
            for (var i = 0; i < array.length; i++) {
                if (array[i][this.$combox[6]] == value) {
                    this.selectedIndex = i;
                    break;
                }
            }
        }
    }

    __onTypeValueChange(e) {
        this.__typeValueChange();
    }

    set label(val) {
        if (this.$combox[0] == val) {
            return;
        }
        this.$combox[0] = val;
        if (val) {
            val.touchEnabled = false;
            if (val.parent != this) {
                this.addChild(val);
            }
        }
        this.__listSelectItemChange();
    }

    get label() {
        return this.$combox[0];
    }


    set button(val) {
        if (this.$combox[1] == val) {
            return;
        }
        if (this.$combox[1]) {
            this.$combox[1].removeListener(flower.TouchEvent.TOUCH_END, this.__onClickButton, this);
        }
        this.$combox[1] = val;
        if (val) {
            val.addListener(flower.TouchEvent.TOUCH_END, this.__onClickButton, this);
            if (val.parent != this) {
                this.addChild(val);
            }
        }
    }

    get button() {
        return this.$combox[1];
    }


    set list(val) {
        if (this.$combox[2] == val) {
            return;
        }
        if (this.$combox[2]) {
            this.$combox[2].removeListener(flower.Event.REMOVED, this.__listRemoved, this);
            this.$combox[2].removeListener(flower.DataGroupEvent.CLICK_ITEM, this.__listClickItem, this);
        }
        this.$combox[2] = val;
        if (val) {
            val.dataProvider = this.$combox[5];
            val.addListener(flower.Event.REMOVED, this.__listRemoved, this);
            val.addListener(flower.DataGroupEvent.CLICK_ITEM, this.__listClickItem, this);
        }
        this.__listSelectItemChange();
    }

    get list() {
        return this.$combox[2];
    }

    get isOpen() {
        return this.$combox[3];
    }

    set isOpen(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.$combox[3]) {
            return;
        }
        this.$combox[3] = val;
        if (val) {
            var list = this.$combox[2];
            if (this.stage && list) {
                var point = flower.Point.create();
                this.localToGlobal(point);
                flower.Point.release(point);
                flower.MenuManager.showMenu(list, point.x, point.y + this.height, false);
            }
        } else {
        }
    }

    get labelField() {
        return this.$combox[4];
    }

    set labelField(val) {
        this.$combox[4] = val;
        this.__listSelectItemChange();
    }

    get typeField() {
        return this.$combox[6];
    }

    set typeField(val) {
        if (this.$combox[6] == val) {
            return;
        }
        this.$combox[6] = val;
        this.__typeValueChange();
    }

    get typeValue() {
        return this.$combox[7];
    }

    set typeValue(val) {
        if (this.$combox[7] == val) {
            return;
        }
        if (this.$combox[7] && this.$combox[7] instanceof flower.Value) {
            this.$combox[7].removeListener(flower.Event.UPDATE, this.__onTypeValueChange, this);
        }
        this.$combox[7] = val;
        if (this.$combox[7] && this.$combox[7] instanceof flower.Value) {
            this.$combox[7].addListener(flower.Event.UPDATE, this.__onTypeValueChange, this);
        }
        this.__typeValueChange();
    }

    get dataProvider() {
        return this.$combox[5];
    }

    set dataProvider(val) {
        if (this.$combox[5] == val) {
            return;
        }
        if (this.$combox[5]) {
            this.$combox[5].removeListener(flower.Event.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
        }
        this.$combox[5] = val;
        if (this.$combox[5]) {
            this.$combox[5].addListener(flower.Event.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
        }
        if (this.list) {
            this.list.dataProvider = this.$combox[5];
        }
    }

    get selectedItem() {
        return this.list ? this.list.selectedItem : null;
    }

    set selectedItem(val) {
        var array = this.$combox[5];
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i] == val) {
                this.selectedIndex = i;
                return;
            }
        }
        this.list.selectedIndex = -1;
    }

    get selectedIndex() {
        return this.list ? this.list.selectedIndex : -1;
    }

    set selectedIndex(val) {
        this.list.selectedIndex = val;
    }
}


exports.Combox = Combox;