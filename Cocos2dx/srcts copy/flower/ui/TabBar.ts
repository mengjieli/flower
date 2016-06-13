module flower {
    export class TabBar extends ListBase {

        public constructor() {
            super();
            this.layout = new HorizontalLayout();
            this.layout.fixElementSize = false;
        }

        protected _setSelectedItem(item:any) {
            super._setSelectedItem(item);
            (<ViewStack>this.dataProvider).selectedItem = item.data;
        }

        public $onFrameEnd() {
            if (this._data && this._itemRenderer && (this.$getFlag(0x400))) {
                
            }
            super.$onFrameEnd();
        }
    }
}