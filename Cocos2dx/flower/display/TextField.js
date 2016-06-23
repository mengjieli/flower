 class TextField extends DisplayObject {
    constructor() {
        super();
        this.$nativeShow = new PlatformTextField();
    }
}