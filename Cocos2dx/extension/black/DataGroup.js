class DataGroup extends Group {

    $DataGroup;

    constructor() {
        super();
        this.$DataGroup = {
            0: null, //data
            1: null, //itemRenderer
            2: null, //items
            3: null, //viewer
            4: 0,    //viewerWidth
            5: 0,    //viewerHeight
            6: 0,    //contentWidth
            7: 0,    //contentHeight
            8: null, //downItem
            9: null, //selectedItem
            10: false,//itemSelectedEnabled
            11: true,//itemClickedEnabled
            12: false,//requireSelection
            13: flower.TouchEvent.TOUCH_BEGIN, //selectTime
            14: 100, //validDownStateTime
            15: 0, //touchTime
            16: null, //touchItemData
        }
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchItem, this);
    }

    onDataUpdate() {
        this.$addFlags(0x4000);
    }

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout && (!this.$DataGroup[3] || !this.layout.fixElementSize)) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001) {
            if ((this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                this.__flags |= 0x1000;
            }
            if (this.layout) {
                this.__flags |= 0x2000;
            }
        }
        if ((flags & 0x0004) == 0x0004) {
            this.__flags |= 0x4000;
        }
        this.__flags |= flags;
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
                    if (item.parent == this) {
                        this.setChildIndex(item, i);
                    } else {
                        this.addChild(item);
                    }
                    item.$setItemIndex(i);
                    newItems[i] = item;
                    //if (item.data == p[9]) {
                    //    findSelected = true;
                    //}
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
                    //if (item.data == p[9]) {
                    //    findSelected = true;
                    //}
                    this.layout.updateList(p[4], p[5], firstItemIndex);
                    if (this.layout.isElementsOutSize(-this.x, -this.y, p[4], p[5])) {
                        break;
                    }
                }
            }
            //if (findSelected == false && p[9]) {
            //    p[9] = null;
            //}
            measureSize = true;
            while (items.length) {
                items.pop().dispose();
            }
            p[2] = newItems;
        }
        super.$onFrameEnd();
        if (measureSize) {
            if (!p[3] || !this.layout || !this.layout.fixElementSize) {
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

    createItem(data, index) {
        var p = this.$DataGroup;
        var item = new p[1](data);
        item.index = index;
        item.$setList(p[0]);
        item.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchItem, this);
        item.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchItem, this);
        item.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchItem, this);
        if (item.data == p[8]) {
            if (item.data == p[9]) {
                item.currentState = "selectedDown";
                item.selected = true;
            } else {
                item.currentState = "down";
            }
        } else {
            if (item.data == p[9]) {
                item.currentState = "selectedUp";
                item.selected = true;
            } else {
                item.currentState = "up";
            }
        }
        return item;
    }

    __onTouchItem(e) {
        var p = this.$DataGroup;
        var item = e.currentTarget;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                if (p[13] == flower.TouchEvent.TOUCH_BEGIN || p[9] == item.data) {
                    p[15] = -1;
                    p[8] = item.data;
                    item.currentState = "down";
                    this.__setSelectedItemData(p[8]);
                } else {
                    p[15] = flower.CoreTime.currentTime;
                    p[16] = item.data;
                    p[8] = p[16];
                    flower.EnterFrame.add(this.__onTouchUpdate, this);
                }
                break;
            case flower.TouchEvent.TOUCH_RELEASE:
                flower.EnterFrame.remove(this.__onTouchUpdate, this);
                this.$releaseItem();
                break;
            case flower.TouchEvent.TOUCH_END:
                flower.EnterFrame.remove(this.__onTouchUpdate, this);
                if (p[8] == item.data) {
                    p[8] = null;
                    if (p[13] == flower.TouchEvent.TOUCH_END) {
                        this.__setSelectedItemData(item.data);
                    }
                    if (p[11]) {
                        item.$onClick();
                        this.dispatch(new DataGroupEvent(DataGroupEvent.CLICK_ITEM, true, item.data));
                    }
                } else {
                    this.$releaseItem();
                }
                break;
        }
    }

    __onTouchUpdate(timeStamp, gap) {
        var p = this.$DataGroup;
        if (timeStamp > p[15] + p[14]) {
            flower.EnterFrame.remove(this.__onTouchUpdate, this);
            var item = this.getItemByData(p[8]);
            if (item) {
                item.currentState = "down";
            }
            if (p[13] == flower.TouchEvent.TOUCH_BEGIN || p[9] == p[8]) {
                this.__setSelectedItemData(p[8]);
            }
        }
    }

    $releaseItem() {
        var p = this.$DataGroup;
        var clickItem = this.getItemByData(p[8]);
        if (clickItem) {
            if (p[8] == p[9]) {
                clickItem.currentState = "selectedUp";
            } else {
                clickItem.currentState = "up";
            }
        }
        p[8] = null;
    }

    _canSelecteItem() {
        var p = this.$DataGroup;
        if (p[12] && p[10] && !p[9] && p[0] && p[0].length) {
            this.__setSelectedItemData(p[0].getItemAt(0));
        }
    }

    __setSelectedItemData(itemData) {
        var p = this.$DataGroup;
        var selectedItem = p[9];
        var changeFlag = true;
        if (itemData == selectedItem || !p[10]) {
            changeFlag = false;
            //return;
        }
        var data = p[0];
        var find = false;
        for (var i = 0, len = data.length; i < data.length; i++) {
            if (data.getItemAt(i) == itemData) {
                find = true;
            }
        }
        if (!find) {
            itemData = null;
        }
        var itemRenderer;
        if (selectedItem) {
            itemRenderer = this.getItemByData(selectedItem);
            if (itemRenderer) {
                if (itemRenderer.data == p[8]) {
                    itemRenderer.currentState = "down";
                } else {
                    itemRenderer.currentState = "up";
                }
                itemRenderer.selected = false;
            }
        }
        selectedItem = p[9] = itemData;
        itemRenderer = this.getItemByData(selectedItem);
        if (itemRenderer) {
            if (itemRenderer.data == p[8]) {
                itemRenderer.currentState = "selectedDown";
            } else {
                itemRenderer.currentState = "selectedUp";
            }
            itemRenderer.selected = true;
        }
        data.selectedItem = itemData;
        if (changeFlag) {
            this.dispatch(new DataGroupEvent(DataGroupEvent.SELECTED_ITEM_CHANGE, false, itemData));
        }
        if (!selectedItem) {
            this._canSelecteItem();
        }
    }

    onScroll() {
        this.$addFlag(0x400);
    }

    getItemByData(data) {
        var items = this.$DataGroup[2];
        if (!items) {
            return null;
        }
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].data == data) {
                return items[i];
            }
        }
        return null;
    }

    getItemDataIndex(data) {
        var p = this.$DataGroup;
        for (var i = 0, i = p[0].length; i < len; i++) {
            if (p[0].getItemAt(i) == data) {
                return i;
            }
        }
        return -1;
    }

    //////////////////////////////////get&set//////////////////////////////////
    get dataProvider() {
        var p = this.$DataGroup;
        return p[0];
    }

    set dataProvider(val) {
        var p = this.$DataGroup;
        if (p[0] == val) {
            return;
        }
        if (p[0]) {
            p[0].removeListener(flower.Event.UPDATE, this.onDataUpdate, this);
        }
        this.removeAll();
        p[2] = null;
        p[0] = val;
        this.$addFlags(0x4000);
        if (p[0]) {
            if (!p[9]) {
                this._canSelecteItem();
            }
            p[0].addListener(flower.Event.UPDATE, this.onDataUpdate, this);
        }
    }

    get itemRenderer() {
        var p = this.$DataGroup;
        return p[1];
    }

    set itemRenderer(val) {
        if (typeof val == "string") {
            var clazz = $root[val];
            if (!clazz) {
                clazz = flower.UIParser.getLocalUIClass(val.split(":")[val.split(":").length - 1], val.split(":").length > 1 ? val.split(":")[0] : "");
                if (!clazz) {
                    sys.$error(3201, val);
                }
            }
            val = clazz;
        }
        var p = this.$DataGroup;
        if (p[1] == val) {
            return;
        }
        this.removeAll();
        p[2] = null;
        p[1] = val;
        this.$addFlags(0x4000);
    }

    get numElements() {
        return this.$DataGroup[2].length;
    }

    set viewer(display) {
        this.$DataGroup[3] = display;
    }

    get contentWidth() {
        return this.$DataGroup[6];
    }

    get contentHeight() {
        return this.$DataGroup[7];
    }

    get scrollEnabled() {
        return true;
    }


    get selectedIndex() {
        return this.getItemDataIndex(this.$DataGroup[9]);
    }

    set selectedIndex(val) {
        var p = this.$DataGroup;
        val = +val || 0;
        var item;
        if (val != -1) {
            if (val < 0 || val >= p[0].length) {
                sys.$error(3101, val, p[0].length);
            }
            item = p[0][val];
            if (p[9] && p[9].itemIndex == val) {
                return;
            }
        }
        this.__setSelectedItemData(item);
    }

    get selectedItem() {
        return this.$DataGroup[9];
    }

    set selectedItem(val) {
        this.__setSelectedItemData(val);
    }

    get itemSelectedEnabled() {
        return this.$DataGroup[10];
    }

    set itemSelectedEnabled(val) {
        if (val == "false") {
            val = false;
        }
        if (this.$DataGroup[10] == val) {
            return;
        }
        this.$DataGroup[10] = !!val;
        this._canSelecteItem();
    }

    get itemClickedEnabled() {
        return this.$DataGroup[11];
    }

    set itemClickedEnabled(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (this.$DataGroup[11] == val) {
            return;
        }
        this.$DataGroup[11] = val;
    }

    get requireSelection() {
        return this.$DataGroup[12];
    }

    set requireSelection(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (val == this.$DataGroup[12]) {
            return;
        }
        this.$DataGroup[12] = val;
        if (val) {
            this._canSelecteItem();
        }
    }

    get selectTime() {
        return this.$DataGroup[13];
    }

    set selectTime(val) {
        if (val != flower.TouchEvent.TOUCH_BEGIN && val != flower.TouchEvent.TOUCH_END) {
            sys.$error(1008, val, "DataGroup", "selectTime");
            return;
        }
        this.$DataGroup[13] = val;
    }

    get validDownStateTime() {
        return this.$DataGroup[14];
    }

    /**
     * 有效触摸时间，即按下多少秒之后才触发按下 item 的操作
     * @param val
     */
    set validDownStateTime(val) {
        this.$DataGroup[14] = (+val) * 1000 || 0;
    }
}

UIComponent.registerEvent(DataGroup, 1110, "clickItem", DataGroupEvent.CLICK_ITEM);
UIComponent.registerEvent(DataGroup, 1111, "selectedItemChange", DataGroupEvent.SELECTED_ITEM_CHANGE);

exports.DataGroup = DataGroup;