function set dataProvider(val) {
    if (this.scroller.viewport) {
        this.scroller.viewport.dataProvider = val;
    }
}

function get dataProvider() {
    return this.scroller.viewport ? this.scroller.viewport.dataProvider : null;
}

function set viewport(val) {
    this.scroller.viewport = val;
}

function get viewport() {
    return this.scroller.viewport;
}

function set clickItem(val) {
    if (this.scroller.viewport) {
        this.scroller.viewport.clickItem = val;
    }
}

function get clickItem() {
    return this.scroller.viewport ? this.scroller.viewport.clickItem : null;
}