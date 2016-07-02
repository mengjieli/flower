class UIComponent {
    static register(clazz, isContainer = false) {
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
                8: null, //uiWidth
                9: null, //uiHeight
                10: {}, //binds
                11: new StringValue(),//state
                12: false, //absoluteState
                13: this, //eventThis
                14: null, //layout
            };
            this.addUIComponentEvents();
        }

        if (isContainer) {
            Object.defineProperty(p, "layout", {
                get: function () {
                    return this.$UIComponent[14];
                },
                set: function (val) {
                    if (this.$UIComponent[14] == val) {
                        return;
                    }
                    if (this.$UIComponent[14]) {
                        this.$UIComponent[14].$clear();
                    }
                    this.$UIComponent[14] = val;
                    if (val) {
                        val.$setFlag();
                        var len = this.numChildren;
                        for (var i = 0; i < len; i++) {
                            val.addElementAt(this.getChildAt(i), i);
                        }
                    }
                    this.$addFlags(0x2000);
                },
                enumerable: true,
                configurable: true
            });
            p.addChildAt = function (child, index) {
                var flag = child.parent != this ? true : false;
                $root._get(Object.getPrototypeOf(p), "addChildAt", this).call(this, child, index);
                if (flag && child.parent == this) {
                    if (child.__UIComponent && !child.absoluteState) {
                        child["currentState"] = this.currentState;
                    }
                    if (this.layout) {
                        this.layout.addElementAt(child, index);
                    }
                }
            }
            p.$removeChild = function (child) {
                if ($root._get(Object.getPrototypeOf(p), "$removeChild", this).call(this, child)) {
                    if (this.layout) {
                        this.layout.removeElement(child);
                    }
                }
            }
            p.removeChild = function (child) {
                if ($root._get(Object.getPrototypeOf(p), "removeChild", this).call(this, child)) {
                    if (this.layout) {
                        this.layout.removeElement(child);
                    }
                }
            }
            p.setChildIndex = function (child, index) {
                if ($root._get(Object.getPrototypeOf(p), "setChildIndex", this).call(this, child, index)) {
                    if (this.layout) {
                        this.layout.setEelementIndex(child);
                    }
                }
            }
        }


        p.addUIComponentEvents = function () {
            this.addListener(flower.Event.ADDED_TO_STAGE, this.onEXEAdded, this);
        }

        p.bindProperty = function (property, content, checks = null) {
            var binds = this.$UIComponent[10];
            if (binds[property]) {
                binds[property].dispose();
            }
            binds[property] = new flower.Binding(this, checks, property, content);
        }

        p.removeBindProperty = function (property) {
            var binds = this.$UIComponent[10];
            if (binds[property]) {
                binds[property].dispose();
                delete binds[property];
            }
        }

        p.removeAllBindProperty = function () {
            var binds = this.$UIComponent[10];
            for (var key in binds) {
                binds[key].dispose();
                delete binds[key];
            }
        }

        p.setStatePropertyValue = function (property, state, val, checks = null) {
            if (!this._propertyValues) {
                this._propertyValues = {};
                if (!this._propertyValues[property]) {
                    this._propertyValues[property] = {};
                }
                this.bindProperty("currentState", "{this.changeState(this.state)}");
                this._propertyValues[property][state] = {"value": val, "checks": checks};
            }
            else {
                if (!this._propertyValues[property]) {
                    this._propertyValues[property] = {};
                }
                this._propertyValues[property][state] = {"value": val, "checks": checks};
            }
            if (state == this.currentState) {
                this.removeBindProperty(property);
                this.bindProperty(property, val);
            }
        }

        p.changeState = function (state) {
            if (!this._propertyValues) {
                return this.currentState;
            }
            for (var property in this._propertyValues) {
                if (this._propertyValues[property][state]) {
                    this.removeBindProperty(property);
                    this.bindProperty(property, this._propertyValues[property][state].value, this._propertyValues[property][state].checks);
                }
            }
            return this.currentState;
        }

        p.onEXEAdded = function (e) {
            if (this.onAddedEXE && e.target == this) {
                this.onAddedEXE.call(this);
            }
        }

        //p.$getWidth = function () {
        //    var p = this.$UIComponent;
        //    var d = this.$DisplayObject;
        //    return p[9] != null ? p[9] : (d[3] != null ? d[3] : this.$getContentBounds().width);
        //}
        //
        //p.$getHeight = function () {
        //    var p = this.$UIComponent;
        //    var d = this.$DisplayObject;
        //    return p[10] != null ? p[10] : (d[4] != null ? d[4] : this.$getContentBounds().height);
        //}

        p.$setLeft = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[0] == val) {
                return false;
            }
            p[0] = val;
            this.$invalidateContentBounds();
        }

        p.$setRight = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[1] == val) {
                return false;
            }
            p[1] = val;
            this.$invalidateContentBounds();
        }

        p.$setHorizontalCenter = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[2] == val) {
                return false;
            }
            p[2] = val;
            this.$invalidateContentBounds();
        }

        p.$setTop = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[3] == val) {
                return false;
            }
            p[3] = val;
            this.$invalidateContentBounds();
        }

        p.$setBottom = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[4] == val) {
                return false;
            }
            p[4] = val;
            this.$invalidateContentBounds();
        }

        p.$setVerticalCenter = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[5] == val) {
                return false;
            }
            p[5] = val;
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

        p.$setPercentHeight = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[7] == val) {
                return false;
            }
            p[7] = val;
            this.$invalidateContentBounds();
        }

        p.$addFlags = function (flags) {
            if (flags & 0x0001 == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                this.__flags |= 0x1000;
                if (this instanceof flower.Sprite && this.layout) {
                    this.__flags |= 0x2000;
                }
            }
            this.__flags |= flags;
        }

        //p.$setUIWidth = function (val) {
        //    var p = this.$UIComponent;
        //    if (p[8] == val) {
        //        return;
        //    }
        //    p[8] = val;
        //    this.$invalidatePosition();
        //}
        //
        //p.$setUIHeight = function (val) {
        //    var p = this.$UIComponent;
        //    if (p[9] == val) {
        //        return;
        //    }
        //    p[9] = val;
        //    this.$invalidatePosition();
        //}

        /**
         * 验证 UI 属性
         */
        p.$validateUIComponent = function (parent) {
            this.$removeFlags(0x1000);
            //开始验证属性
            //console.log("验证 ui 属性");
            var p = this.$UIComponent;
            if (this.$hasFlags(0x0001)) {
                this.$getContentBounds();
            }
            parent = parent||this.parent;
            //if (this instanceof Group) {
            //    console.log("验证 ui 属性",flower.EnterFrame.frame);
            //}
            if (p[0] != null && p[1] == null && p [2] != null) {
                this.width = (p[2] - p[0]) * 2;
                this.x = parent.$getBounds().x + p[0];
            }
            else if (p[0] == null && p[1] != null && p[2] != null) {
                this.width = (p[1] - p[2]) * 2;
                this.x = parent.$getBounds().x + 2 * p[2] - p[1];
            } else if (p[0] != null && p[1] != null) {
                this.width = parent.width - p[1] - p[0];
                this.x = parent.$getBounds().x + p[0];
            } else {
                if (p[0] != null) {
                    this.x = parent.$getBounds().x + p[0];
                }
                if (p[1] != null) {
                    this.x = parent.$getBounds().x + this.width - p[1] - this.width;
                }
                if (p[2] != null) {
                    this.x = parent.$getBounds().x + (parent.width - this.width) * 0.5;
                }
                if (p[6]) {
                    this.width = parent.width * p[6] / 100;
                }
            }
            if (p[3] != null && p[4] == null && p [5] != null) {
                this.height = (p[5] - p[3]) * 2;
                this.y = parent.$getBounds().y + p[3];
            } else if (p[3] == null && p[4] != null && p[5] != null) {
                this.height = (p[4] - p[5]) * 2;
                this.y = parent.$getBounds().y + 2 * p[5] - p[4];
            } else if (p[3] != null && p[4] != null) {
                this.height = parent.height - p[4] - p[3];
                this.y = parent.$getBounds().y + p[3];
            } else {
                if (p[3] != null) {
                    this.y = parent.$getBounds().y + p[0];
                }
                if (p[4] != null) {
                    this.y = parent.$getBounds().y + this.height - p[1] - this.height;
                }
                if (p[5] != null) {
                    this.y = parent.$getBounds().y + (parent.height - this.height) * 0.5;
                }
                if (p[7]) {
                    this.height = parent.height * p[7] / 100;
                }
            }
            if (this instanceof flower.Sprite) {
                this.$validateChildrenUIComponent();
            }
        }

        Object.defineProperty(p, "left", {
            get: function () {
                return this.$UIComponent[0];
            },
            set: function (val) {
                this.$setLeft(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "right", {
            get: function () {
                return this.$UIComponent[1];
            },
            set: function (val) {
                this.$setRight(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "horizontalCenter", {
            get: function () {
                return this.$UIComponent[2];
            },
            set: function (val) {
                this.$setHorizontalCenter(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "top", {
            get: function () {
                return this.$UIComponent[3];
            },
            set: function (val) {
                this.$setTop(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "bottom", {
            get: function () {
                return this.$UIComponent[4];
            },
            set: function (val) {
                this.$setBottom(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "verticalCenter", {
            get: function () {
                return this.$UIComponent[5];
            },
            set: function (val) {
                this.$setVerticalCenter(val);
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(p, "percentHeight", {
            get: function () {
                return this.$UIComponent[7];
            },
            set: function (val) {
                this.$setPercentHeight(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "currentState", {
            get: function () {
                return this.state.value;
            },
            set: function (val) {
                if (this instanceof flower.Sprite) {
                    if (this.state.value == val) {
                        return;
                    }
                    this.state.value = val;
                    for (var i = 0; i < this.numChildren; i++) {
                        var child = this.getChildAt(i);
                        if (child.__UIComponent) {
                            if (!child.absoluteState) {
                                child.currentState = val;
                            }
                        }
                    }
                } else {
                    if (this.state.value == val) {
                        return;
                    }
                    this.state.value = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "state", {
            get: function () {
                return this.$UIComponent[11];
            },
            set: function (val) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "absoluteState", {
            get: function () {
                return this.$UIComponent[12];
            },
            set: function (val) {
                this.$UIComponent[12] = !!val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "eventThis", {
            get: function () {
                return this.$UIComponent[13];
            },
            set: function (val) {
                this.$UIComponent[13] = val || this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "onAddedToStage", {
            get: function () {
                return this.onAddedEXE;
            },
            set: function (val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onAddedEXE = val;
            },
            enumerable: true,
            configurable: true
        });
    }
}