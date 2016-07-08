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