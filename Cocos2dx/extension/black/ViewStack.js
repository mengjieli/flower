class ViewStack extends Group {

    _items = [];
    _selectedIndex = -1;
    _selectedItem;

    constructor() {
        super();
    }

    addChild(display) {
        var find = false;
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                find = true;
                break;
            }
        }
        this._items.push(display);
        this.dispatchWidth(flower.Event.UPDATE);
        if (this._selectedIndex < 0) {
            this._setSelectedIndex(0);
        }
        if (!find) {
            this.dispatchWidth(flower.Event.ADDED, display);
        }
    }

    addChildAt(display, index) {
        var find = false;
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                find = true;
                break;
            }
        }
        this._items.splice(i, 0, display);
        this.dispatchWidth(flower.Event.UPDATE);
        if (this._selectedIndex < 0) {
            this._setSelectedIndex(0);
        }
        if (!find) {
            this.dispatchWidth(flower.Event.ADDED, display);
        }
    }

    removeChild(display) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                if (display == this._selectedItem) {
                    this._setSelectedIndex(0);
                    this.dispatchWidth(flower.Event.UPDATE);
                    this.dispatchWidth(flower.Event.REMOVED, display);
                }
                return display;
            }
        }
        return null;
    }

    $removeChild(display) {
        super.$removeChild(display);
        this.removeChild(display);
    }

    removeChildAt(index) {
        var display = this._items.splice(index, 1)[0];
        if (display == this._selectedItem) {
            this._selectedItem = this._items[0];
            this._selectedIndex = 0;
            super.removeChild(display);
            this.dispatchWidth(flower.Event.UPDATE);
            this.dispatchWidth(flower.Event.REMOVED, display);
        } else {
            flower.DebugInfo.debug("ViewStack 设置 removeChildAt 超出索引范围:" + index, DebugInfo.ERROR);
        }
        return display;
    }

    getChildIndex(display) {
        if (display) {
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] == display) {
                    return i;
                }
            }
        }
        return -1;
    }

    setChildIndex(display, index) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                this._items.splice(index, 0, display);
                this.dispatchWidth(flower.Event.UPDATE);
                return display;
            }
        }
        return null;
    }

    sortChild(key, opt = 0) {
        super.sortChild(key, opt);
        this.dispatchWidth(flower.Event.UPDATE);
    }

    _setSelectedIndex(val) {
        if (this._selectedItem) {
            super.removeChild(this._selectedItem);
        }
        this._selectedItem = null;
        this._selectedIndex = -1;
        var item = this._items[val];
        if (item) {
            this._selectedItem = item;
            this._selectedIndex = val;
            super.addChildAt(this._selectedItem, this.numChildren);
        }
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    get length() {
        return this._items.length;
    }

    getItemAt(index) {
        return this._items[index];
    }

    getItemIndex(item) {
        return this.getChildIndex(item);
    }

    setItemIndex(item, index) {
        var itemIndex = this.getItemIndex(item);
        if (itemIndex < 0 || itemIndex == index) {
            return;
        }
        this._items.splice(itemIndex, 1);
        if (this._selectedIndex != -1 && this._selectedIndex > itemIndex) {
            this._selectedIndex--;
        }
        this._items.splice(index, 0, item);
        if (this._selectedIndex != -1 && this._selectedIndex >= index) {
            this._selectedIndex++;
        }
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    set selectedIndex(val) {
        val = +val || 0;
        if (val == this._selectedIndex) {
            return;
        }
        if (val < 0 || val >= this._items.length) {
            val = -1;
        }
        this._setSelectedIndex(val);
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedItem(val) {
        var index = this.getChildIndex(val);
        this._setSelectedIndex(index);
        this.dispatchWidth(flower.Event.SELECTED_ITEM_CHANGE, this._selectedItem);
    }

    get selectedItem() {
        return this._selectedItem;
    }
}

exports.ViewStack = ViewStack;