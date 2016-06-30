class Group extends flower.Sprite {

    $UIComponent;

    constructor() {
        super();
        this.$initUIComponent();
    }
}
UIComponent.register(Group);
Group.prototype.__UIComponent = true;
exports.Group = Group;