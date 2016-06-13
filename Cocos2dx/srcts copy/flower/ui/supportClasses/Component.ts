module flower {
    export class Component {

        public static init(component) {
            component._eventThis = component;
            component.onAddedEXE = null;
            component._binds = {};
            component._absoluteState = false;
            component.$state = new flower.StringValue();
            component._propertyValues = null;
            component._topAlgin = "";
            component._bottomAlgin = "";
            component._leftAlgin = "";
            component._rightAlgin = "";
            component._horizontalCenterAlgin = "";
            component._verticalCenterAlgin = "";
            component._top = 0;
            component._bottom = 0;
            component._left = 0;
            component._right = 0;
            component._horizontalCenter = 0;
            component._verticalCenter = 0;
            component._percentWidth = -1;
            component._percentHeight = -1;
            component._nativeClass = "UI";
            component.addUIEvents();
        }

        public static register(clazz:any, isContainer:boolean = false, hasLayout:boolean = true) {
            var p = clazz.prototype;
            if (isContainer && hasLayout) {
                Object.defineProperty(p, "layout", {
                    get: function () {
                        return this._layout;
                    },
                    set: function (val) {
                        if (this._layout) {
                            this._layout.$clear();
                        }
                        this._layout = val;
                        if (this._layout) {
                            this._layout.$setFlag();
                            var len = this.numChildren;
                            for (var i = 0; i < len; i++) {
                                this._layout.addElementAt(this.getChildAt(i), i);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                p.resetLayout = function () {
                    //if (this.layout && this.$getFlag(0x8) && !(this.parent instanceof flower.Group)) {
                    //    this.layout.$setFlag();
                    //}
                    if (this.layout) {
                        this.layout.updateList(this.width, this.height);
                        this.$removeFlag(0x8);
                    }
                }
            }
            p.addUIEvents = function () {
                this.addListener(flower.Event.ADDED_TO_STAGE, this.onEXEAdded, this);
            }
            Object.defineProperty(p, "eventThis", {
                get: function () {
                    return this._eventThis;
                },
                set: function (val) {
                    this._eventThis = val || this;
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
            p.onEXEAdded = function (e:flower.Event) {
                if (this.onAddedEXE && e.target == this) {
                    this.onAddedEXE.call(this);
                }
            }
            p.bindProperty = function (property:string, content:string, checks:Array<any> = null) {
                if (this._binds[property]) {
                    this._binds[property].dispose();
                }
                this._binds[property] = new flower.Binding(this, checks, property, content);
            }
            p.removeBindProperty = function (property:string) {
                if (this._binds[property]) {
                    this._binds[property].dispose();
                    delete this._binds[property];
                }
            }
            Object.defineProperty(p, "absoluteState", {
                get: function () {
                    return this._absoluteState;
                },
                set: function (val) {
                    this._absoluteState = !!val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "state", {
                get: function () {
                    return this.$state;
                },
                enumerable: true,
                configurable: true
            });
            if (isContainer) {
                Object.defineProperty(Group.prototype, "currentState", {
                    get: function () {
                        return this.$state.value;
                    },
                    set: function (val) {
                        if (this.$state.value == val) {
                            return;
                        }
                        this.$state.value = val;
                        for (var i = 0; i < this.numChildren; i++) {
                            var child = this.getChildAt(i);
                            if (child.nativeClass == "UI") {
                                if (!child.absoluteState) {
                                    child.currentState = val;
                                }
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
            } else {
                Object.defineProperty(p, "currentState", {
                    get: function () {
                        return this.$state.value;
                    },
                    set: function (val) {
                        if (this.$state.value == val) {
                            return;
                        }
                        this.$state.value = val;
                    },
                    enumerable: true,
                    configurable: true
                });
            }
            p.setStatePropertyValue = function (property:string, state:string, val:string, checks:Array<any> = null) {
                if (!this._propertyValues) {
                    this._propertyValues = {};
                    if (!this._propertyValues[property]) {
                        this._propertyValues[property] = {};
                    }
                    this.bindProperty("currentState", "{this.changeState($state)}");
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
            p.changeState = function (state:string):string {
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
            Object.defineProperty(p, "topAlgin", {
                get: function () {
                    return this._topAlgin;
                },
                set: function (val) {
                    if (flower.Engine.DEBUG) {
                        if (val != "" && val != "top" && val != "bottom") {
                            flower.DebugInfo.debug("非法的 topAlgin 值:" + val + "，只能为 \"\" 或 \"top\" 或 \"bottom\"", flower.DebugInfo.ERROR);
                        }
                    }
                    this._topAlgin = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "top", {
                get: function () {
                    return this._top;
                },
                set: function (val) {
                    this._top = +val || 0;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "bottomAlgin", {
                get: function () {
                    return this._bottomAlgin;
                },
                set: function (val) {
                    if (flower.Engine.DEBUG) {
                        if (val != "" && val != "top" && val != "bottom") {
                            flower.DebugInfo.debug("非法的 bottomAlgin 值:" + val + "，只能为 \"\" 或 \"top\" 或 \"bottom\"", flower.DebugInfo.ERROR);
                        }
                    }
                    this._bottomAlgin = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "bottom", {
                get: function () {
                    return this._bottom;
                },
                set: function (val) {
                    this._bottom = +val || 0;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "leftAlgin", {
                get: function () {
                    return this._leftAlgin;
                },
                set: function (val) {
                    if (flower.Engine.DEBUG) {
                        if (val != "" && val != "left" && val != "right") {
                            flower.DebugInfo.debug("非法的 leftAlgin 值:" + val + "，只能为 \"\" 或 \"left\" 或 \"right\"", flower.DebugInfo.ERROR);
                        }
                    }
                    this._leftAlgin = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "left", {
                get: function () {
                    return this._left;
                },
                set: function (val) {
                    this._left = +val || 0;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "rightAlgin", {
                get: function () {
                    return this._rightAlgin;
                },
                set: function (val) {
                    if (flower.Engine.DEBUG) {
                        if (val != "" && val != "left" && val != "right") {
                            flower.DebugInfo.debug("非法的 rightAlgin 值:" + val + "，只能为 \"\" 或 \"left\" 或 \"right\"", flower.DebugInfo.ERROR);
                        }
                    }
                    this._rightAlgin = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "right", {
                get: function () {
                    return this._right;
                },
                set: function (val) {
                    this._right = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "horizontalCenterAlgin", {
                set: function (val) {
                    if (flower.Engine.DEBUG) {
                        if (val != "" && val != "center") {
                            flower.DebugInfo.debug("非法的 horizontalCenterAlgin 值:" + val + "，只能为 \"\" 或 \"center\"", flower.DebugInfo.ERROR);
                        }
                    }
                    this._horizontalCenterAlgin = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "horizontalCenter", {
                get: function () {
                    return this._horizontalCenter;
                },
                set: function (val) {
                    val = +val || 0;
                    this._horizontalCenter = val;
                    this.horizontalCenterAlgin = "center";
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "verticalCenterAlgin", {
                set: function (val) {
                    if (flower.Engine.DEBUG) {
                        if (val != "" && val != "center") {
                            flower.DebugInfo.debug("非法的 verticalCenterAlgin 值:" + val + "，只能为 \"\" 或 \"center\"", flower.DebugInfo.ERROR);
                        }
                    }
                    this._verticalCenterAlgin = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "verticalCenter", {
                get: function () {
                    return this._verticalCenter;
                },
                set: function (val) {
                    val = +val || 0;
                    this._verticalCenter = val;
                    this.verticalCenterAlgin = "center";
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "percentWidth", {
                get: function () {
                    return this._percentWidth < 0 ? 0 : this._percentWidth;
                },
                set: function (val) {
                    val = +val;
                    val = val < 0 ? 0 : val;
                    this._percentWidth = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(p, "percentHeight", {
                get: function () {
                    return this._percentHeight < 0 ? 0 : this._percentHeight;
                },
                set: function (val) {
                    val = +val;
                    val = val < 0 ? 0 : val;
                    this._percentHeight = val;
                    this.$addFlag(0x200);
                },
                enumerable: true,
                configurable: true
            });

            if (isContainer) {
                p.resetUIProperty = function () {
                    if (this.layout == null && this.$getFlag(0x200)) {
                        if (this._percentWidth >= 0) {
                            this.width = this.parent.width * this._percentWidth / 100;
                        }
                        if (this._percentHeight >= 0) {
                            this.height = this.parent.height * this._percentHeight / 100;
                        }
                        if (this._topAlgin != "") {
                            if (this._topAlgin == "top") {
                                this.y = this._top;
                            }
                            else if (this._topAlgin == "bottom") {
                                this.y = this.parent.height - this._top;
                            }
                            if (this._bottomAlgin != "") {
                                if (this._bottomAlgin == "top") {
                                    this.height = this.bottom - this._y;
                                }
                                else if (this._bottomAlgin == "bottom") {
                                    this.height = this.parent.height - this.bottom - this._y;
                                }
                            }
                        }
                        else {
                            if (this._bottomAlgin != "") {
                                if (this._bottomAlgin == "top") {
                                    this.y = this._bottom - this._height * this.scaleY;
                                }
                                else if (this._bottomAlgin == "bottom") {
                                    this.y = this.parent.height - this._bottom - this._height * this.scaleY;
                                }
                            }
                        }
                        if (this._verticalCenterAlgin != "") {
                            this.y = (this.parent.height - this.height * this.scaleY) * .5 + this._verticalCenter;
                        }
                        if (this._leftAlgin != "") {
                            if (this._leftAlgin == "left") {
                                this.x = this._left;
                            }
                            else if (this._leftAlgin == "right") {
                                this.x = this.parent.width - this._left;
                            }
                            if (this._rightAlgin != "") {
                                if (this._rightAlgin == "left") {
                                    this.width = this._right - this._x;
                                }
                                else if (this._rightAlgin == "right") {
                                    this.width = this.parent.width - this._right - this._x;
                                }
                            }
                        }
                        else {
                            if (this._rightAlgin != "") {
                                if (this._rightAlgin == "left") {
                                    this.x = this._right - this._width * this.scaleX;
                                }
                                else if (this._rightAlgin == "right") {
                                    this.x = this.parent.width - this._right - this._width * this.scaleX;
                                }
                            }
                        }
                        if (this._horizontalCenterAlgin != "") {
                            this.x = (this.parent.width - this.width * this.scaleX) * .5 + this._horizontalCenter;
                        }
                        this.$removeFlag(0x200);
                    }
                }
            } else {
                p.resetUIProperty = function () {
                    if (this.$getFlag(0x200) || this.parent.$getFlag(0x200)) {
                        this.$removeFlag(0x200);
                        if (this._percentWidth >= 0) {
                            this.width = this.parent.width * this._percentWidth / 100;
                        }
                        if (this._percentHeight >= 0) {
                            this.height = this.parent.height * this._percentHeight / 100;
                        }
                        if (this._topAlgin != "") {
                            if (this._topAlgin == "top") {
                                this.y = this._top;
                            }
                            else if (this._topAlgin == "bottom") {
                                this.y = this.parent.height - this._top;
                            }
                            if (this._bottomAlgin != "") {
                                if (this._bottomAlgin == "top") {
                                    this.height = this.bottom - this._y;
                                }
                                else if (this._bottomAlgin == "bottom") {
                                    this.height = this.parent.height - this.bottom - this._y;
                                }
                            }
                        }
                        else {
                            if (this._bottomAlgin != "") {
                                if (this._bottomAlgin == "top") {
                                    this.y = this._bottom - this._height * this.scaleY;
                                }
                                else if (this._bottomAlgin == "bottom") {
                                    this.y = this.parent.height - this._bottom - this._height * this.scaleY;
                                }
                            }
                        }
                        if (this._verticalCenterAlgin != "") {
                            this.y = (this.parent.height - this.height * this.scaleY) * .5 + this._verticalCenter;
                        }
                        if (this._leftAlgin != "") {
                            if (this._leftAlgin == "left") {
                                this.x = this._left;
                            }
                            else if (this._leftAlgin == "right") {
                                this.x = this.parent.width - this._left;
                            }
                            if (this._rightAlgin != "") {
                                if (this._rightAlgin == "left") {
                                    this.width = this._right - this._x;
                                }
                                else if (this._rightAlgin == "right") {
                                    this.width = this.parent.width - this._right - this._x;
                                }
                            }
                        }
                        else {
                            if (this._rightAlgin != "") {
                                if (this._rightAlgin == "left") {
                                    this.x = this._right - this._width * this.scaleX;
                                }
                                else if (this._rightAlgin == "right") {
                                    this.x = this.parent.width - this._right - this._width * this.scaleX;
                                }
                            }
                        }
                        if (this._horizontalCenterAlgin != "") {
                            this.x = (this.parent.width - this.width * this.scaleX) * .5 + this._horizontalCenter;
                        }
                    }
                }
            }
        }
    }
}