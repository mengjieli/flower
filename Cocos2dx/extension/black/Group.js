class Group extends flower.Sprite {

    $UIComponent;

    constructor() {
        super();
        this.$initUIComponent();
    }

    dispose() {
        this.removeAllBindProperty();
        super.dispose();
    }
}
UIComponent.register(Group);
Group.prototype.__UIComponent = true;
exports.Group = Group;
this.removeAllBindProperty();