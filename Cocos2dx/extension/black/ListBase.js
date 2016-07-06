class ListBase extends DataGroup {

    constructor() {
        super();
        this.requireSelection = true;
        this.itemSelectedEnabled = true;
        this.itemClickedEnabled = true;
    }
}

exports.ListBase = ListBase;