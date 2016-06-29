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
            //8: false, //是否设置了自动布局属性
            9: null, //uiWidth
            10: null, //uiHeight
        };
    }

    $getWidth() {
        var p = this.$UIComponent;
        var d = this.$DisplayObject;
        return p[9] != null ? p[9] : (d[3] != null ? d[3] : this.$getContentBounds().width);
    }

    $getHeight() {
        var p = this.$UIComponent;
        var d = this.$DisplayObject;
        return p[10] != null ? p[10] : (d[4] != null ? d[4] : this.$getContentBounds().height);
    }

    $setLeft(val) {
        val = +val || 0;
        var p = this.$UIComponent;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$invalidateContentBounds();
    }

    $invalidateUIComponent() {
        if (this.parent) {
            if (this.parent.__UIComponent) {
                this.$invalidateUIComponent();
            } else {
                this.$addFlags(0x1000);
            }
        } else {
            this.$addFlags(0x1000);
        }
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent() {
        this.$removeFlags(0x1000);
        //开始验证属性
    }

    /**
     * 本身尺寸失效
     */
    $invalidateContentBounds() {
        this.$addFlagsUp(0x0001 | 0x0004);
        this.$invalidateUIComponent();
    }

    $invalidatePosition() {
        this.$addFlagsUp(0x0004);
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
        this.$invalidateUIComponent();
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
    }
}

Group.prototype.__UIComponent = true;

exports.Group = Group;