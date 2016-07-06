class DataGroupEvent extends flower.Event {

    __item;

    constructor(type, bubbles = false, item = null) {
        super(type, bubbles);
        this.__item = item;
    }

    get item() {
        return this.__item;
    }

    static SELECT_ITEM_CHANGE = "select_item_change";
    static CLICK_ITEM = "click_item";
}

exports.DataGroupEvent = DataGroupEvent;