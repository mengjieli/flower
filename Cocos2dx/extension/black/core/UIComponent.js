/**
 * Event:
 * 1000 creationComplete
 * 1001 add
 * 1002 addToStage
 * 1003 remove
 * 1004 removeFromStage
 * 1020 touchBegin
 * 1021 touchEnd
 * 1022 touchRelease
 * 1100 click
 */
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
            UIComponent.registerEvent(clazz, 1000, "creationComplete", UIEvent.CREATION_COMPLETE);
            UIComponent.registerEvent(clazz, 1001, "add", flower.Event.ADDED);
            UIComponent.registerEvent(clazz, 1002, "addToStage", flower.Event.ADDED_TO_STAGE);
            UIComponent.registerEvent(clazz, 1003, "remove", flower.Event.REMOVED);
            UIComponent.registerEvent(clazz, 1004, "removeFromStage", flower.Event.REMOVED_FROM_STAGE);
            UIComponent.registerEvent(clazz, 1020, "touchBegin", flower.TouchEvent.TOUCH_BEGIN);
            UIComponent.registerEvent(clazz, 1021, "touchEnd", flower.TouchEvent.TOUCH_END);
            UIComponent.registerEvent(clazz, 1022, "touchRelease", flower.TouchEvent.TOUCH_RELEASE);
            UIComponent.registerEvent(clazz, 1023, "rightClick", flower.MouseEvent.RIGHT_CLICK);
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
                }
                if (child.parent == this && this.layout) {
                    this.layout.addElementAt(child, index);
                }
            }
            p.$removeChild = function (child) {
                $root._get(Object.getPrototypeOf(p), "$removeChild", this).call(this, child);
                if (child.parent != this && this.layout) {
                    this.layout.removeElement(child);
                }
            }
            p.removeChild = function (child) {
                $root._get(Object.getPrototypeOf(p), "removeChild", this).call(this, child);
                if (child.parent != this && this.layout) {
                    this.layout.removeElement(child);
                }
            }
            p.setChildIndex = function (child, index) {
                $root._get(Object.getPrototypeOf(p), "setChildIndex", this).call(this, child, index);
                if (child.parent == this && this.layout) {
                    this.layout.setElementIndex(child, index);
                }
            }
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

        p.$callUIComponentEvent = function (type, args) {
            var func = this.$UIComponent[type];
            if (func) {
                func.apply(this.eventThis, args);
            }
        }

        p.$setLeft = function (val) {
            var p = this.$UIComponent;
            if (val == null) {
                if (p[0] == null) {
                    return;
                }
            } else {
                val = +val || 0;
                if (p[0] == val) {
                    return false;
                }
            }
            p[0] = val;
            this.$invalidateContentBounds();
        }

        p.$setRight = function (val) {
            var p = this.$UIComponent;
            if (val == null) {
                if (p[1] == null) {
                    return;
                }
            } else {
                val = +val || 0;
                if (p[1] == val) {
                    return false;
                }
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

        //p.$getWidth = function () {
        //    var p = this.$UIComponent;
        //    if (p[0] != null && p[1] == null && p [2] != null) {
        //        return (p[2] - p[0]) * 2;
        //    }
        //    else if (p[0] == null && p[1] != null && p[2] != null) {
        //        return (p[1] - p[2]) * 2;
        //    } else if (p[0] != null && p[1] != null) {
        //        if (this.parent) {
        //            return parent.width - p[1] - p[0];
        //        }
        //    } else {
        //        if (p[6] && this.parent) {
        //            this.width = parent.width * p[6] / 100;
        //        }
        //    }
        //    return $root._get(Object.getPrototypeOf(p), "$getWidth", this).call(this);
        //}
        //
        //p.$getHeight = function () {
        //    var p = this.$UIComponent;
        //    if (p[3] != null && p[4] == null && p [5] != null) {
        //        return (p[5] - p[3]) * 2;
        //    } else if (p[3] == null && p[4] != null && p[5] != null) {
        //        return (p[4] - p[5]) * 2;
        //    } else if (p[3] != null && p[4] != null) {
        //        if (this.parent) {
        //            return parent.height - p[4] - p[3];
        //        }
        //    } else {
        //        if (p[7] && this.parent) {
        //            return parent.height * p[7] / 100;
        //        }
        //    }
        //    return $root._get(Object.getPrototypeOf(p), "$getHeight", this).call(this);
        //}

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
                if (val == "false") {
                    val = false;
                }
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
    }

    static registerEvent = function (clazz, index, name, eventType) {
        var p = clazz.prototype;
        Object.defineProperty(p, name, {
            get: function () {
                return this.$UIComponent[index];
            },
            set: function (val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    };
                }
                this.$UIComponent[index] = val;
                if (val) {
                    if (!this.$UIComponent[1000 + index]) {
                        this.$UIComponent[1000 + index] = function () {
                            var args = [];
                            for (var i = 0; i < arguments.length; i++) {
                                args[i] = arguments[i];
                            }
                            this.$callUIComponentEvent(index, args);
                        };
                        this.addListener(eventType, this.$UIComponent[1000 + index], this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
    }
}

exports.UIComponent = UIComponent;