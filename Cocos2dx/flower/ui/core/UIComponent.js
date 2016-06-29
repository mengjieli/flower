class UIComponent {
    static register(clazz) {
        var p = clazz.prototype;
        p.$initUIComponent = function () {
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

        p.$getWidth = function () {
            var p = this.$UIComponent;
            var d = this.$DisplayObject;
            return p[9] != null ? p[9] : (d[3] != null ? d[3] : this.$getContentBounds().width);
        }

        p.$getHeight = function () {
            var p = this.$UIComponent;
            var d = this.$DisplayObject;
            return p[10] != null ? p[10] : (d[4] != null ? d[4] : this.$getContentBounds().height);
        }

        p.$setLeft = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[0] == val) {
                return false;
            }
            p[0] = val;
            this.$invalidateContentBounds();
        }

        p.$setPercentWidth = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[6] == val) {
                return false;
            }
            p[6] = val;
            this.$invalidateContentBounds();
        }

        p.$addFlags = function (flags) {
            if (flags & 0x0001 == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                this.__flags |= 0x1000;
            }
            this.__flags |= flags;
        }

        /**
         * 验证 UI 属性
         */
        p.$validateUIComponent = function () {
            this.$removeFlags(0x1000);
            //开始验证属性
            console.log("验证 ui 属性");
            var parentWidth = this.parent.width;
            var parentHeight = this.parent.height;
            
        }

        p.$onFrameEnd = function () {
            if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                this.$validateUIComponent();
            }
            $root._get(Object.getPrototypeOf(Group.prototype), "$onFrameEnd", this).call(this);
        }

        Object.defineProperty(p, "percentWidth", {
            get: function () {
                return this.$UIComponent[6];
            },
            set: function (val) {
                this.$setPercentWidth(val);
            },
            enumerable: true,
            configurable: true
        });
    }
}