class Group extends Sprite {

    $UIComponent;

    constructor() {
        super();
        this.$UIComponent = {
            0: null, //left
            1: null, //right
            2: null, //horizontalCenter
            3: null, //top
            4: null, //bottom
            5: null, //verticalCenter
            6: null, //percentWidth
            7: null, //percentHeight
            8: false, //是否设置了自动布局属性
        };
    }

    $setLeft(val) {
        val = +val || 0;
        var p = this.$UIComponent;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        p[8] = true;
        this.$invalidateComponent();
    }

    $invalidateComponent() {
        this.addFlags(0x1000);
    }

    $validateComponent() {

    }

    $invalidatePosition() {
        this.$addFlagsUp(0x0004 | 0x1000);
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
    }
}