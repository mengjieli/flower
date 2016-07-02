class Label extends flower.TextField {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
    }

    dispose() {
        this.removeAllBindProperty();
        super.dispose();
    }
}

UIComponent.register(Label);
Label.prototype.__UIComponent = true;
exports.Label = Label;