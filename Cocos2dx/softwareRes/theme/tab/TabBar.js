function init() {
    this.__moreData = new flower.ArrayValue();
}

function set moreButton(val) {
    if (this.__moreButton == val) {
        return;
    }
    if (this.__moreButton) {
        this.__moreButton.removeListener(flower.TouchEvent.TOUCH_END, this.showMore, this);
        if (this.__moreButton.parent == this) {
            this.removeChild(this.__moreButton);
        }
    }
    this.__moreButton = val;
    if (this.__moreButton) {
        this.__moreButton.addListener(flower.TouchEvent.TOUCH_END, this.showMore, this);
    }
}

function get moreButton() {
    return this.__moreButton;
}

function showMore(e) {
    if (!this.__moreList) {
        this.__moreList = new ScrollerList();
        this.__moreList.viewport = new LabelList();
        this.__moreList.viewport.requireSelection = false;
        var _this = this;
        this.__moreList.viewport.touchBeginItem = function (e) {
            var panel = e.itemData.panel;
            var list = _this.dataProvider;
            list.setItemIndex(panel, 0);
            list.selectedIndex = 0;
        };
        this.__moreList.dataProvider = this.__moreData;
    }
    flower.MenuManager.showMenu(this.__moreList);
}

function $onFrameEnd() {
    var p = this.$DataGroup;
    if (p[3]) {
        if (p[4] != p[3].width || p[5] != p[3].height) {
            p[4] = p[3].width;
            p[5] = p[3].height;
            this.$addFlags(0x4000);
        }
    }
    if (p[0] && p[0].length && p[1] && (this.$hasFlags(0x4000))) {
        this.$removeFlags(0x4000);
        if (!p[2]) {
            p[2] = [];
        }
        var items = p[2];
        var list = p[0];
        var newItems = [];
        var item;
        var itemData;
        var measureSize = false;
        var findSelected = false;
        if (p[9] && p[9] != list.selectedItem) {
            this.__setSelectedItemData(list.selectedItem);
        }
        if (!p[3] || !this.layout || !this.layout.fixElementSize) {
            for (var i = 0, len = list.length; i < len; i++) {
                item = null;
                itemData = list.getItemAt(i);
                for (var f = 0; f < items.length; f++) {
                    if (items[f].data == itemData) {
                        item = items[f];
                        items.splice(f, 1);
                        break;
                    }
                }
                if (item == null) {
                    item = this.createItem(itemData, i);
                    item.data = itemData;
                }
                if (item.x + item.width > this.width) {
                    if (item.parent) {
                        item.parent.removeChild(item);
                    }
                    if (this.moreButton) {
                        this.moreButton.width = this.width - item.x;
                        this.addChild(this.moreButton);
                    }
                    var more = this.__moreData;
                    more.removeAll();
                    for (; i < len; i++) {
                        itemData = list.getItemAt(i);
                        more.push({
                            label: itemData.title,
                            panel: itemData
                        });
                    }
                    break;
                }
                if (item.parent == this) {
                    this.setChildIndex(item, i);
                } else {
                    this.addChild(item);
                }
                item.$setItemIndex(i);
                newItems[i] = item;
            }
        } else {
            this.layout.$clear();
            var elementWidth;
            var elementHeight;
            if (!items.length) {
                item = this.createItem(list.getItemAt(0), 0);
                item.data = list.getItemAt(0);
                items.push(item);
            }
            elementWidth = items[0].width;
            elementHeight = items[0].height;
            var firstItemIndex = this.layout.getFirstItemIndex(elementWidth, elementHeight, -this.x, -this.y);
            firstItemIndex = firstItemIndex < 0 ? 0 : firstItemIndex;
            for (var i = firstItemIndex; i < list.length; i++) {
                item = null;
                itemData = list.getItemAt(i);
                for (var f = 0; f < items.length; f++) {
                    if (items[f].data == itemData) {
                        item = items[f];
                        items.splice(f, 1);
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
                this.layout.updateList(p[4], p[5], firstItemIndex);
                if (this.layout.isElementsOutSize(-this.x, -this.y, p[4], p[5])) {
                    break;
                }
            }
        }
        if (p[9]) {
            findSelected = false;
            for (var i = 0, len = list.length; i < len; i++) {
                if (list.getItemAt(i) == p[9]) {
                    findSelected = true;
                    break;
                }
            }
            if (!findSelected) {
                p[9] = null;
            }
        }
        measureSize = true;
        while (items.length) {
            items.pop().dispose();
        }
        p[2] = newItems;
        if (!p[9]) {
            this._canSelecteItem();
        }
    }
    _super.prototype.$onFrameEnd.call(this);
    if (measureSize) {
        if (this.layout) {
            if (!p[3] || !this.layout.fixElementSize) {
                var size = this.layout.getContentSize();
                p[6] = size.width;
                p[7] = size.height;
                flower.Size.release(size);
            }
            else if (p[2].length) {
                var size = this.layout.measureSize(p[2][0].width, p[2][0].height, list.length);
                p[6] = size.width;
                p[7] = size.height;
                flower.Size.release(size);
            }
        }
    }
}