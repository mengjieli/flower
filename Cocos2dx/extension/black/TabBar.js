class TabBar extends ListBase {

    $TabBar;

    constructor() {
        super();
        this.$TabBar = {
            0: false,//more
            1: null, //moreButton
            2: null, //moreData
            3: null, //moreList
        };
        this.layout = new HorizontalLayout();
        this.layout.fixElementSize = false;
    }

    _setSelectedItem(item) {
        super._setSelectedItem(item);
        (this.dataProvider).selectedItem = item.data;
    }

    $onFrameEnd() {
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
            var layout = this.layout;
            var addMoreButton = false;
            if (!p[3] || !layout || !layout.fixElementSize) {
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
                    //检查 more 里面的数据
                    if (this.more && item.x + item.width > this.width) {
                        addMoreButton = true;
                        if (item.parent) {
                            item.parent.removeChild(item);
                        }
                        if (this.moreButton) {
                            this.moreButton.width = this.width - item.x;
                            if (this.moreButton.parent != this) {
                                this.addChild(this.moreButton);
                            }
                        }
                        var more = this.moreData;
                        var saveList = more.list.concat();
                        var moreItem;
                        more.removeAll();
                        for (; i < len; i++) {
                            itemData = list.getItemAt(i);
                            moreItem = null;
                            for (var j = 0; j < saveList.length; j++) {
                                if (saveList[j].panel == itemData) {
                                    moreItem = saveList[j];
                                    saveList.splice(j, 1);
                                    break;
                                }
                            }
                            if (!moreItem) {
                                moreItem = {
                                    label: itemData.title,
                                    panel: itemData
                                };
                            } else {
                                moreItem.label = itemData.title;
                            }
                            more.push(moreItem);
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
                if (!addMoreButton) {
                    if (this.moreButton && this.moreButton.parent == this) {
                        this.removeChild(this.moreButton);
                    }
                }
            } else {
                layout.$clear();
                var elementWidth;
                var elementHeight;
                if (!items.length) {
                    item = this.createItem(list.getItemAt(0), 0);
                    item.data = list.getItemAt(0);
                    items.push(item);
                }
                elementWidth = items[0].width;
                elementHeight = items[0].height;
                var firstItemIndex = layout.getFirstItemIndex(elementWidth, elementHeight, -this.x, -this.y);
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
                    layout.updateList(p[4], p[5], firstItemIndex);
                    if (layout.isElementsOutSize(-this.x, -this.y, p[4], p[5])) {
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
        super.$onFrameEnd();
        if (measureSize) {
            if (layout) {
                if (!p[3] || !layout.fixElementSize) {
                    var size = layout.getContentSize();
                    p[6] = size.width;
                    p[7] = size.height;
                    flower.Size.release(size);
                }
                else if (p[2].length) {
                    var size = layout.measureSize(p[2][0].width, p[2][0].height, list.length);
                    p[6] = size.width;
                    p[7] = size.height;
                    flower.Size.release(size);
                }
            }
        }
    }

    showMore(e) {
        var p = this.$TabBar;
        var moreList = p[3];
        if (moreList) {
            var point = this.moreButton.localToGlobal();
            moreList.x = point.x;
            moreList.y = point.y + this.moreButton.height;
            flower.MenuManager.showMenu(moreList);
        }
    }

    get more() {
        return this.$TabBar[0];
    }

    set more(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (this.$TabBar[0] == val) {
            return;
        }
        this.$TabBar[0] = val;
        if (!this.$TabBar[2]) {
            this.$TabBar[2] = new flower.ArrayValue();
        }
        this.$invalidateContentBounds();
    }

    get moreData() {
        if (!this.$TabBar[2]) {
            this.$TabBar[2] = new flower.ArrayValue();
        }
        return this.$TabBar[2];
    }

    get moreButton() {
        return this.$TabBar[1];
    }

    set moreButton(val) {
        if (this.$TabBar[1] == val) {
            return;
        }
        if (this.$TabBar[1]) {
            this.$TabBar[1].removeListener(flower.TouchEvent.TOUCH_END, this.showMore, this);
            if (this.$TabBar[1].parent == this) {
                this.removeChild(this.$TabBar[1]);
            }
        }
        this.$TabBar[1] = val;
        if (this.$TabBar[1]) {
            this.$TabBar[1].addListener(flower.TouchEvent.TOUCH_END, this.showMore, this);
        }
        this.$invalidateContentBounds();
    }

    get moreList() {
        return this.$TabBar[3];
    }

    set moreList(val) {
        if (this.$TabBar[3] == val) {
            return;
        }
        this.$TabBar[3] = val;
        val.dataProvider = this.moreData;
    }
}

exports.TabBar = TabBar;