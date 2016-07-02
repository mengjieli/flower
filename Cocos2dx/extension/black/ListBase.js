class ListBase extends DataGroup {

    constructor() {
        super();
        this.requireSelection = true;
        this.itemClickedEnabled = true;
        this.itemSelectedEnabled = true;
    }
}

exports.ListBase = ListBase;