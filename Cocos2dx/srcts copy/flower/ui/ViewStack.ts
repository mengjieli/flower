module flower {
    export class ViewStack extends Group implements ICollection {

        private _items:Array<DisplayObject> = [];
        private _selectedIndex:number = -1;
        private _selectedItem:DisplayObject;

        public constructor() {
            super();
        }

        public addChild(display:DisplayObject):void {
            var find = false;
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] == display) {
                    this._items.splice(i, 1);
                    find = true;
                    break;
                }
            }
            this._items.push(display);
            this.dispatchWidth(Event.UPDATE);
            if (this._selectedIndex < 0) {
                this._setSelectedIndex(0);
            }
            if (!find) {
                this.dispatchWidth(Event.ADDED, display);
            }
        }

        public addChildAt(display:DisplayObject, index:number):void {
            var find = false;
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] == display) {
                    this._items.splice(i, 1);
                    find = true;
                    break;
                }
            }
            this._items.splice(i, 0, display);
            this.dispatchWidth(Event.UPDATE);
            if (this._selectedIndex < 0) {
                this._setSelectedIndex(0);
            }
            if (!find) {
                this.dispatchWidth(Event.ADDED, display);
            }
        }

        public removeChild(display:DisplayObject):DisplayObject {
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] == display) {
                    this._items.splice(i, 1);
                    if (display == this._selectedItem) {
                        this._setSelectedIndex(0);
                        this.dispatchWidth(Event.UPDATE);
                        this.dispatchWidth(Event.REMOVED, display);
                    }
                    return display;
                }
            }
            return null;
        }

        public removeChildAt(index:number):DisplayObject {
            var display:DisplayObject = this._items.splice(index, 1)[0];
            if (display == this._selectedItem) {
                this._selectedItem = this._items[0];
                this._selectedIndex = 0;
                super.removeChild(display);
                this.dispatchWidth(Event.UPDATE);
                this.dispatchWidth(Event.REMOVED, display);
            } else {
                flower.DebugInfo.debug("ViewStack 设置 removeChildAt 超出索引范围:" + index, DebugInfo.ERROR);
            }
            return display;
        }

        public getChildIndex(display:DisplayObject):number {
            if (display) {
                for (var i = 0; i < this._items.length; i++) {
                    if (this._items[i] == display) {
                        return i;
                    }
                }
            }
            return -1;
        }

        public setChildIndex(display:DisplayObject, index:number):DisplayObject {
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] == display) {
                    this._items.splice(i, 1);
                    this._items.splice(index, 0, display);
                    this.dispatchWidth(Event.UPDATE);
                    return display;
                }
            }
            return null;
        }

        public sortChild(key:string, opt:number = 0) {
            super.sortChild(key, opt);
            this.dispatchWidth(Event.UPDATE);
        }

        protected _setSelectedIndex(val:number):void {
            if (this._selectedItem) {
                super.removeChild(this._selectedItem);
            }
            this._selectedItem = null;
            this._selectedIndex = -1;
            var item = this._items[val];
            if (item) {
                this._selectedItem = item;
                this._selectedIndex = val;
                super.addChild(this._selectedItem);
            }
        }

        public get length():number {
            return this._items.length;
        }

        public getItemAt(index:number):any {
            return this._items[index];
        }

        public getItemIndex(item:any):number {
            return this.getChildIndex(item);
        }

        public set selectedIndex(val:number) {
            val = +val || 0;
            if (val == this._selectedIndex) {
                return;
            }
            if (val < 0 || val >= this._items.length) {
                val = -1;
            }
            this._setSelectedIndex(val);
        }

        public get selectedIndex():number {
            return this._selectedIndex;
        }

        public set selectedItem(val:DisplayObject) {
            var index:number = this.getChildIndex(val);
            this._setSelectedIndex(index);
        }
    }
}