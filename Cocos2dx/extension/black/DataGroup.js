class DataGroup extends Group {

    _data;
    _itemRenderer;
    _items;
    _viewer;
    _viewWidth;
    _viewHeight;
    _contentWidth;
    _contentHeight;
    _downItem;
    _selectedItem;
    _itemSelectedEnabled = false;
    _itemClickedEnabled = false;
    _requireSelection = false;

    constructor() {
        super();
        this._itemSelectedEnabled = true;
        this._itemClickedEnabled = true;
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouchItem, this);
    }

    onDataUpdate() {
        this.$addFlags(0x4000);
    }

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout && (!this._viewer || !this.layout.fixElementSize)) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $onFrameEnd() {
        if (this._viewer) {
            if (this._viewWidth != this._viewer.width || this._viewHeight != this._viewer.height) {
                this._viewWidth = this._viewer.width;
                this._viewHeight = this._viewer.height;
                this.$addFlags(0x4000);
            }
        }
        if (this._data && this._data.length && this._itemRenderer && (this.$hasFlags(0x4000))) {
            if (!this._items) {
                this._items = [];
            }
            var list = this._data;
            var newItems = [];
            var item;
            var itemData;
            var measureSize = false;
            var findSelected = false;
            if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                for (var i = 0, len = list.length; i < len; i++) {
                    item = null;
                    itemData = list.getItemAt(i);
                    for (var f = 0; f < this._items.length; f++) {
                        if (this._items[f].data == itemData) {
                            item = this._items[f];
                            this._items.splice(f, 1);
                            break;
                        }
                    }
                    if (item == null) {
                        item = this.createItem(itemData, i);
                        item.data = itemData;
                    }
                    if (item.parent == this) {
                        this.setChildIndex(item, i);
                    } else {
                        this.addChild(item);
                    }
                    item.$setItemIndex(i);
                    newItems[i] = item;
                    if (item.data == this._selectedItem) {
                        findSelected = true;
                    }
                }
            } else {
                this.layout.$clear();
                var elementWidth;
                var elementHeight;
                if (!this._items.length) {
                    item = this.createItem(list.getItemAt(0), 0);
                    item.data = list.getItemAt(0);
                    this._items.push(item);
                }
                elementWidth = this._items[0].width;
                elementHeight = this._items[0].height;
                var firstItemIndex = this.layout.getFirstItemIndex(elementWidth, elementHeight, -this.x, -this.y);
                firstItemIndex = firstItemIndex < 0 ? 0 : firstItemIndex;
                for (var i = firstItemIndex; i < list.length; i++) {
                    item = null;
                    itemData = list.getItemAt(i);
                    for (var f = 0; f < this._items.length; f++) {
                        if (this._items[f].data == itemData) {
                            item = this._items[f];
                            this._items.splice(f, 1);
                            break;
                        }
                    }
                    if (!item) {
                        item = this.createItem(itemData, i);
                        item.data = itemData;
                    }
                    if (item.parent == this) {
                        this.setChildIndex(item, i - firstItemIndex);
                    } else {
                        this.addChild(item);
                    }
                    item.$setItemIndex(i);
                    newItems[i - firstItemIndex] = item;
                    if (item.data == this._selectedItem) {
                        findSelected = true;
                    }
                    this.layout.updateList(this._viewWidth, this._viewHeight, firstItemIndex);
                    if (this.layout.isElementsOutSize(-this.x, -this.y, this._viewWidth, this._viewHeight)) {
                        break;
                    }
                }
            }
            if (findSelected == false && this._selectedItem) {
                this._selectedItem = null;
            }
            measureSize = true;
            while (this._items.length) {
                this._items.pop().dispose();
            }
            this._items = newItems;
            this.$removeFlags(0x4000);
            if (!this._selectedItem) {
                this._canSelecteItem();
            }
        }
        if (measureSize) {
            if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                var size = this.layout.getContentSize();
                this._contentWidth = size.width;
                this._contentHeight = size.height;
                flower.Size.release(size);
            }
            else if (this._items.length) {
                var size = this.layout.measureSize(this._items[0].width, this._items[0].height, list.length);
                this._contentWidth = size.width;
                this._contentHeight = size.height;
                flower.Size.release(size);
            }
        }
        super.$onFrameEnd();
    }

    createItem(data, index) {
        var item = new this._itemRenderer(data);
        item.index = index;
        item.$setList(this._data);
        item.addListener(TouchEvent.TOUCH_BEGIN, this._onTouchItem, this);
        item.addListener(TouchEvent.TOUCH_END, this._onTouchItem, this);
        item.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouchItem, this);
        if (item.data == this._downItem) {
            if (item.data == this._selectedItem && this._itemSelectedEnabled) {
                item.currentState = "selectedDown";
                item.selected = true;
            } else {
                item.currentState = "down";
            }
        } else {
            if (item.data == this._selectedItem && this._itemSelectedEnabled) {
                item.currentState = "selectedUp";
                item.selected = true;
            } else {
                item.currentState = "up";
            }
        }
        return item;
    }

    _onTouchItem(e) {
        var item = e.currentTarget;
        switch (e.type) {
            case TouchEvent.TOUCH_BEGIN:
                if (this._itemSelectedEnabled) {
                    if (item.data == this._selectedItem) {
                        item.currentState = "selectedDown";
                    } else {
                        item.currentState = "down";
                    }
                }
                this._downItem = item.data;
                break;
            case TouchEvent.TOUCH_RELEASE:
                this.$releaseItem();
                break;
            case TouchEvent.TOUCH_END:
                if (this._downItem == item.data) {
                    this._downItem = null;
                    this._setSelectedItem(item);
                    if (this._itemClickedEnabled) {
                        item.$onClick();
                        //var data = item.data;
                        //var find = false;
                        //for (var i = 0, len = this._data.length; i < len; i++) {
                        //    if (this._data.getItemAt(i) == data) {
                        //        find = true;
                        //    }
                        //}
                        //if (find && this.onClickItemEXE) {
                        //    this.onClickItemEXE.call(this, item.data);
                        //}
                    }
                }
                break;
        }
    }

    _setSelectedIndex(val) {

    }

    _canSelecteItem() {
        if (this._requireSelection && this._itemSelectedEnabled && !this._selectedItem && this._data.length) {
            this._selectedItem = this._data.getItemAt(0);
            var item = this.getItemByData(this._selectedItem);
            if (item) {
                item.currentState = "selectedUp";
                item.selected = true;
            }
        }
    }

    _setSelectedItem(item) {
        if (item == null || item.data != this._selectedItem) {
            if (this._selectedItem) {
                var itemRenderer = this.getItemByData(this._selectedItem);
                if (itemRenderer) {
                    itemRenderer.currentState = "up";
                    itemRenderer.selected = false;
                }
            }
        }
        if (item && this._itemSelectedEnabled) {
            item.currentState = "selectedUp";
            item.selected = true;
            this._selectedItem = item.data;
        } else {
            if (item) {
                item.currentState = "up";
            }
            this._selectedItem = null;
        }
    }

    $releaseItem() {
        var clickItem = this.getItemByData(this._downItem);
        if (clickItem) {
            if (this._downItem == this._selectedItem && this._itemSelectedEnabled) {
                clickItem.currentState = "selectedUp";
            } else {
                clickItem.currentState = "up";
            }
        }
        this._downItem = null;
    }

    onScroll() {
        this.$addFlag(0x400);
    }

    getItemByData(data) {
        for (var i = 0, len = this._items.length; i < len; i++) {
            if (this._items[i].data == data) {
                return this._items[i];
            }
        }
        return null;
    }

    //////////////////////////////////get&set//////////////////////////////////
    get dataProvider() {
        return this._data;
    }

    set dataProvider(val) {
        if (this._data == val) {
            return;
        }
        this.removeAll();
        this._items = null;
        this._data = val;
        this.$addFlags(0x4000);
        if (this._data) {
            this._data.addListener(flower.Event.UPDATE, this.onDataUpdate, this)
        }
    }

    get itemRenderer() {
        return this._itemRenderer;
    }

    set itemRenderer(val) {
        if (this._itemRenderer == val) {
            return;
        }
        this.removeAll();
        this._items = null;
        this._itemRenderer = val;
        this.$addFlags(0x4000);
    }

    get numElements() {
        return this._items.length;
    }

    set viewer(display) {
        this._viewer = display;
    }

    get contentWidth() {
        return this._contentWidth;
    }

    get contentHeight() {
        return this._contentHeight;
    }

    get scrollEnabled() {
        return true;
    }


    get selectedIndex() {
        return this._selectedItem ? this._selectedItem.itemIndex : -1;
    }

    set selectedIndex(val) {
        val = +val || 0;
        if (this._selectedItem && this._selectedItem.itemIndex == val) {
            return;
        }
        this._setSelectedIndex(val);
    }

    get selectedItem() {
        return this._selectedItem;
    }

    get itemSelectedEnabled() {
        return this._itemSelectedEnabled;
    }

    set itemSelectedEnabled(val) {
        this._itemSelectedEnabled = !!val;
    }

    get itemClickedEnabled() {
        return this._itemClickedEnabled;
    }

    set itemClickedEnabled(val) {
        val = !!val;
        if (this._itemClickedEnabled == val) {
            return;
        }
        this._itemClickedEnabled = val;
    }

    get requireSelection() {
        return this._requireSelection;
    }

    set requireSelection(val) {
        val = !!val;
        if (val == this._requireSelection) {
            return;
        }
        this._requireSelection = val;
    }

    //onClickItemEXE:Function;
    //
    //set onClickItem(val) {
    //    if (typeof val == "string") {
    //        var content:string = <any>val;
    //        val = function (item) {
    //            eval(content);
    //        }.bind(this.eventThis);
    //    }
    //    this.onClickItemEXE = val;
    //}
    //
    //get onClickItem() {
    //    return this.onClickItemEXE;
    //}
}

exports.DataGroup = DataGroup;