function set dataProvider(val) {
    if (this.viewport) {
        this.viewport.dataProvider = val;
    }
}

function get dataProvider() {
    return this.viewport ? this.viewport.dataProvider : null;
}