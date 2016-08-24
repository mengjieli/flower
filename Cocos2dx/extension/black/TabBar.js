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

    $setDataProvider(val) {
        var d = this.dataProvider;
        if (super.$setDataProvider(val)) {
            if(d) {
                d.removeListener(flower.Event.CHANGE, this.__onDataProviderSelectedChange, this);
            }
            if (val && val instanceof flower.ViewStack) {
                val.addListener(flower.Event.CHANGE, this.__onDataProviderSelectedChange, this);
            }
        }
    }

    __onDataProviderSelectedChange(e) {
        this.selectedItem = this.dataProvider.selectedChild;
    }

    __setSelectedItemData(item) {
        super.__setSelectedItemData(item);
        if (this.dataProvider instanceof flower.ViewStack) {
            this.dataProvider.selectedChild = this.selectedItem;
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