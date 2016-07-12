function init() {
    var moreList = new ScrollerList();
    moreList.viewport = new LabelList();
    moreList.viewport.requireSelection = false;
    var _this = this;
    moreList.viewport.touchBeginItem = function (e) {
        var panel = e.itemData.panel;
        var list = _this.dataProvider;
        list.setItemIndex(panel, 0);
        list.selectedIndex = 0;
    };
    this.moreList = moreList;
}