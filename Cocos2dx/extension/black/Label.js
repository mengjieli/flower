class Label extends flower.TextField {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
    }

    dispose() {
        this.removeAllBindProperty();
        super.dispose();
    }
}

UIComponent.register(Label);
Label.prototype.__UIComponent = true;
exports.Label = Label;