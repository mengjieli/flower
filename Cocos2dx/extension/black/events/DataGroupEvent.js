class DataGroupEvent extends flower.Event {

    __itemData;

    constructor(type, bubbles = false, itemData = null) {
        super(type, bubbles);
        this.__itemData = itemData;
    }

    get itemData() {
        return this.__itemData;
    }

    static SELECTED_ITEM_CHANGE = "selected_item_change";
    static CLICK_ITEM = "click_item";
}

exports.DataGroupEvent = DataGroupEvent;