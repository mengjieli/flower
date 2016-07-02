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
}

exports.TabBar = TabBar;