class DragEvent extends Event {

    //DisplayObject
    $dragSource;
    $dragType;
    $accept = false;

    constructor(type, bubbles = true) {
        super(type, bubbles);
    }

    get dragSource() {
        return this.$dragSource;
    }

    get dragType() {
        return this.$dragType;
    }

    get hasAccept() {
        return this.$accept;
    }

    accept() {
        this.$accept = true;
    }

    static DRAG_OVER = "drag_over";
    static DRAG_OUT = "drag_out";
    static DRAG_END = "drag_end";

    static $Pools = [];

    static create(type, bubbles, dragSource, dragType, dragData) {
        var event = DragEvent.$Pools.pop();
        if (!event) {
            event = new DragEvent(type, bubbles);
        } else {
            event.$type = type;
            event.$bubbles = bubbles;
        }
        event.data = dragData;
        event.$dragSource = dragSource;
        event.$dragType = dragType;
        return event;
    }

    static release(e) {
        DragEvent.$Pools.push(e);
    }
}

exports.DragEvent = DragEvent;