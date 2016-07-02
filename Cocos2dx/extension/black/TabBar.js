class TabBar extends ListBase {

    constructor() {
        super();
        this.layout = new HorizontalLayout();
        this.layout.fixElementSize = false;
    }

    _setSelectedItem(item) {
        super._setSelectedItem(item);
        (this.dataProvider).selectedItem = item.data;
    }

    //$onFrameEnd() {
    //    if (this._data && this._itemRenderer && (this.$getFlag(0x400))) {
    //
    //    }
    //    super.$onFrameEnd();
    //}
}

exports.TabBar = TabBar;