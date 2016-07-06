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
        }
    }

    __onClickButton(e) {
        this.isOpen = !this.isOpen;
    }

    __listRemoved(e) {
        this.$combox[3] = false;
    }

    __listSelectItemChange(e) {
        if (this.label && this.list && this.list.selectedItem) {
            this.label.text = this.list.selectedItem[this.$combox[4]];
        } else {
            this.label.text = "";
        }
        if (e) {
            this.dispatch(e);
        }
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
            this.$combox[2].addListener(flower.DataGroupEvent.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
        }
        this.$combox[2] = val;
        if (val) {
            val.itemClickedEnabled = true;
            val.itemSelectedEnabled = true;
            val.requireSelection = true;
            val.dataProvider = this.$combox[5];
            val.addListener(flower.Event.REMOVED, this.__listRemoved, this);
            val.addListener(flower.DataGroupEvent.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
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
                list.x = point.x;
                list.y = point.y + this.height;
                flower.Point.release(point);
                flower.MenuManager.showMenu(list);
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

    get dataProvider() {
        return this.$combox[5];
    }

    set dataProvider(val) {
        if (this.$combox[5] == val) {
            return;
        }
        this.$combox[5] = val;
        if (this.list) {
            this.list.dataProvider = this.$combox[5];
        }
    }

    get selectedItem() {
        return this.list ? this.list.selectedItem : null;
    }

    get selectedIndex() {
        return this.list ? this.list.selectedIndex : -1;
    }
}


exports.Combox = Combox;