class Panel extends Group {

    $Panel;

    constructor() {
        super();
        this.$Panel = {
            0: null, //opened
        }
    }

    close() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    closeDispose() {
        if (this.parent) {
            this.parent.dispose(this);
        }
    }
}

exports.Panel = Panel;