class Image extends Bitmap {

    $UIComponent;

    constructor() {
        super();
        this.$initUIComponent();
    }
}

UIComponent.register(Image);
Image.prototype.__UIComponent = true;
exports.Image = Image;