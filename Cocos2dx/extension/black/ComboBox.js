class ComboBox extends Group {

    $comboBox;

    constructor() {
        super();
        this.$comboBox = {
            0: null, //label
            1: null, //button
            2: null, //list
            3: false, //openFlags
            4: "label", //labelField
            5: null, //dataProvider
            6: "type", //valueField
            7: null, //value
            8: null, //selectedItem
            9: false //inSettingValue
        }
    }

    __onClickButton(e) {
        this.isOpen = !this.isOpen;
    }

    __listRemoved(e) {
        this.$comboBox[3] = false;
    }

    __listSelectItemChange(e) {
        var p = this.$comboBox;
        if (p[9]) {
            return;
        }
        p[8] = e.data;
        if (p[0]) {
            if (p[8] && p[8][p[4]]) {
                p[0].text = p[8][p[4]];
            } else {
                p[0].text = "";
            }
        }
        if (e) {
            this.dispatch(e);
        }
        if (p[6] && p[7] && p[8]) {
            if (p[7] instanceof flower.Value) {
                p[7].value = p[8][p[6]];
            }
        }
    }

    __listClickItem(e) {
        flower.MenuManager.hideMenu();
    }

    __typeValueChange() {
        var p = this.$comboBox;
        if (p[6] && p[7]) {
            var array = p[5];
            var value = p[7] instanceof flower.Value ? p[7].value : p[7];
            this.selectedItem = array.getItemWith(p[6], value);
        }
    }

    __onTypeValueChange(e) {
        this.__typeValueChange();
    }

    set label(val) {
        var p = this.$comboBox;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        if (val) {
            val.touchEnabled = false;
            if (val.parent != this) {
                this.addChild(val);
            }
        }
        if (p[0]) {
            if (p[8] && p[8][p[4]]) {
                p[0].text = p[8][p[4]];
            } else {
                p[0].text = "";
            }
        }
    }

    get label() {
        return this.$comboBox[0];
    }

    set button(val) {
        var p = this.$comboBox;
        if (p[1] == val) {
            return;
        }
        if (p[1]) {
            p[1].removeListener(flower.TouchEvent.TOUCH_END, this.__onClickButton, this);
        }
        p[1] = val;
        if (val) {
            val.addListener(flower.TouchEvent.TOUCH_END, this.__onClickButton, this);
            if (val.parent != this) {
                this.addChild(val);
            }
        }
    }

    get button() {
        return this.$comboBox[1];
    }


    set list(val) {
        var p = this.$comboBox;
        if (p[2] == val) {
            return;
        }
        if (p[2]) {
            p[2].removeListener(flower.Event.REMOVED, this.__listRemoved, this);
            p[2].removeListener(flower.Event.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
            p[2].removeListener(flower.Event.CLICK_ITEM, this.__listClickItem, this);
        }
        p[2] = val;
        if (val) {
            val.dataProvider = p[5];
            if (p[8]) {
                val.selectedItem = p[8];
            }
            val.addListener(flower.Event.REMOVED, this.__listRemoved, this);
            val.addListener(flower.Event.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
            val.addListener(flower.Event.CLICK_ITEM, this.__listClickItem, this);
        }
    }

    get list() {
        return this.$comboBox[2];
    }

    get isOpen() {
        return this.$comboBox[3];
    }

    set isOpen(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.$comboBox[3]) {
            return;
        }
        this.$comboBox[3] = val;
        if (val) {
            var list = this.$comboBox[2];
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
        return this.$comboBox[4];
    }

    set labelField(val) {
        var p = this.$comboBox;
        if(p[4] == val) {
            return;
        }
        p[4] = val;
        if (p[0]) {
            if (p[8] && p[8][p[4]]) {
                p[0].text = p[8][p[4]];
            } else {
                p[0].text = "";
            }
        }
    }

    get valueField() {
        return this.$comboBox[6];
    }

    set valueField(val) {
        if (this.$comboBox[6] == val) {
            return;
        }
        this.$comboBox[6] = val;
        this.__typeValueChange();
    }

    get value() {
        return this.$comboBox[7];
    }

    set value(val) {
        var p = this.$comboBox;
        if (p[7] == val) {
            return;
        }
        if (p[7] && p[7] instanceof flower.Value) {
            p[7].removeListener(flower.Event.UPDATE, this.__onTypeValueChange, this);
        }
        p[7] = val;
        if (p[7]) {
            p[9] = true;
            if (p[7] instanceof flower.Value) {
                p[7].addListener(flower.Event.UPDATE, this.__onTypeValueChange, this);
                this.dataProvider = new flower.ArrayValue(p[7].enumList);
            }
            p[9] = false;
            this.__typeValueChange();
        }
    }

    get dataProvider() {
        return this.$comboBox[5];
    }

    set dataProvider(val) {
        var p = this.$comboBox;
        if (p[5] == val) {
            return;
        }
        p[5] = val;
        if (!p[9]) {
            if (p[5] == null || p[5].length == 0) {
                p[8] = null;
            } else {
                p[8] = p[5][0];
            }
        }
        if (this.list) {
            this.list.dataProvider = p[5];
            if (!p[9] && this.list && p[8]) {
                this.list.selectedItem = p[8];
            }
        }
    }

    get selectedItem() {
        return this.$comboBox[8];
    }

    set selectedItem(val) {
        var p = this.$comboBox;
        if (p[8] == val) {
            return;
        }
        if (p[5] == null) {
            sys.$error(3102);
        }
        var array = p[5];
        var index = array.getItemIndex(val);
        if (index == -1) {
            p[8] = null;
            if (this.list) {
                this.list.selectedItem = null;
            }
            if (p[0]) {
                p[0].text = "";
            }
        } else {
            p[8] = val;
            if (this.list) {
                this.list.selectedItem = val;
            }
            if (p[0]) {
                if (p[8] && p[8][p[4]]) {
                    p[0].text = p[8][p[4]];
                } else {
                    p[0].text = "";
                }
            }
        }
    }

    get selectedIndex() {
        var p = this.$comboBox;
        return p[5] == null ? -1 : p[5].getItemIndex(p[8]);
    }

    set selectedIndex(val) {
        var p = this.$comboBox;
        var item;
        if (p[5] == null) {
            sys.$error(3102);
        }
        if (val != -1) {
            if (val < 0 || val >= p[5].length) {
                sys.$error(3101, val, p[0].length);
            }
            item = p[5][val];
        }
        this.selectedItem = item;
    }
}


exports.ComboBox = ComboBox;