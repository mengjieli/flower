class DataGroupEvent extends flower.Event {

    __item;

    constructor(type, bubbles = false, item = null) {
        super(type, bubbles);
        this.__item = item;
    }

    get item() {
        return this.__item;
    }

    static SELECTED_ITEM_CHANGE = "selected_item_change";
    static CLICK_ITEM = "click_item";
}

exports.DataGroupEvent = DataGroupEvent;