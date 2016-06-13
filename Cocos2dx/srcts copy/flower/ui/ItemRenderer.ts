module flower {
    export class ItemRenderer extends flower.Group {

        private _data:any;
        private _itemIndex:any;
        private _selected:boolean = false;

        public constructor() {
            super();
            this.absoluteState = true;
        }

        public get data():any {
            return this._data;
        }

        public set data(val:any) {
            this._data = val;
            this.setData(this._data);
        }

        protected setData(val:any) {
        }

        public get itemIndex():number {
            return this._itemIndex;
        }

        $setItemIndex(val:number) {
            this._itemIndex = val;
        }

        protected setSelected(val:boolean) {
            this._selected = val;
            if(this._selected) {
                if (this.onSelectedEXE) {
                    this.onSelectedEXE.call(this);
                }
            }
        }

        public get selected():boolean {
            return this._selected;
        }

        public set selected(val:boolean) {
            val = !!val;
            if (this._selected == val) {
                return;
            }
            this.setSelected(val);
        }

        $onClick() {
            if (this.onClickEXE) {
                this.onClickEXE.call(this);
            }
        }

        private onClickEXE:Function;

        public set onClick(val:any) {
            if (typeof val == "string") {
                var content:string = <any>val;
                val = function () {
                    eval(content);
                }.bind(this.eventThis);
            }
            this.onClickEXE = val;
        }

        public get onClick():any {
            return this.onClickEXE;
        }

        private onSelectedEXE:Function;

        public set onSelected(val:any) {
            if (typeof val == "string") {
                var content:string = <any>val;
                val = function () {
                    eval(content);
                }.bind(this.eventThis);
            }
            this.onSelectedEXE = val;
        }

        public get onSelected():any {
            return this.onClickEXE;
        }

        private _list:flower.ArrayValue;

        public get list():flower.ArrayValue {
            return this._list;
        }

        $setList(val:flower.ArrayValue) {
            this._list = val;
        }
    }
}

