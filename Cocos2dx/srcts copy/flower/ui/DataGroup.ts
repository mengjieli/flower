module flower {
    export class DataGroup extends flower.Group implements IViewPort {

        private _data:ICollection;
        private _itemRenderer:any;
        protected _items:Array<any>;
        private _viewer:flower.DisplayObject;
        private _viewWidth:number;
        private _viewHeight:number;
        private _contentWidth:number;
        private _contentHeight:number;
        private _downItem:any;
        private _selectedItem:any;
        private _itemSelectedEnabled:boolean = false;
        private _itemClickedEnabled:boolean = false;
        private _requireSelection:boolean = false;

        public constructor() {
            super();
            this._itemSelectedEnabled = true;
            this._itemClickedEnabled = true;
            this.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouchItem, this);
        }

        private onDataUpdate():void {
            this.$addFlag(0x400);
        }

        protected resetLayout():void {
            if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                super.resetLayout();
            }
        }

        public $onFrameEnd() {
            if (this._viewer) {
                if (this._viewWidth != this._viewer.width || this._viewHeight != this._viewer.height || this.$getFlag(0x200)) {
                    this._viewWidth = this._viewer.width;
                    this._viewHeight = this._viewer.height;
                    this.$addFlag(0x400);
                }
            }
            if (this._data && this._itemRenderer && (this.$getFlag(0x400))) {
                if (!this._items) {
                    this._items = [];
                }
                var list = this._data;
                var newItems = [];
                var item:ItemRenderer;
                var itemData;
                var mesureSize:boolean = false;
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
                    var elementWidth:number;
                    var elementHeight:number;
                    if (!this._items.length) {
                        item = this.createItem(list.getItemAt(0), 0);
                        item.data = list.getItemAt(0);
                        this._items.push(item);
                    }
                    elementWidth = this._items[0].width;
                    elementHeight = this._items[0].height;
                    var firstItemIndex:number = this.layout.getFirstItemIndex(elementWidth, elementHeight, -this.x, -this.y);
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
                mesureSize = true;
                while (this._items.length) {
                    this._items.pop().dispose();
                }
                this._items = newItems;
                this.$removeFlag(0x400);
                if (!this._selectedItem) {
                    this._canSelecteItem();
                }
            }
            super.$onFrameEnd();
            if (mesureSize) {
                if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                    var size = this.layout.getContentSize();
                    this._contentWidth = size.width;
                    this._contentHeight = size.height;
                    flower.Size.release(size);
                }
                else if (this._items.length) {
                    var size = this.layout.mesureSize(this._items[0].width, this._items[0].height, list.length);
                    this._contentWidth = size.width;
                    this._contentHeight = size.height;
                    flower.Size.release(size);
                }
            }
        }

        protected createItem(data:any, index:number):ItemRenderer {
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

        protected _onTouchItem(e:TouchEvent):void {
            var item:ItemRenderer = e.currentTarget;
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

        protected _setSelectedIndex(val:number) {

        }

        protected _canSelecteItem() {
            if (this._requireSelection && this._itemSelectedEnabled && !this._selectedItem && this._data.length) {
                this._selectedItem = this._data.getItemAt(0);
                var item = this.getItemByData(this._selectedItem);
                if (item) {
                    item.currentState = "selectedUp";
                    item.selected = true;
                }
            }
        }

        protected _setSelectedItem(item:any) {
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

        $releaseItem():void {
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

        public onScroll():void {
            this.$addFlag(0x400);
        }

        public getItemByData(data:any):ItemRenderer {
            for (var i = 0, len = this._items.length; i < len; i++) {
                if (this._items[i].data == data) {
                    return this._items[i];
                }
            }
            return null;
        }

        //////////////////////////////////get&set//////////////////////////////////
        public get dataProvider():ICollection {
            return this._data;
        }

        public set dataProvider(val:ICollection) {
            if (this._data == val) {
                return;
            }
            this.removeAll();
            this._items = null;
            this._data = val;
            this.$addFlag(0x400);
            if (this._data) {
                this._data.addListener(flower.Event.UPDATE, this.onDataUpdate, this)
            }
        }

        public get itemRenderer():any {
            return this._itemRenderer;
        }

        public set itemRenderer(val:any) {
            if (this._itemRenderer == val) {
                return;
            }
            this.removeAll();
            this._items = null;
            this._itemRenderer = val;
            this.$addFlag(0x400);
        }

        public get numElements():number {
            return this._items.length;
        }

        public set viewer(display:flower.DisplayObject) {
            this._viewer = display;
        }

        public get contentWidth():number {
            return this._contentWidth;
        }

        public get contentHeight():number {
            return this._contentHeight;
        }

        public get scrollEnabled():boolean {
            return true;
        }


        public get selectedIndex():number {
            return this._selectedItem ? this._selectedItem.itemIndex : -1;
        }

        public set selectedIndex(val:number) {
            val = +val || 0;
            if (this._selectedItem && this._selectedItem.itemIndex == val) {
                return;
            }
            this._setSelectedIndex(val);
        }

        public get selectedItem():any {
            return this._selectedItem;
        }

        public get itemSelectedEnabled():boolean {
            return this._itemSelectedEnabled;
        }

        public set itemSelectedEnabled(val:boolean) {
            this._itemSelectedEnabled = !!val;
        }

        public get itemClickedEnabled():boolean {
            return this._itemClickedEnabled;
        }

        public set itemClickedEnabled(val:boolean) {
            val = !!val;
            if (this._itemClickedEnabled == val) {
                return;
            }
            this._itemClickedEnabled = val;
        }

        public get requireSelection():boolean {
            return this._requireSelection;
        }

        public set requireSelection(val:boolean) {
            val = !!val;
            if (val == this._requireSelection) {
                return;
            }
            this._requireSelection = val;
        }

        //private onClickItemEXE:Function;
        //
        //public set onClickItem(val:any) {
        //    if (typeof val == "string") {
        //        var content:string = <any>val;
        //        val = function (item) {
        //            eval(content);
        //        }.bind(this.eventThis);
        //    }
        //    this.onClickItemEXE = val;
        //}
        //
        //public get onClickItem():any {
        //    return this.onClickItemEXE;
        //}
    }
}

