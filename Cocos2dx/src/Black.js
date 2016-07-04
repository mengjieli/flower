"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var black = {};
var $root = eval("this");
(function () {
    //////////////////////////File:extension/black/core/Black.js///////////////////////////
    var sys = {};
    for (var key in flower.sys) {
        sys[key] = flower.sys[key];
    }
    //////////////////////////End File:extension/black/core/Black.js///////////////////////////

    //////////////////////////File:extension/black/core/UIComponent.js///////////////////////////

    var UIComponent = function () {
        function UIComponent() {
            _classCallCheck(this, UIComponent);
        }

        _createClass(UIComponent, null, [{
            key: "register",
            value: function register(clazz) {
                var isContainer = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
                        11: new StringValue(), //state
                        12: false, //absoluteState
                        13: this, //eventThis
                        14: null, //layout
                        50: null };
                    //[event] creationComplete
                    this.addUIComponentEvents();
                };

                if (isContainer) {
                    Object.defineProperty(p, "layout", {
                        get: function get() {
                            return this.$UIComponent[14];
                        },
                        set: function set(val) {
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
                    };
                    p.$removeChild = function (child) {
                        $root._get(Object.getPrototypeOf(p), "$removeChild", this).call(this, child);
                        if (child.parent != this && this.layout) {
                            this.layout.removeElement(child);
                        }
                    };
                    p.removeChild = function (child) {
                        $root._get(Object.getPrototypeOf(p), "removeChild", this).call(this, child);
                        if (child.parent != this && this.layout) {
                            this.layout.removeElement(child);
                        }
                    };
                    p.setChildIndex = function (child, index) {
                        $root._get(Object.getPrototypeOf(p), "setChildIndex", this).call(this, child, index);
                        if (child.parent == this && this.layout) {
                            this.layout.setElementIndex(child, index);
                        }
                    };
                }

                p.addUIComponentEvents = function () {
                    this.addListener(flower.Event.ADDED_TO_STAGE, this.onEXEAdded, this);
                };

                p.bindProperty = function (property, content) {
                    var checks = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                    var binds = this.$UIComponent[10];
                    if (binds[property]) {
                        binds[property].dispose();
                    }
                    binds[property] = new flower.Binding(this, checks, property, content);
                };

                p.removeBindProperty = function (property) {
                    var binds = this.$UIComponent[10];
                    if (binds[property]) {
                        binds[property].dispose();
                        delete binds[property];
                    }
                };

                p.removeAllBindProperty = function () {
                    var binds = this.$UIComponent[10];
                    for (var key in binds) {
                        binds[key].dispose();
                        delete binds[key];
                    }
                };

                p.setStatePropertyValue = function (property, state, val) {
                    var checks = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                    if (!this._propertyValues) {
                        this._propertyValues = {};
                        if (!this._propertyValues[property]) {
                            this._propertyValues[property] = {};
                        }
                        this.bindProperty("currentState", "{this.changeState(this.state)}");
                        this._propertyValues[property][state] = { "value": val, "checks": checks };
                    } else {
                        if (!this._propertyValues[property]) {
                            this._propertyValues[property] = {};
                        }
                        this._propertyValues[property][state] = { "value": val, "checks": checks };
                    }
                    if (state == this.currentState) {
                        this.removeBindProperty(property);
                        this.bindProperty(property, val);
                    }
                };

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
                };

                p.onEXEAdded = function (e) {
                    if (this.onAddedEXE && e.target == this) {
                        this.onAddedEXE.call(this);
                    }
                };

                p.$callUIComponentEvent = function (type) {
                    var func = this.$UIComponent[type];
                    if (func) {
                        func.call(this.eventThis);
                    }
                };

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
                };

                p.$setRight = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[1] == val) {
                        return false;
                    }
                    p[1] = val;
                    this.$invalidateContentBounds();
                };

                p.$setHorizontalCenter = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[2] == val) {
                        return false;
                    }
                    p[2] = val;
                    this.$invalidateContentBounds();
                };

                p.$setTop = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[3] == val) {
                        return false;
                    }
                    p[3] = val;
                    this.$invalidateContentBounds();
                };

                p.$setBottom = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[4] == val) {
                        return false;
                    }
                    p[4] = val;
                    this.$invalidateContentBounds();
                };

                p.$setVerticalCenter = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[5] == val) {
                        return false;
                    }
                    p[5] = val;
                    this.$invalidateContentBounds();
                };

                p.$setPercentWidth = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[6] == val) {
                        return false;
                    }
                    p[6] = val;
                    this.$invalidateContentBounds();
                };

                p.$setPercentHeight = function (val) {
                    val = +val || 0;
                    var p = this.$UIComponent;
                    if (p[7] == val) {
                        return false;
                    }
                    p[7] = val;
                    this.$invalidateContentBounds();
                };

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
                    parent = parent || this.parent;
                    //if (this instanceof Group) {
                    //    console.log("验证 ui 属性",flower.EnterFrame.frame);
                    //}
                    if (p[0] != null && p[1] == null && p[2] != null) {
                        this.width = (p[2] - p[0]) * 2;
                        this.x = parent.$getBounds().x + p[0];
                    } else if (p[0] == null && p[1] != null && p[2] != null) {
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
                    if (p[3] != null && p[4] == null && p[5] != null) {
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
                };

                Object.defineProperty(p, "left", {
                    get: function get() {
                        return this.$UIComponent[0];
                    },
                    set: function set(val) {
                        this.$setLeft(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "right", {
                    get: function get() {
                        return this.$UIComponent[1];
                    },
                    set: function set(val) {
                        this.$setRight(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "horizontalCenter", {
                    get: function get() {
                        return this.$UIComponent[2];
                    },
                    set: function set(val) {
                        this.$setHorizontalCenter(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "top", {
                    get: function get() {
                        return this.$UIComponent[3];
                    },
                    set: function set(val) {
                        this.$setTop(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "bottom", {
                    get: function get() {
                        return this.$UIComponent[4];
                    },
                    set: function set(val) {
                        this.$setBottom(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "verticalCenter", {
                    get: function get() {
                        return this.$UIComponent[5];
                    },
                    set: function set(val) {
                        this.$setVerticalCenter(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "percentWidth", {
                    get: function get() {
                        return this.$UIComponent[6];
                    },
                    set: function set(val) {
                        this.$setPercentWidth(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "percentHeight", {
                    get: function get() {
                        return this.$UIComponent[7];
                    },
                    set: function set(val) {
                        this.$setPercentHeight(val);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "currentState", {
                    get: function get() {
                        return this.state.value;
                    },
                    set: function set(val) {
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
                    get: function get() {
                        return this.$UIComponent[11];
                    },
                    set: function set(val) {},
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "absoluteState", {
                    get: function get() {
                        return this.$UIComponent[12];
                    },
                    set: function set(val) {
                        this.$UIComponent[12] = !!val;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "eventThis", {
                    get: function get() {
                        return this.$UIComponent[13];
                    },
                    set: function set(val) {
                        this.$UIComponent[13] = val || this;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "creationComplete", {
                    get: function get() {
                        return this.$UIComponent[50];
                    },
                    set: function set(val) {
                        if (typeof val == "string") {
                            var content = val;
                            val = function val() {
                                eval(content);
                            };
                        }
                        this.$UIComponent[50] = val;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(p, "onAddedToStage", {
                    get: function get() {
                        return this.onAddedEXE;
                    },
                    set: function set(val) {
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
        }]);

        return UIComponent;
    }();
    //////////////////////////End File:extension/black/core/UIComponent.js///////////////////////////

    //////////////////////////File:extension/black/data/member/Value.js///////////////////////////


    var Value = function (_flower$EventDispatch) {
        _inherits(Value, _flower$EventDispatch);

        function Value() {
            var _Object$getPrototypeO;

            var _temp, _this, _ret;

            _classCallCheck(this, Value);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Value)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.__old = null, _this.__value = null, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(Value, [{
            key: "$setValue",
            value: function $setValue(val) {
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
            }
        }, {
            key: "value",
            get: function get() {
                return this.__value;
            },
            set: function set(val) {
                this.$setValue(val);
            }
        }, {
            key: "old",
            get: function get() {
                return this.__old;
            }
        }]);

        return Value;
    }(flower.EventDispatcher);

    black.Value = Value;
    //////////////////////////End File:extension/black/data/member/Value.js///////////////////////////

    //////////////////////////File:extension/black/data/member/ArrayValue.js///////////////////////////
    /**
     *
     * @Event
     * Event.ADDED item
     * Event.REMOVED item
     * Event.UPDATE ArrayValue 所有更新都会触发，包括排序
     */

    var ArrayValue = function (_Value) {
        _inherits(ArrayValue, _Value);

        function ArrayValue() {
            var init = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _classCallCheck(this, ArrayValue);

            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayValue).call(this));

            _this2._key = "";
            _this2._rangeMinKey = "";
            _this2._rangeMaxKey = "";

            _this2.list = init || [];
            _this2._length = _this2.list.length;
            return _this2;
        }

        _createClass(ArrayValue, [{
            key: "push",
            value: function push(item) {
                this.list.push(item);
                this._length = this._length + 1;
                this.dispatchWidth(flower.Event.ADDED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }, {
            key: "addItemAt",
            value: function addItemAt(item, index) {
                index = +index & ~0;
                if (index < 0 || index > this.list.length) {
                    sys.$error(3101, index, this.list.length);
                    return;
                }
                this.list.splice(index, 0, item);
                this._length = this._length + 1;
                this.dispatchWidth(flower.Event.ADDED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }, {
            key: "shift",
            value: function shift() {
                if (!this.list.length) {
                    return;
                }
                var item = this.list.shift();
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
                return item;
            }
        }, {
            key: "splice",
            value: function splice(startIndex) {
                var delCount = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                var i;
                startIndex = +startIndex & ~0;
                delCount = +delCount & ~0;
                if (delCount <= 0) {
                    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                        args[_key2 - 2] = arguments[_key2];
                    }

                    for (i = 0; i < args.length; i++) {
                        this.list.splice(startIndex, 0, args[i]);
                    }
                    this._length = this._length + 1;
                    for (i = 0; i < args.length; i++) {
                        this.dispatchWidth(flower.Event.ADDED, args[i]);
                    }
                    this.dispatchWidth(flower.Event.UPDATE, this);
                } else {
                    var list = this.list.splice(startIndex, delCount);
                    this._length = this._length - delCount;
                    for (i = 0; i < list.length; i++) {
                        this.dispatchWidth(flower.Event.REMOVED, list[i]);
                    }
                    this.dispatchWidth(flower.Event.UPDATE, this);
                }
            }
        }, {
            key: "slice",
            value: function slice(startIndex, end) {
                startIndex = +startIndex & ~0;
                end = +end & ~0;
                return new ArrayValue(this.list.slice(startIndex, end));
            }
        }, {
            key: "pop",
            value: function pop() {
                if (!this.list.length) {
                    return;
                }
                var item = this.list.pop();
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
                return item;
            }
        }, {
            key: "removeAll",
            value: function removeAll() {
                if (!this.list.length) {
                    return;
                }
                while (this.list.length) {
                    var item = this.list.pop();
                    this._length = this._length - 1;
                    this.dispatchWidth(flower.Event.REMOVED, item);
                }
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }, {
            key: "removeItem",
            value: function removeItem(item) {
                for (var i = 0, len = this.list.length; i < len; i++) {
                    if (this.list[i] == item) {
                        this.list.splice(i, 1);
                        this._length = this._length - 1;
                        this.dispatchWidth(flower.Event.REMOVED, item);
                        this.dispatchWidth(flower.Event.UPDATE, this);
                        return item;
                    }
                }
                return null;
            }
        }, {
            key: "removeItemAt",
            value: function removeItemAt(index) {
                index = +index & ~0;
                if (index < 0 || index >= this.list.length) {
                    sys.$error(3101, index, this.list.length);
                    return;
                }
                var item = this.list.splice(index, 1)[0];
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
                return item;
            }
        }, {
            key: "removeItemWith",
            value: function removeItemWith(key, value) {
                var key2 = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
                var value2 = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                var item;
                var i;
                if (key2 != "") {
                    for (i = 0; i < this.list.length; i++) {
                        if (this.list[i][key] == value) {
                            item = this.list.splice(i, 1)[0];
                            break;
                        }
                    }
                } else {
                    for (i = 0; i < this.list.length; i++) {
                        if (this.list[i][key] == value && this.list[i][key2] == value2) {
                            item = this.list.splice(i, 1)[0];
                            break;
                        }
                    }
                }
                if (!item) {
                    return;
                }
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
                return item;
            }
        }, {
            key: "getItemIndex",
            value: function getItemIndex(item) {
                for (var i = 0, len = this.list.length; i < len; i++) {
                    if (this.list[i] == item) {
                        return i;
                    }
                }
                return -1;
            }
        }, {
            key: "getItemWith",
            value: function getItemWith(key, value) {
                var key2 = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
                var value2 = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                var i;
                if (!key2) {
                    for (i = 0; i < this.list.length; i++) {
                        if (this.list[i][key] == value) {
                            return this.list[i];
                        }
                    }
                } else {
                    for (i = 0; i < this.list.length; i++) {
                        if (this.list[i][key] == value && this.list[i][key2] == value2) {
                            return this.list[i];
                        }
                    }
                }
                return null;
            }
        }, {
            key: "getItemFunction",
            value: function getItemFunction(func, thisObj) {
                for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                    args[_key3 - 2] = arguments[_key3];
                }

                for (var i = 0; i < this.list.length; i++) {
                    args.push(this.list[i]);
                    var r = func.apply(thisObj, args);
                    args.pop();
                    if (r == true) {
                        return this.list[i];
                    }
                }
                return null;
            }
        }, {
            key: "getItemsWith",
            value: function getItemsWith(key, value) {
                var key2 = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
                var value2 = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                var result = [];
                var i;
                if (key2 != "") {
                    for (i = 0; i < this.list.length; i++) {
                        if (this.list[i][key] == value) {
                            result.push(this.list[i]);
                        }
                    }
                } else {
                    for (i = 0; i < this.list.length; i++) {
                        if (this.list[i][key] == value && this.list[i][key2] == value2) {
                            result.push(this.list[i]);
                        }
                    }
                }
                return result;
            }
        }, {
            key: "setItemsAttributeWith",
            value: function setItemsAttributeWith(findKey, findValue) {
                var setKey = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
                var setValue = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i][findKey] == findValue) {
                        this.list[i][setKey] = setValue;
                    }
                }
            }
        }, {
            key: "getItemsFunction",
            value: function getItemsFunction(func) {
                var thisObj = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                var _arguments__ = [];
                for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
                    _arguments__ = arguments[argumentsLength];
                }
                var result = [];
                var args = [];
                if (_arguments__.length && _arguments__.length > 2) {
                    args = [];
                    for (var a = 2; a < _arguments__.length; a++) {
                        args.push(_arguments__[a]);
                    }
                }
                for (var i = 0; i < this.list.length; i++) {
                    args.push(this.list[i]);
                    var r = func.apply(thisObj, args);
                    args.pop();
                    if (r == true) {
                        result.push(this.list[i]);
                    }
                }
                return result;
            }
        }, {
            key: "sort",
            value: function sort() {
                var _arguments__ = [];
                for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
                    _arguments__ = arguments[argumentsLength];
                }
                this.list.sort.apply(this.list.sort, _arguments__);
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }, {
            key: "getItemAt",
            value: function getItemAt(index) {
                index = +index & ~0;
                if (index < 0 || index >= this.list.length) {
                    sys.$error(3101, index, this.list.length);
                    return;
                }
                return this.list[index];
            }
        }, {
            key: "getItemByValue",
            value: function getItemByValue(value) {
                if (this.key == "") {
                    return null;
                }
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i][this.key] == value) {
                        return this.list[i];
                    }
                }
                return null;
            }
        }, {
            key: "getItemByRange",
            value: function getItemByRange(value) {
                if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
                    return null;
                }
                for (var i = 0; i < this.list.length; i++) {
                    var min = this.list[i][this.rangeMinKey];
                    var max = this.list[i][this.rangeMaxKey];
                    if (value >= min && value <= max) {
                        return this.list[i];
                    }
                }
                return null;
            }
        }, {
            key: "getItemsByRange",
            value: function getItemsByRange(value) {
                if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
                    return null;
                }
                var list = [];
                for (var i = 0; i < this.list.length; i++) {
                    var min = this.list[i][this.rangeMinKey];
                    var max = this.list[i][this.rangeMaxKey];
                    if (value >= min && value <= max) {
                        list.push(this.list[i]);
                    }
                }
                return list;
            }
        }, {
            key: "key",
            set: function set(val) {
                this._key = val;
            },
            get: function get() {
                return this._key;
            }
        }, {
            key: "rangeMinKey",
            set: function set(val) {
                this._rangeMinKey = val;
            },
            get: function get() {
                return this._rangeMinKey;
            }
        }, {
            key: "rangeMaxKey",
            set: function set(val) {
                this._rangeMaxKey = val;
            },
            get: function get() {
                return this._rangeMaxKey;
            }
        }, {
            key: "length",
            get: function get() {
                return this._length;
            },
            set: function set(val) {
                val = +val & ~0;
                if (this._length == val) {} else {
                    while (this.list.length > val) {
                        var item = this.list.pop();
                        this._length = this._length - 1;
                        this.dispatchWidth(flower.Event.REMOVED, item);
                    }
                    this.dispatchWidth(flower.Event.UPDATE, this);
                }
            }
        }]);

        return ArrayValue;
    }(Value);

    black.ArrayValue = ArrayValue;
    //////////////////////////End File:extension/black/data/member/ArrayValue.js///////////////////////////

    //////////////////////////File:extension/black/data/member/BooleanValue.js///////////////////////////

    var BooleanValue = function (_Value2) {
        _inherits(BooleanValue, _Value2);

        function BooleanValue() {
            var init = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            _classCallCheck(this, BooleanValue);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(BooleanValue).call(this));

            _this3.__old = _this3.__value = init;
            return _this3;
        }

        _createClass(BooleanValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = !!val;
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }]);

        return BooleanValue;
    }(Value);

    black.BooleanValue = BooleanValue;
    //////////////////////////End File:extension/black/data/member/BooleanValue.js///////////////////////////

    //////////////////////////File:extension/black/data/member/IntValue.js///////////////////////////

    var IntValue = function (_Value3) {
        _inherits(IntValue, _Value3);

        function IntValue() {
            var init = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            _classCallCheck(this, IntValue);

            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(IntValue).call(this));

            _this4.__old = _this4.__value = init;
            return _this4;
        }

        _createClass(IntValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = +val & ~0;
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }]);

        return IntValue;
    }(Value);

    black.IntValue = IntValue;
    //////////////////////////End File:extension/black/data/member/IntValue.js///////////////////////////

    //////////////////////////File:extension/black/data/member/NumberValue.js///////////////////////////

    var NumberValue = function (_Value4) {
        _inherits(NumberValue, _Value4);

        function NumberValue() {
            var init = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            _classCallCheck(this, NumberValue);

            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(NumberValue).call(this));

            _this5.__old = _this5.__value = init;
            return _this5;
        }

        _createClass(NumberValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = +val;
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }]);

        return NumberValue;
    }(Value);

    black.NumberValue = NumberValue;
    //////////////////////////End File:extension/black/data/member/NumberValue.js///////////////////////////

    //////////////////////////File:extension/black/data/member/ObjectValue.js///////////////////////////

    var ObjectValue = function (_Value5) {
        _inherits(ObjectValue, _Value5);

        function ObjectValue() {
            _classCallCheck(this, ObjectValue);

            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectValue).call(this));

            _this6.__old = _this6.__value = {};
            return _this6;
        }

        _createClass(ObjectValue, [{
            key: "update",
            value: function update() {
                var change = false;
                for (var i = 0; i < arguments.length;) {
                    var name = arguments.length <= i + 0 ? undefined : arguments[i + 0];
                    if (i + 1 >= arguments.length) {
                        break;
                    }
                    var value = arguments.length <= i + 1 + 0 ? undefined : arguments[i + 1 + 0];
                    var obj = this[name];
                    if (obj instanceof Value) {
                        if (obj.value != value) {
                            obj.value = value;
                            change = true;
                        }
                    } else {
                        if (obj != value) {
                            this[name] = value;
                            change = true;
                        }
                    }
                    this[name] = value;
                    i += 2;
                }
                if (change) {
                    this.dispatchWidth(flower.Event.UPDATE, this);
                }
            }
        }, {
            key: "addMember",
            value: function addMember(name, value) {
                this[name] = value;
            }
        }, {
            key: "deleteMember",
            value: function deleteMember(name) {
                delete this[name];
            }
        }]);

        return ObjectValue;
    }(Value);

    black.ObjectValue = ObjectValue;
    //////////////////////////End File:extension/black/data/member/ObjectValue.js///////////////////////////

    //////////////////////////File:extension/black/data/member/StringValue.js///////////////////////////

    var StringValue = function (_Value6) {
        _inherits(StringValue, _Value6);

        function StringValue() {
            var init = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            _classCallCheck(this, StringValue);

            var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(StringValue).call(this));

            _this7.__old = _this7.__value = init;
            return _this7;
        }

        _createClass(StringValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = "" + val;
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }]);

        return StringValue;
    }(Value);

    black.StringValue = StringValue;
    //////////////////////////End File:extension/black/data/member/StringValue.js///////////////////////////

    //////////////////////////File:extension/black/data/member/UIntValue.js///////////////////////////

    var UIntValue = function (_Value7) {
        _inherits(UIntValue, _Value7);

        function UIntValue() {
            var init = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            _classCallCheck(this, UIntValue);

            var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(UIntValue).call(this));

            _this8.__old = _this8.__value = init;
            return _this8;
        }

        _createClass(UIntValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = +val & ~0;
                if (val < 0) {
                    val = 0;
                }
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                this.dispatchWidth(flower.Event.UPDATE, this);
            }
        }]);

        return UIntValue;
    }(Value);

    black.UIntValue = UIntValue;
    //////////////////////////End File:extension/black/data/member/UIntValue.js///////////////////////////

    //////////////////////////File:extension/black/data/DataManager.js///////////////////////////

    var DataManager = function () {
        function DataManager() {
            _classCallCheck(this, DataManager);

            this._defines = {};
            this._root = {};

            if (DataManager.instance) {
                return;
            }
        }

        _createClass(DataManager, [{
            key: "addRootData",
            value: function addRootData(name, className) {
                this[name] = this.createData(className);
                this._root[name] = this[name];
            }
        }, {
            key: "addDefine",
            value: function addDefine(config) {
                var className = config.name;
                if (!className) {
                    sys.$error(3010, flower.ObjectDo.toString(config));
                    return;
                }
                if (!this._defines[className]) {
                    this._defines[className] = {
                        id: 0,
                        className: "",
                        define: null
                    };
                }
                var item = this._defines[className];
                var defineClass = "Data_" + className + (item.id != 0 ? item.id : "");
                item.className = defineClass;
                var extendClassName = "ObjectValue";
                if (config.extends) {
                    var extendsItem = this.getClass(config.extends);
                    if (!extendsItem) {
                        sys.$error(3013, config.extends, flower.ObjectDo.toString(config));
                        return;
                    }
                    extendClassName = "DataManager.getInstance().getClass(\"" + config.extends + "\")";
                }
                var content = "var " + defineClass + " = (function (_super) {\n" + "\t__extends(" + defineClass + ", _super);\n" + "\tfunction " + defineClass + "() {\n" + "\t\t_super.call(this);\n";
                var members = config.members;
                if (members) {
                    var member;
                    for (var key in members) {
                        member = members[key];
                        if (member.type == "int") {
                            content += "\t\tthis." + key + " = new IntValue(" + (member.init != null ? member.init : "") + ");\n";
                        } else if (member.type == "uint") {
                            content += "\t\tthis." + key + " = new UIntValue(" + (member.init != null ? member.init : "") + ");\n";
                        } else if (member.type == "string") {
                            content += "\t\tthis." + key + " = new StringValue(" + (member.init != null ? member.init : "") + ");\n";
                        } else if (member.type == "boolean") {
                            content += "\t\tthis." + key + " = new BooleanValue(" + (member.init != null ? member.init : "") + ");\n";
                        } else if (member.type == "array") {
                            content += "\t\tthis." + key + " = new ArrayValue(" + (member.init != null ? member.init : "") + ");\n";
                        } else if (member.type == "*") {
                            content += "\t\tthis." + key + " = " + (member.init != null ? member.init : "null") + ";\n";
                        } else {
                            content += "\t\tthis." + key + " = DataManager.getInstance().createData(" + member.type + ");\n";
                        }
                    }
                }
                content += "\t}\n" + "\treturn " + defineClass + ";\n" + "})(" + extendClassName + ");\n";
                content += "DataManager.getInstance().$addClassDefine(" + defineClass + ", \"" + className + "\");\n";
                console.log("数据结构:\n" + content);
                if (sys.DEBUG) {
                    try {
                        eval(content);
                    } catch (e) {
                        sys.$error(3011, e, content);
                    }
                } else {
                    eval(className);
                }
                item.id++;
            }
        }, {
            key: "$addClassDefine",
            value: function $addClassDefine(clazz, className) {
                var item = this._defines[className];
                item.define = clazz;
            }
        }, {
            key: "getClass",
            value: function getClass(className) {
                var item = this._defines[className];
                if (!item) {
                    return null;
                }
                return item.define;
            }
        }, {
            key: "createData",
            value: function createData(className) {
                var item = this._defines[className];
                if (!item) {
                    sys.$error(3012, className);
                    return;
                }
                return new item.define();
            }
        }, {
            key: "clear",
            value: function clear() {
                for (var key in this._root) {
                    delete this._root[key];
                    delete this[key];
                }
                this._defines = {};
            }
        }], [{
            key: "getInstance",
            value: function getInstance() {
                return DataManager.instance;
            }
        }]);

        return DataManager;
    }();

    DataManager.instance = new DataManager();


    black.DataManager = DataManager;
    //////////////////////////End File:extension/black/data/DataManager.js///////////////////////////

    //////////////////////////File:extension/black/language/zh_CN.js///////////////////////////
    var locale_strings = flower.sys.$locale_strings["zh_CN"];

    locale_strings[3001] = "UIParse 异步加载资源出错:{0}";
    locale_strings[3002] = "找不到 UI 对应的路径， UI 类名:{0}";
    locale_strings[3003] = "解析 UI 出错,:\n{0}\n{1}\n\n解析后内容为:\n{2}";
    locale_strings[3004] = "解析 UI 出错:无法解析的命名空间 {0} :\n{1}";
    locale_strings[3005] = "解析 UI 出错:无法解析的类名 {0} :\n{1}";
    locale_strings[3006] = "解析 UI 出错,未设置命名空间 xmlns:f=\"flower\" :\n{0}";
    locale_strings[3007] = "解析 UI 脚本文件出错, url={0} content:\n{1}";
    locale_strings[3010] = "没有定义数据结构类名 :\n{0}";
    locale_strings[3011] = "数据结构类定义解析出错 :{0}\n{1}";
    locale_strings[3012] = "没有定义的数据结构 :{0}";
    locale_strings[3013] = "没有找到要集成的数据结构类 :{0} ，数据结构定义为:\n{1}";
    locale_strings[3100] = "没有定义的数据类型 :{0}";
    locale_strings[3101] = "超出索引范围 :{0}，当前索引范围 0 ~ {1}";
    //////////////////////////End File:extension/black/language/zh_CN.js///////////////////////////

    //////////////////////////File:extension/black/layout/Layout.js///////////////////////////

    var Layout = function () {
        function Layout() {
            _classCallCheck(this, Layout);

            this._fixElementSize = false;
            this.elements = [];
            this.flag = false;
        }

        _createClass(Layout, [{
            key: "isElementsOutSize",
            value: function isElementsOutSize(startX, starY, width, height) {
                return false;
            }
        }, {
            key: "getFirstItemIndex",
            value: function getFirstItemIndex(elementWidth, elementHeight, startX, startY) {
                return 0;
            }
        }, {
            key: "getContentSize",
            value: function getContentSize() {
                return null;
            }
        }, {
            key: "measureSize",
            value: function measureSize(elementWidth, elementHeight, elementCount) {
                return null;
            }
        }, {
            key: "addElementAt",
            value: function addElementAt(element, index) {
                var len = this.elements.length;
                for (var i = 0; i < len; i++) {
                    if (this.elements[i] == element) {
                        this.elements.splice(i, 1);
                        break;
                    }
                }
                this.elements.splice(index, 0, element);
                this.flag = true;
            }
        }, {
            key: "setElementIndex",
            value: function setElementIndex(element, index) {
                var len = this.elements.length;
                for (var i = 0; i < len; i++) {
                    if (this.elements[i] == element) {
                        this.elements.splice(i, 1);
                        break;
                    }
                }
                this.elements.splice(index, 0, element);
                this.flag = true;
            }
        }, {
            key: "removeElement",
            value: function removeElement(element) {
                var len = this.elements.length;
                for (var i = 0; i < len; i++) {
                    if (this.elements[i] == element) {
                        this.elements.splice(i, 1);
                        break;
                    }
                }
                this.flag = true;
            }
        }, {
            key: "removeElementAt",
            value: function removeElementAt(index) {
                this.elements.splice(index, 1);
                this.flag = true;
            }
        }, {
            key: "$setFlag",
            value: function $setFlag() {
                this.flag = true;
            }
        }, {
            key: "updateList",
            value: function updateList(width, height) {
                var startIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            }
        }, {
            key: "$clear",
            value: function $clear() {
                this.elements = [];
                this.flag = false;
            }
        }, {
            key: "fixElementSize",
            get: function get() {
                return this._fixElementSize;
            },
            set: function set(val) {
                this._fixElementSize = !!val;
            }
        }]);

        return Layout;
    }();

    Layout.VerticalAlign = "vertical";
    Layout.HorizontalAlign = "horizontal";
    Layout.NoneAlign = "";


    black.Layout = Layout;
    //////////////////////////End File:extension/black/layout/Layout.js///////////////////////////

    //////////////////////////File:extension/black/layout/LinearLayout.js///////////////////////////

    var LinearLayout = function (_Layout) {
        _inherits(LinearLayout, _Layout);

        function LinearLayout() {
            _classCallCheck(this, LinearLayout);

            var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(LinearLayout).call(this));

            _this9._gap = 0;
            _this9._align = "";

            _this9._fixElementSize = true;
            return _this9;
        }

        _createClass(LinearLayout, [{
            key: "isElementsOutSize",
            value: function isElementsOutSize(startX, starY, width, height) {
                if (this._align == flower.Layout.VerticalAlign) {
                    if (starY + height <= this._maxY) {
                        return true;
                    }
                }
                if (this._align == flower.Layout.HorizontalAlign) {
                    if (startX + width <= this._maxX) {
                        return true;
                    }
                }
                return false;
            }
        }, {
            key: "getFirstItemIndex",
            value: function getFirstItemIndex(elementWidth, elementHeight, startX, startY) {
                if (this._align == flower.Layout.VerticalAlign) {
                    return Math.floor(startY / (elementHeight + this._gap));
                } else if (this._align == flower.Layout.HorizontalAlign) {
                    return Math.floor(startX / (elementWidth + this._gap));
                }
                return 0;
            }
        }, {
            key: "getContentSize",
            value: function getContentSize() {
                var size = flower.Size.create(0, 0);
                if (!this.elements.length) {
                    return size;
                }
                var minX = this.elements[0].x;
                var maxX = this.elements[0].x + this.elements[0].width;
                var minY = this.elements[0].y;
                var maxY = this.elements[0].y + this.elements[0].height;
                var element;
                for (var i = 1; i < this.elements.length; i++) {
                    element = this.elements[i];
                    minX = element.x < minX ? element.x : minX;
                    maxX = element.x + element.width > maxX ? element.x + element.width : maxX;
                    minY = element.y < minY ? element.y : minY;
                    maxY = element.y + element.height > maxY ? element.y + element.height : maxY;
                }
                size.width = maxX - minX;
                size.height = maxY - minY;
                return size;
            }
        }, {
            key: "measureSize",
            value: function measureSize(elementWidth, elementHeight, elementCount) {
                var size = flower.Size.create(elementWidth, elementHeight);
                if (this.elements.length) {
                    if (this._fixElementSize) {
                        if (this._align == flower.Layout.VerticalAlign) {
                            size.height = elementCount * (elementHeight + this._gap);
                        } else if (this._align == flower.Layout.HorizontalAlign) {
                            size.width = elementCount * (elementWidth + this._gap);
                        }
                    }
                }
                return size;
            }
        }, {
            key: "updateList",
            value: function updateList(width, height) {
                var startIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

                //flower.trace("update layout",flower.EnterFrame.frame);
                if (!this.flag) {
                    return;
                }
                var list = this.elements;
                var len = list.length;
                if (!len) {
                    return;
                }
                this._maxX = 0;
                this._maxY = 0;
                var i;
                if (this._align == flower.Layout.VerticalAlign) {
                    if (this._fixElementSize) {
                        var eh = list[0].height;
                        for (i = 0; i < len; i++) {
                            list[i].y = (i + startIndex) * (eh + this._gap);
                        }
                        this._maxY = (len + startIndex) * (eh + this._gap);
                    } else {
                        var y = 0;
                        for (i = 0; i < len; i++) {
                            list[i].y = y;
                            y += list[i].height + this._gap;
                            this._maxY = y;
                        }
                    }
                }
                if (this._align == flower.Layout.HorizontalAlign) {
                    if (this._fixElementSize) {
                        var ew = list[0].width;
                        for (i = 0; i < len; i++) {
                            list[i].x = (i + startIndex) * (ew + this._gap);
                        }
                        this._maxX = (len + startIndex) * (ew + this._gap);
                    } else {
                        var x = 0;
                        for (i = 0; i < len; i++) {
                            list[i].x = x;
                            x += list[i].width + this._gap;
                            this._maxX = x;
                        }
                    }
                }
            }
        }, {
            key: "gap",
            get: function get() {
                return this._gap;
            },
            set: function set(val) {
                val = +val || 0;
                this._gap = val;
            }
        }, {
            key: "align",
            get: function get() {
                return this._align;
            },
            set: function set(val) {
                this._align = val;
            }
        }]);

        return LinearLayout;
    }(Layout);
    //////////////////////////End File:extension/black/layout/LinearLayout.js///////////////////////////

    //////////////////////////File:extension/black/layout/HorizontalLayout.js///////////////////////////


    var HorizontalLayout = function (_LinearLayout) {
        _inherits(HorizontalLayout, _LinearLayout);

        function HorizontalLayout() {
            _classCallCheck(this, HorizontalLayout);

            var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(HorizontalLayout).call(this));

            _this10.align = flower.Layout.HorizontalAlign;
            return _this10;
        }

        return HorizontalLayout;
    }(LinearLayout);

    black.HorizontalLayout = HorizontalLayout;
    //////////////////////////End File:extension/black/layout/HorizontalLayout.js///////////////////////////

    //////////////////////////File:extension/black/layout/VerticalLayout.js///////////////////////////

    var VerticalLayout = function (_LinearLayout2) {
        _inherits(VerticalLayout, _LinearLayout2);

        function VerticalLayout() {
            _classCallCheck(this, VerticalLayout);

            var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(VerticalLayout).call(this));

            _this11.align = flower.Layout.VerticalAlign;
            return _this11;
        }

        return VerticalLayout;
    }(LinearLayout);

    black.VerticalLayout = VerticalLayout;
    //////////////////////////End File:extension/black/layout/VerticalLayout.js///////////////////////////

    //////////////////////////File:extension/black/Group.js///////////////////////////

    var Group = function (_flower$Sprite) {
        _inherits(Group, _flower$Sprite);

        function Group() {
            _classCallCheck(this, Group);

            var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this));

            _this12.$initUIComponent();
            return _this12;
        }

        _createClass(Group, [{
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                    if (this.layout) {
                        this.__flags |= 0x2000;
                    }
                }
                this.__flags |= flags;
            }
        }, {
            key: "$validateChildrenUIComponent",
            value: function $validateChildrenUIComponent() {
                var children = this.__children;
                if (children) {
                    var child;
                    for (var i = 0, len = children.length; i < len; i++) {
                        child = children[i];
                        if (child.__UIComponent) {
                            child.$validateUIComponent();
                        }
                    }
                }
            }
        }, {
            key: "$resetLayout",
            value: function $resetLayout() {
                if (this.$hasFlags(0x2000)) {
                    this.$removeFlags(0x2000);
                    if (this.layout) {
                        this.layout.updateList(this.width, this.height);
                    }
                }
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                    this.$validateUIComponent();
                }
                _get(Object.getPrototypeOf(Group.prototype), "$onFrameEnd", this).call(this);
                this.$resetLayout();
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.removeAllBindProperty();
                _get(Object.getPrototypeOf(Group.prototype), "dispose", this).call(this);
            }
        }]);

        return Group;
    }(flower.Sprite);

    UIComponent.register(Group, true);
    Group.prototype.__UIComponent = true;
    black.Group = Group;
    //////////////////////////End File:extension/black/Group.js///////////////////////////

    //////////////////////////File:extension/black/UIParser.js///////////////////////////

    var UIParser = function (_Group) {
        _inherits(UIParser, _Group);

        function UIParser() {
            _classCallCheck(this, UIParser);

            var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(UIParser).call(this));

            _this13.classes = flower.UIParser.classes;
            return _this13;
        }

        _createClass(UIParser, [{
            key: "parseUIAsync",
            value: function parseUIAsync(url) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                this.loadURL = url;
                this.loadData = data;
                var loader = new flower.URLLoader(url);
                loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
                loader.addListener(flower.Event.ERROR, this.loadContentError, this);
                loader.load();
                this.parseUIAsyncFlag = true;
            }
        }, {
            key: "parseAsync",
            value: function parseAsync(url) {
                this.loadURL = url;
                var loader = new flower.URLLoader(url);
                loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
                loader.addListener(flower.Event.ERROR, this.loadContentError, this);
                loader.load();
                this.parseUIAsyncFlag = false;
            }
        }, {
            key: "loadContentError",
            value: function loadContentError(e) {
                if (this.hasListener(Event.ERROR)) {
                    this.dispatchWidth(Event.ERROR, getLanguage(3001, e.currentTarget.url));
                } else {
                    sys.$error(3001, e.currentTarget.url);
                }
            }
        }, {
            key: "loadContentComplete",
            value: function loadContentComplete(e) {
                this.relationUI = [];
                var xml = flower.XMLElement.parse(e.data);
                this.loadContent = xml;
                var list = xml.getAllElements();
                var scriptURL = "";
                for (var i = 0; i < list.length; i++) {
                    var name = list[i].name;
                    var nameSpace = name.split(":")[0];
                    name = name.split(":")[1];
                    if (nameSpace == "local") {
                        if (!this.classes.local[name] && !this.classes.localContent[name]) {
                            if (!this.classes.localURL[name]) {
                                sys.$error(3002, name);
                                return;
                            }
                            var find = false;
                            for (var f = 0; f < this.relationUI.length; f++) {
                                if (this.relationUI[f] == this.classes.localURL[name]) {
                                    find = true;
                                    break;
                                }
                            }
                            if (!find) {
                                this.relationUI.push(this.classes.localURL[name]);
                            }
                        }
                    }
                    if (nameSpace == "f" && name == "script" && list[i].getAttribute("src")) {
                        scriptURL = list[i].getAttribute("src").value;
                    }
                }
                this.relationIndex = 0;
                if (scriptURL != "") {
                    if (scriptURL.slice(0, 2) == "./") {
                        if (this.loadURL.split("/").length == 1) {
                            scriptURL = scriptURL.slice(2, scriptURL.length);
                        } else {
                            scriptURL = this.loadURL.slice(0, this.loadURL.length - this.loadURL.split("/")[this.loadURL.split("/").length - 1].length) + scriptURL.slice(2, scriptURL.length);
                        }
                    }
                    this.loadScript(scriptURL);
                } else {
                    this.loadNextRelationUI();
                }
            }
        }, {
            key: "loadScript",
            value: function loadScript(url) {
                this.scriptURL = url;
                var loader = new flower.URLLoader(url);
                loader.addListener(flower.Event.COMPLETE, this.loadScriptComplete, this);
                loader.addListener(flower.IOErrorEvent.ERROR, this.loadContentError, this);
                loader.load();
            }
        }, {
            key: "loadScriptComplete",
            value: function loadScriptComplete(e) {
                this.scriptContent = e.data;
                this.loadNextRelationUI();
            }
        }, {
            key: "loadNextRelationUI",
            value: function loadNextRelationUI() {
                var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

                if (e) {
                    this.relationIndex++;
                }
                if (this.relationIndex >= this.relationUI.length) {
                    if (this.parseUIAsyncFlag) {
                        var ui = this.parseUI(this.loadContent, this.loadData);
                        //this.dispatchWidth(Event.COMPLETE, ui);
                    } else {
                            var data = this.parse(this.loadContent);
                            //this.dispatchWidth(Event.COMPLETE, data);
                        }
                } else {
                        var parser = new UIParser();
                        parser.parseAsync(this.relationUI[this.relationIndex]);
                        parser.addListener(flower.Event.COMPLETE, this.loadNextRelationUI, this);
                        parser.addListener(Event.ERROR, this.relationLoadError, this);
                    }
            }
        }, {
            key: "relationLoadError",
            value: function relationLoadError(e) {
                if (this.hasListener(Event.ERROR)) {
                    this.dispatchWidth(Event.ERROR, e.data);
                } else {
                    $error(e.data);
                }
            }
        }, {
            key: "parseUI",
            value: function parseUI(content) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                var className = this.parse(content);
                var UIClass = this.classes.local[className];
                if (data) {
                    return new UIClass(data);
                }
                var ui = new UIClass();
                if (!ui.parent) {
                    this.addChild(ui);
                }
                return ui;
            }
        }, {
            key: "parse",
            value: function parse(content) {
                this.parseContent = content;
                var xml;
                if (typeof content == "string") {
                    xml = flower.XMLElement.parse(content);
                } else {
                    xml = content;
                }
                if (xml.getNameSapce("f") == null || xml.getNameSapce("f").value != "flower") {
                    sys.$error(3006, content);
                    return null;
                }
                this.rootXML = xml;
                var className = this.decodeRootComponent(xml, content);
                this.parseContent = "";
                this._className = className;
                this.rootXML = null;
                return className;
            }
        }, {
            key: "decodeRootComponent",
            value: function decodeRootComponent(xml, classContent) {
                var content = "";
                var hasLocalNS = xml.getNameSapce("local") ? true : false;
                var uiname = xml.name;
                var uinameNS = uiname.split(":")[0];
                var extendClass = "";
                uiname = uiname.split(":")[1];
                var className = "";
                var allClassName = "";
                var packages = [];
                if (uinameNS == "local") {
                    extendClass = uiname;
                } else {
                    extendClass = this.classes[uinameNS][uiname];
                    if (!extendClass && this.classes.localContent[extendClass]) {
                        this.parse(this.classes.localContent[extendClass]);
                    }
                }
                var classAtr = xml.getAttribute("class");
                if (classAtr) {
                    className = classAtr.value;
                    allClassName = className;
                    packages = className.split(".");
                    if (packages.length > 1) {
                        className = packages[packages.length - 1];
                        packages.pop();
                    } else {
                        packages = [];
                    }
                } else {
                    className = "$UI" + UIParser.id++;
                    allClassName = className;
                }
                var changeAllClassName = allClassName;
                if (this.classes.local[allClassName]) {
                    if (this.classes.localContent[allClassName] == classContent) {
                        return allClassName;
                    } else {
                        changeAllClassName = changeAllClassName.slice(0, changeAllClassName.length - className.length);
                        className = "$UI" + UIParser.id++;
                        changeAllClassName += className;
                    }
                }
                var before = "";
                for (var i = 0; i < packages.length; i++) {
                    content += before + "var " + packages[i] + ";\n";
                    content += before + "(function (" + packages[i] + ") {\n";
                    before += "\t";
                }
                content += (packages.length ? before : "") + "var " + className + " = (function (_super) {\n";
                content += before + "\t__extends(" + className + ", _super);\n";
                content += before + "\tfunction " + className + "(_data) {\n";
                content += before + "\t\tif(_data) this._data = _data;\n";
                content += before + "\t\t _super.call(this);\n";
                content += before + "\t\tthis." + className + "_binds = [];\n";
                var scriptInfo = {
                    content: ""
                };
                this.hasInitFunction = false;
                content += this.decodeScripts(before, className, xml.getElements("f:script"), scriptInfo);
                content += before + "\t\tthis." + className + "_initMain(this);\n";
                var propertyList = [];
                this.decodeObject(before + "\t", className, className + "_initMain", false, xml, hasLocalNS, propertyList, {});
                if (this.hasInitFunction) {
                    content += before + "\t\tthis." + className + "_init();\n";
                }
                content += before + "\t\tthis." + className + "_setBindProperty" + "();\n";
                content += before + "\t\tthis.$callUIComponentEvent(50);\n";
                content += before + "\t}\n\n";
                content += propertyList[propertyList.length - 1];
                for (var i = 0; i < propertyList.length - 1; i++) {
                    content += propertyList[i];
                }
                content += scriptInfo.content;
                content += before + "\t" + className + ".prototype." + className + "_setBindProperty = function() {\n";
                content += before + "\t\tfor(var i = 0; i < this." + className + "_binds.length; i++) this." + className + "_binds[i][0].bindProperty(this." + className + "_binds[i][1],this." + className + "_binds[i][2],[this]);\n";
                content += before + "\t}\n\n";
                content += before + "\treturn " + className + ";\n";
                if (uinameNS == "f") {
                    content += before + "})(" + extendClass + ");\n";
                } else {
                    content += before + "})(flower.UIParser.getLocalUIClass(\"" + extendClass + "\"));\n";
                }
                before = "";
                var classEnd = "";
                for (var i = 0; i < packages.length; i++) {
                    if (i == 0) {
                        classEnd = before + "})(" + packages[i] + " || (" + packages[i] + " = {}));\n" + classEnd;
                    } else {
                        classEnd = before + "})(" + packages[i] + " = " + packages[i - 1] + "." + packages[i] + " || (" + packages[i - 1] + "." + packages[i] + " = {}));\n" + classEnd;
                    }
                    before += "\t";
                    if (i == packages.length - 1) {
                        classEnd = before + packages[i] + "." + className + " = " + className + ";\n" + classEnd;
                    }
                }
                content += classEnd;
                content += "\n\nUIParser.registerLocalUIClass(\"" + allClassName + "\", " + changeAllClassName + ");\n";
                //trace("解析后内容:\n", content);
                if (sys.DEBUG) {
                    try {
                        eval(content);
                    } catch (e) {
                        sys.$error(3003, e, this.parseContent, content);
                    }
                } else {
                    eval(content);
                }
                flower.UIParser.setLocalUIClassContent(allClassName, classContent);
                trace("解析类:\n", content);
                return allClassName;
            }
        }, {
            key: "decodeScripts",
            value: function decodeScripts(before, className, scripts, script) {
                var content = "";
                if (this.scriptContent && this.scriptContent != "") {
                    var scriptContent = this.scriptContent;
                    //删除注释
                    scriptContent = flower.StringDo.deleteProgramNote(scriptContent, 0);
                    var i = 0;
                    var len = scriptContent.length;
                    var pos = 0;
                    var list = [];
                    while (true) {
                        var nextFunction = this.findNextFunction(scriptContent, pos);
                        if (nextFunction) {
                            pos = nextFunction.endIndex;
                            list.push(nextFunction);
                        } else {
                            break;
                        }
                    }
                    for (var i = 0; i < list.length; i++) {
                        var func = list[i];
                        if (func.gset == 0) {
                            script.content += before + "\t" + className + ".prototype." + func.name + " = function(" + func.params + ") " + func.content + "\n";
                        } else {
                            var setContent = func.gset == 1 ? "" : func.content;
                            var getContent = func.gset == 1 ? func.content : "";
                            var prams = func.gset == 1 ? "" : func.params;
                            for (var f = 0; f < list.length; f++) {
                                if (f != i && list[f].name == func.name && list[f].gset && list[f].gset != func.gset) {
                                    if (list[f].gset == 1) {
                                        getContent = list[f].content;
                                    } else {
                                        setContent = list[f].content;
                                        prams = list[f].params;
                                    }
                                    list.splice(f, 1);
                                    break;
                                }
                            }
                            script.content += before + "\tObject.defineProperty(" + className + ".prototype, \"" + func.name + "\", {\n";
                            if (getContent != "") {
                                script.content += "\t\tget: function () " + getContent + ",\n";
                            }
                            if (setContent != "") {
                                script.content += "\t\tset: function (" + prams + ") " + setContent + ",\n";
                            }
                            script.content += "\t\tenumerable: true,\n";
                            script.content += "\t\tconfigurable: true\n";
                            script.content += "\t\t});\n\n";
                        }
                    }
                } else {
                    for (var i = 0; i < scripts.length; i++) {
                        for (var s = 0; s < scripts[i].list.length; s++) {
                            var item = scripts[i].list[s];
                            var childName = item.name;
                            childName = childName.split(":")[1];
                            if (item.list.length && item.getElement("f:set") || item.getElement("f:get")) {
                                var setFunction = item.getElement("f:set");
                                var getFunction = item.getElement("f:get");
                                script.content += before + "\tObject.defineProperty(" + className + ".prototype, \"" + childName + "\", {\n";
                                if (getFunction) {
                                    script.content += "\t\tget: function () {\n";
                                    script.content += "\t\t\t" + getFunction.value + "\n";
                                    script.content += "\t\t},\n";
                                }
                                if (setFunction) {
                                    script.content += "\t\tset: function (val) {\n";
                                    script.content += "\t\t\t" + setFunction.value + "\n";
                                    script.content += "\t\t},\n";
                                }
                                script.content += "\t\tenumerable: true,\n";
                                script.content += "\t\tconfigurable: true\n";
                                script.content += "\t\t});\n\n";
                            } else if (item.value == null || item.value == "") {
                                var initValue = item.getAttribute("init");
                                content += before + "\t\tthis." + childName + " = " + (initValue == null ? "null" : initValue.value) + ";\n";
                            } else {
                                if (childName == "init") {
                                    childName = className + "_" + childName;
                                    this.hasInitFunction = true;
                                }
                                script.content += before + "\t" + className + ".prototype." + childName + " = function(";
                                var params = item.getAttribute("params");
                                if (params) {
                                    script.content += params.value;
                                }
                                script.content += ") {\n";
                                script.content += "\t\t" + item.value;
                                script.content += "\t}\n\n";
                            }
                        }
                    }
                }
                return content;
            }

            /**
             * 查找下一个函数，并分析出 函数名和参数列表
             * @param content
             * @param start
             * @return {
             *      name : 函数名
             *      gset : 0.普通函数 1.get函数 2.set函数
             *      params : 参数列表 (也是字符串，直接用就可以)
             *      content : 函数体
             *      endIndex : 函数体结束标识 } 之后的那个位置
             * }
             */

        }, {
            key: "findNextFunction",
            value: function findNextFunction(content, start) {
                var len = "function".length;
                var flag;
                var name;
                var params;
                var char;
                var pos, pos2, i;
                var res;
                var gset = 0;
                var funcName;
                //跳过空格和注释
                i = flower.StringDo.jumpProgramSpace(content, start);
                if (i == content.length) {
                    return null;
                }
                if (content.slice(i, i + len) == "function") {
                    if (i != 0) {
                        //判断 function 之前是不是分隔符
                        char = content.charAt(i - 1);
                        if (char != "\t" && char != " " && char != "\r" && char != "\n") {
                            sys.$error(3007, this.scriptURL, this.scriptContent);
                        }
                    }
                    i = pos = i + len;
                    //跳过 function 之后的分隔符
                    pos2 = flower.StringDo.jumpProgramSpace(content, pos);
                    if (pos2 == pos) {
                        sys.$error(3007, this.scriptURL, this.scriptContent);
                    }
                    pos = pos2;
                    //获取 function 之后的函数名
                    name = flower.StringDo.findId(content, pos);
                    if (name == "") {
                        i = pos;
                        sys.$error(3007, this.scriptURL, this.scriptContent);
                    }
                    if (name == "get" || name == "set") {
                        gset = name == "get" ? 1 : 2;
                        //跳过 function 之后的分隔符
                        pos2 = flower.StringDo.jumpProgramSpace(content, pos);
                        if (pos2 == pos) {
                            sys.$error(3007, this.scriptURL, this.scriptContent);
                        }
                        pos = pos2;
                        //获取 function 之后的函数名
                        name = flower.StringDo.findId(content, pos);
                        if (name == "") {
                            i = pos;
                            sys.$error(3007, this.scriptURL, this.scriptContent);
                        }
                    }
                    funcName = name;
                    //跳过函数名之后的分隔符
                    i = pos = flower.StringDo.jumpProgramSpace(content, pos + name.length);
                    //判断函数名之后是不是(
                    char = content.charAt(pos);
                    if (char != "(") {
                        sys.$error(3007, this.scriptURL, this.scriptContent);
                    }
                    //跳过 (
                    pos++;
                    //查找 params
                    params = "";
                    flag = true;
                    while (true) {
                        //跳过空格
                        pos = flower.StringDo.jumpProgramSpace(content, pos);
                        //查找 param 名
                        name = flower.StringDo.findId(content, pos);
                        if (name == "") {
                            if (content.charAt(pos) == ")") {
                                i = pos + 1;
                                break;
                            } else {
                                flag = false;
                                break;
                            }
                        } else {
                            params += name;
                        }
                        //跳过空格
                        pos = flower.StringDo.jumpProgramSpace(content, pos);
                        char = content.charAt(pos);
                        if (char == ",") {
                            params += ",";
                        }
                        pos++;
                    }
                    if (!flag) {
                        sys.$error(3007, this.scriptURL, this.scriptContent);
                    }
                    res = {
                        name: funcName,
                        gset: gset,
                        params: params
                    };
                }
                if (!res) {
                    sys.$error(3007, this.scriptURL, this.scriptContent);
                }

                //分析函数体
                //跳过空格
                var content = flower.StringDo.findFunctionContent(content, i);
                if (content == "") {
                    sys.$error(3007, this.scriptURL, this.scriptContent);
                }
                res.content = content;
                res.endIndex = i + content.length + 1;
                return res;
            }
        }, {
            key: "decodeObject",
            value: function decodeObject(before, className, funcName, createClass, xml, hasLocalNS, propertyFunc, nameIndex) {
                var setObject = before + className + ".prototype." + funcName + " = function(parentObject) {\n";
                var thisObj = "parentObject";
                var createClassName;
                if (createClass) {
                    var createClassNameSpace = xml.name.split(":")[0];
                    createClassName = xml.name.split(":")[1];
                    if (createClassNameSpace == "local" && createClassName == "Object") {
                        thisObj = "object";
                        setObject += before + "\t" + thisObj + " = {};\n";
                    } else {
                        if (createClassNameSpace != "local") {
                            createClassName = this.classes[createClassNameSpace][createClassName];
                        }
                        thisObj = createClassName.split(".")[createClassName.split(".").length - 1];
                        thisObj = thisObj.toLocaleLowerCase();
                        if (createClassNameSpace == "local") {
                            setObject += before + "\tvar " + thisObj + " = new (flower.UIParser.getLocalUIClass(\"" + createClassName + "\"))();\n";
                        } else {
                            setObject += before + "\tvar " + thisObj + " = new " + createClassName + "();\n";
                        }
                        setObject += before + "\tif(" + thisObj + ".__UIComponent) " + thisObj + ".eventThis = this;\n";
                    }
                }
                var idAtr = xml.getAttribute("id");
                if (idAtr) {
                    setObject += before + "\tthis." + idAtr.value + " = " + thisObj + ";\n";
                    setObject += before + "\tthis." + idAtr.value + ".name = \"" + idAtr.value + "\";\n";
                }
                for (var i = 0; i < xml.attributes.length; i++) {
                    var atrName = xml.attributes[i].name;
                    var atrValue = xml.attributes[i].value;
                    var atrArray = atrName.split(".");
                    if (atrName == "class") {} else if (atrName == "id") {} else if (atrArray.length == 2) {
                        var atrState = atrArray[1];
                        atrName = atrArray[0];
                        setObject += before + "\t" + thisObj + ".setStatePropertyValue(\"" + atrName + "\", \"" + atrState + "\", \"" + atrValue + "\", [this]);\n";
                    } else if (atrArray.length == 1) {
                        if (atrValue.indexOf("{") >= 0 && atrValue.indexOf("}") >= 0) {
                            setObject += before + "\tif(" + thisObj + ".__UIComponent) ";
                            setObject += "this." + className + "_binds.push([" + thisObj + ",\"" + atrName + "\", \"" + atrValue + "\"]);\n";
                            setObject += before + "\telse " + thisObj + "." + atrName + " = " + (this.isNumberOrBoolean(atrValue) ? atrValue : "\"" + atrValue + "\"") + ";\n";
                            //setObject += before + "\t" + thisObj + ".bindProperty(\"" + atrName + "\", \"" + atrValue + "\", [this]);\n";
                        } else {
                                setObject += before + "\t" + thisObj + "." + atrName + " = " + (this.isNumberOrBoolean(atrValue) ? atrValue : "\"" + atrValue + "\"") + ";\n";
                            }
                    }
                }
                if (xml.list.length) {
                    var itemClassName;
                    for (i = 0; i < xml.list.length; i++) {
                        var item = xml.list[i];
                        var childName = item.name;
                        var childNameNS = childName.split(":")[0];
                        childName = childName.split(":")[1];
                        var childClass = null;
                        if (childNameNS == "f" && childName == "script") {
                            continue;
                        } else if (item.value != null && item.value != "") {
                            //属性
                            setObject += before + "\t" + thisObj + "." + childName + " = \"" + flower.StringDo.changeStringToInner(item.value) + "\";\n";
                            continue;
                        } else if (childNameNS == "local") {
                            if (!hasLocalNS) {
                                $warn(3004, childNameNS, this.parseContent);
                            }
                            if (this.classes.local[childName]) {
                                childClass = childName;
                            } else {
                                if (this.classes.localContent[childName]) {
                                    this.parse(this.classes.localContent[childName]);
                                    childClass = this.classes.local[childName];
                                } else {
                                    $warn(3005, childName, this.parseContent);
                                }
                            }
                        } else {
                            if (this.classes[childNameNS]) {
                                childClass = this.classes[childNameNS][childName];
                            } else {
                                $warn(3004, childNameNS, this.parseContent);
                            }
                        }
                        if (childClass == null) {
                            item = item.list[0];
                        }
                        itemClassName = item.name.split(":")[1];
                        if (!nameIndex[itemClassName]) {
                            nameIndex[itemClassName] = 1;
                        } else {
                            nameIndex[itemClassName]++;
                            itemClassName += nameIndex[itemClassName];
                        }
                        if (childClass == null) {
                            if (childName == "itemRenderer") {
                                for (var n = 0; n < this.rootXML.namesapces.length; n++) {
                                    item.addNameSpace(this.rootXML.namesapces[n]);
                                }
                                setObject += before + "\t" + thisObj + "." + childName + " = flower.UIParser.getLocalUIClass(\"" + new UIParser().parse(item) + "\");\n";
                            } else {
                                funcName = className + "_get" + itemClassName;
                                setObject += before + "\t" + thisObj + "." + childName + " = this." + funcName + "(" + thisObj + ");\n";
                                this.decodeObject(before, className, funcName, true, item, hasLocalNS, propertyFunc, nameIndex);
                            }
                        } else {
                            funcName = className + "_get" + itemClassName;
                            setObject += before + "\t" + thisObj + "." + (UIParser.classes.addChild[createClassName] ? UIParser.classes.addChild[createClassName] : "addChild") + "(this." + funcName + "(" + thisObj + "));\n";
                            this.decodeObject(before, className, funcName, true, item, hasLocalNS, propertyFunc, nameIndex);
                        }
                    }
                }
                if (createClass) {
                    setObject += before + "\treturn " + thisObj + ";\n";
                }
                setObject += before + "}\n\n";
                propertyFunc.push(setObject);
            }
        }, {
            key: "isNumberOrBoolean",
            value: function isNumberOrBoolean(str) {
                if (str == "true" || str == "false") {
                    return true;
                }
                if (str.length > 3 && (str.slice(0, 2) == "0x" || str.slice(0, 2) == "0X")) {
                    for (var i = 2; i < str.length; i++) {
                        var code = str.charCodeAt(i);
                        if (code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102) {} else {
                            return false;
                        }
                    }
                } else {
                    for (var i = 0; i < str.length; i++) {
                        var code = str.charCodeAt(i);
                        if (code >= 48 && code <= 57) {} else {
                            return false;
                        }
                    }
                }
                return true;
            }
        }, {
            key: "className",
            get: function get() {
                return this._className;
            }
        }], [{
            key: "registerLocalUIClass",
            value: function registerLocalUIClass(name, cls) {
                flower.UIParser.classes.local[name] = cls;
            }
        }, {
            key: "setLocalUIClassContent",
            value: function setLocalUIClassContent(name, content) {
                flower.UIParser.classes.localContent[name] = content;
            }
        }, {
            key: "getLocalUIClassContent",
            value: function getLocalUIClassContent(name) {
                return flower.UIParser.classes.localContent[name];
            }
        }, {
            key: "getLocalUIClass",
            value: function getLocalUIClass(name) {
                return this.classes.local[name];
            }
        }, {
            key: "setLocalUIURL",
            value: function setLocalUIURL(name, url) {
                this.classes.localURL[name] = url;
            }
        }]);

        return UIParser;
    }(Group);

    UIParser.classes = {
        f: {
            "Object": "Object",
            "Array": "Array",

            "Point": "flower.Point",
            "Size": "flower.Size",
            "Rectangle": "flower.Rectangle",

            "ColorFilter": "flower.ColorFilter",
            "TextField": "flower.TextField",
            "TextInput": "flower.TextInput",
            "Bitmap": "flower.Bitmap",
            "Shape": "flower.Shape",
            "Mask": "flower.Mask",

            "ArrayValue": "ArrayValue",
            "BooleanValue": "flower.BooleanValue",
            "IntValue": "flower.IntValue",
            "NumberValue": "flower.NumberValue",
            "ObjectValue": "flower.ObjectValue",
            "StringValue": "flower.StringValue",
            "UIntValue": "flower.UIntValue",

            "Label": "flower.Label",
            "Image": "flower.Image",
            "Group": "flower.Group",
            "Button": "flower.Button",
            "RectUI": "flower.RectUI",
            "MaskUI": "flower.MaskUI",
            "Scroller": "flower.Scroller",
            "DataGroup": "flower.DataGroup",
            "ItemRenderer": "flower.ItemRenderer",
            "ToggleButton": "flower.ToggleButton",
            "ToggleSwitch": "flower.ToggleSwitch",
            "CheckBox": "flower.CheckBox",
            "RadioButton": "flower.RadioButton",
            "RadioButtonGroup": "flower.RadioButtonGroup",
            "ListBase": "flower.ListBase",
            "List": "flower.List",
            "TabBar": "flower.TabBar",
            "ViewStack": "flower.ViewStack",
            "LinearLayoutBase": "flower.LinearLayoutBase",
            "HorizontalLayout": "flower.HorizontalLayout",
            "VerticalLayout": "flower.VerticalLayout"
        },
        local: {},
        localContent: {},
        localURL: {},
        addChild: {
            "Array": "push",
            "ArrayValue": "push"
        }
    };


    black.UIParser = UIParser;
    //////////////////////////End File:extension/black/UIParser.js///////////////////////////

    //////////////////////////File:extension/black/DataGroup.js///////////////////////////

    var DataGroup = function (_Group2) {
        _inherits(DataGroup, _Group2);

        function DataGroup() {
            _classCallCheck(this, DataGroup);

            var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(DataGroup).call(this));

            _this14._itemSelectedEnabled = false;
            _this14._itemClickedEnabled = false;
            _this14._requireSelection = false;

            _this14._itemSelectedEnabled = true;
            _this14._itemClickedEnabled = true;
            _this14.addListener(flower.TouchEvent.TOUCH_RELEASE, _this14._onTouchItem, _this14);
            return _this14;
        }

        _createClass(DataGroup, [{
            key: "onDataUpdate",
            value: function onDataUpdate() {
                this.$addFlags(0x4000);
            }
        }, {
            key: "$resetLayout",
            value: function $resetLayout() {
                if (this.$hasFlags(0x2000)) {
                    this.$removeFlags(0x2000);
                    if (this.layout && (!this._viewer || !this.layout.fixElementSize)) {
                        this.layout.updateList(this.width, this.height);
                    }
                }
            }
        }, {
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001) {
                    if ((this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                        this.__flags |= 0x1000;
                    }
                    if (this.layout) {
                        this.__flags |= 0x2000;
                    }
                }
                if ((flags & 0x0004) == 0x0004) {
                    this.__flags |= 0x4000;
                }
                this.__flags |= flags;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this._viewer) {
                    if (this._viewWidth != this._viewer.width || this._viewHeight != this._viewer.height) {
                        this._viewWidth = this._viewer.width;
                        this._viewHeight = this._viewer.height;
                        this.$addFlags(0x4000);
                    }
                }
                if (this._data && this._data.length && this._itemRenderer && this.$hasFlags(0x4000)) {
                    if (!this._items) {
                        this._items = [];
                    }
                    var list = this._data;
                    var newItems = [];
                    var item;
                    var itemData;
                    var measureSize = false;
                    var findSelected = false;
                    if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                        for (var i = 0, len = list.length; i < len; i++) {
                            item = null;
                            itemData = list.getItemAt(i);
                            for (var f = 0; f < this._items.length; f++) {
                                if (this._items[f].data == itemData) {
                                    item = this._items[f];
                                    this._items.splice(f, 1);
                                    break;
                                }
                            }
                            if (item == null) {
                                item = this.createItem(itemData, i);
                                item.data = itemData;
                            }
                            if (item.parent == this) {
                                this.setChildIndex(item, i);
                            } else {
                                this.addChild(item);
                            }
                            item.$setItemIndex(i);
                            newItems[i] = item;
                            if (item.data == this._selectedItem) {
                                findSelected = true;
                            }
                        }
                    } else {
                        this.layout.$clear();
                        var elementWidth;
                        var elementHeight;
                        if (!this._items.length) {
                            item = this.createItem(list.getItemAt(0), 0);
                            item.data = list.getItemAt(0);
                            this._items.push(item);
                        }
                        elementWidth = this._items[0].width;
                        elementHeight = this._items[0].height;
                        var firstItemIndex = this.layout.getFirstItemIndex(elementWidth, elementHeight, -this.x, -this.y);
                        firstItemIndex = firstItemIndex < 0 ? 0 : firstItemIndex;
                        for (var i = firstItemIndex; i < list.length; i++) {
                            item = null;
                            itemData = list.getItemAt(i);
                            for (var f = 0; f < this._items.length; f++) {
                                if (this._items[f].data == itemData) {
                                    item = this._items[f];
                                    this._items.splice(f, 1);
                                    break;
                                }
                            }
                            if (!item) {
                                item = this.createItem(itemData, i);
                                item.data = itemData;
                            }
                            if (item.parent == this) {
                                this.setChildIndex(item, i - firstItemIndex);
                            } else {
                                this.addChild(item);
                            }
                            item.$setItemIndex(i);
                            newItems[i - firstItemIndex] = item;
                            if (item.data == this._selectedItem) {
                                findSelected = true;
                            }
                            this.layout.updateList(this._viewWidth, this._viewHeight, firstItemIndex);
                            if (this.layout.isElementsOutSize(-this.x, -this.y, this._viewWidth, this._viewHeight)) {
                                break;
                            }
                        }
                    }
                    if (findSelected == false && this._selectedItem) {
                        this._selectedItem = null;
                    }
                    measureSize = true;
                    while (this._items.length) {
                        this._items.pop().dispose();
                    }
                    this._items = newItems;
                    this.$removeFlags(0x4000);
                    if (!this._selectedItem) {
                        this._canSelecteItem();
                    }
                }
                _get(Object.getPrototypeOf(DataGroup.prototype), "$onFrameEnd", this).call(this);
                if (measureSize) {
                    if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                        var size = this.layout.getContentSize();
                        this._contentWidth = size.width;
                        this._contentHeight = size.height;
                        flower.Size.release(size);
                    } else if (this._items.length) {
                        var size = this.layout.measureSize(this._items[0].width, this._items[0].height, list.length);
                        this._contentWidth = size.width;
                        this._contentHeight = size.height;
                        flower.Size.release(size);
                    }
                }
            }
        }, {
            key: "createItem",
            value: function createItem(data, index) {
                var item = new this._itemRenderer(data);
                item.index = index;
                item.$setList(this._data);
                item.addListener(flower.TouchEvent.TOUCH_BEGIN, this._onTouchItem, this);
                item.addListener(flower.TouchEvent.TOUCH_END, this._onTouchItem, this);
                item.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouchItem, this);
                if (item.data == this._downItem) {
                    if (item.data == this._selectedItem && this._itemSelectedEnabled) {
                        item.currentState = "selectedDown";
                        item.selected = true;
                    } else {
                        item.currentState = "down";
                    }
                } else {
                    if (item.data == this._selectedItem && this._itemSelectedEnabled) {
                        item.currentState = "selectedUp";
                        item.selected = true;
                    } else {
                        item.currentState = "up";
                    }
                }
                return item;
            }
        }, {
            key: "_onTouchItem",
            value: function _onTouchItem(e) {
                var item = e.currentTarget;
                switch (e.type) {
                    case flower.TouchEvent.TOUCH_BEGIN:
                        if (this._itemSelectedEnabled) {
                            if (item.data == this._selectedItem) {
                                item.currentState = "selectedDown";
                            } else {
                                item.currentState = "down";
                            }
                        }
                        this._downItem = item.data;
                        break;
                    case flower.TouchEvent.TOUCH_RELEASE:
                        this.$releaseItem();
                        break;
                    case flower.TouchEvent.TOUCH_END:
                        if (this._downItem == item.data) {
                            this._downItem = null;
                            this._setSelectedItem(item);
                            if (this._itemClickedEnabled) {
                                item.$onClick();
                                //var data = item.data;
                                //var find = false;
                                //for (var i = 0, len = this._data.length; i < len; i++) {
                                //    if (this._data.getItemAt(i) == data) {
                                //        find = true;
                                //    }
                                //}
                                //if (find && this.onClickItemEXE) {
                                //    this.onClickItemEXE.call(this, item.data);
                                //}
                            }
                        }
                        break;
                }
            }
        }, {
            key: "_setSelectedIndex",
            value: function _setSelectedIndex(val) {}
        }, {
            key: "_canSelecteItem",
            value: function _canSelecteItem() {
                if (this._requireSelection && this._itemSelectedEnabled && !this._selectedItem && this._data.length) {
                    this._selectedItem = this._data.getItemAt(0);
                    var item = this.getItemByData(this._selectedItem);
                    if (item) {
                        item.currentState = "selectedUp";
                        item.selected = true;
                    }
                }
            }
        }, {
            key: "_setSelectedItem",
            value: function _setSelectedItem(item) {
                if (item == null || item.data != this._selectedItem) {
                    if (this._selectedItem) {
                        var itemRenderer = this.getItemByData(this._selectedItem);
                        if (itemRenderer) {
                            itemRenderer.currentState = "up";
                            itemRenderer.selected = false;
                        }
                    }
                }
                if (item && this._itemSelectedEnabled) {
                    item.currentState = "selectedUp";
                    item.selected = true;
                    this._selectedItem = item.data;
                } else {
                    if (item) {
                        item.currentState = "up";
                    }
                    this._selectedItem = null;
                }
            }
        }, {
            key: "$releaseItem",
            value: function $releaseItem() {
                var clickItem = this.getItemByData(this._downItem);
                if (clickItem) {
                    if (this._downItem == this._selectedItem && this._itemSelectedEnabled) {
                        clickItem.currentState = "selectedUp";
                    } else {
                        clickItem.currentState = "up";
                    }
                }
                this._downItem = null;
            }
        }, {
            key: "onScroll",
            value: function onScroll() {
                this.$addFlag(0x400);
            }
        }, {
            key: "getItemByData",
            value: function getItemByData(data) {
                for (var i = 0, len = this._items.length; i < len; i++) {
                    if (this._items[i].data == data) {
                        return this._items[i];
                    }
                }
                return null;
            }

            //////////////////////////////////get&set//////////////////////////////////

        }, {
            key: "dataProvider",
            get: function get() {
                return this._data;
            },
            set: function set(val) {
                if (this._data == val) {
                    return;
                }
                this.removeAll();
                this._items = null;
                this._data = val;
                this.$addFlags(0x4000);
                if (this._data) {
                    this._data.addListener(flower.Event.UPDATE, this.onDataUpdate, this);
                }
            }
        }, {
            key: "itemRenderer",
            get: function get() {
                return this._itemRenderer;
            },
            set: function set(val) {
                if (this._itemRenderer == val) {
                    return;
                }
                this.removeAll();
                this._items = null;
                this._itemRenderer = val;
                this.$addFlags(0x4000);
            }
        }, {
            key: "numElements",
            get: function get() {
                return this._items.length;
            }
        }, {
            key: "viewer",
            set: function set(display) {
                this._viewer = display;
            }
        }, {
            key: "contentWidth",
            get: function get() {
                return this._contentWidth;
            }
        }, {
            key: "contentHeight",
            get: function get() {
                return this._contentHeight;
            }
        }, {
            key: "scrollEnabled",
            get: function get() {
                return true;
            }
        }, {
            key: "selectedIndex",
            get: function get() {
                return this._selectedItem ? this._selectedItem.itemIndex : -1;
            },
            set: function set(val) {
                val = +val || 0;
                if (this._selectedItem && this._selectedItem.itemIndex == val) {
                    return;
                }
                this._setSelectedIndex(val);
            }
        }, {
            key: "selectedItem",
            get: function get() {
                return this._selectedItem;
            }
        }, {
            key: "itemSelectedEnabled",
            get: function get() {
                return this._itemSelectedEnabled;
            },
            set: function set(val) {
                this._itemSelectedEnabled = !!val;
            }
        }, {
            key: "itemClickedEnabled",
            get: function get() {
                return this._itemClickedEnabled;
            },
            set: function set(val) {
                val = !!val;
                if (this._itemClickedEnabled == val) {
                    return;
                }
                this._itemClickedEnabled = val;
            }
        }, {
            key: "requireSelection",
            get: function get() {
                return this._requireSelection;
            },
            set: function set(val) {
                val = !!val;
                if (val == this._requireSelection) {
                    return;
                }
                this._requireSelection = val;
            }

            //onClickItemEXE:Function;
            //
            //set onClickItem(val) {
            //    if (typeof val == "string") {
            //        var content:string = <any>val;
            //        val = function (item) {
            //            eval(content);
            //        }.bind(this.eventThis);
            //    }
            //    this.onClickItemEXE = val;
            //}
            //
            //get onClickItem() {
            //    return this.onClickItemEXE;
            //}

        }]);

        return DataGroup;
    }(Group);

    black.DataGroup = DataGroup;
    //////////////////////////End File:extension/black/DataGroup.js///////////////////////////

    //////////////////////////File:extension/black/ItemRenderer.js///////////////////////////

    var ItemRenderer = function (_Group3) {
        _inherits(ItemRenderer, _Group3);

        function ItemRenderer() {
            _classCallCheck(this, ItemRenderer);

            var _this15 = _possibleConstructorReturn(this, Object.getPrototypeOf(ItemRenderer).call(this));

            _this15._selected = false;

            _this15.absoluteState = true;
            return _this15;
        }

        _createClass(ItemRenderer, [{
            key: "setData",
            value: function setData(val) {}
        }, {
            key: "$setItemIndex",
            value: function $setItemIndex(val) {
                this._itemIndex = val;
            }
        }, {
            key: "setSelected",
            value: function setSelected(val) {
                this._selected = val;
                if (this._selected) {
                    if (this.onSelectedEXE) {
                        this.onSelectedEXE.call(this);
                    }
                }
            }
        }, {
            key: "$onClick",
            value: function $onClick() {
                if (this.onClickEXE) {
                    this.onClickEXE.call(this);
                }
            }
        }, {
            key: "$setList",
            value: function $setList(val) {
                this._list = val;
            }
        }, {
            key: "data",
            get: function get() {
                return this._data;
            },
            set: function set(val) {
                this._data = val;
                this.setData(this._data);
            }
        }, {
            key: "itemIndex",
            get: function get() {
                return this._itemIndex;
            }
        }, {
            key: "selected",
            get: function get() {
                return this._selected;
            },
            set: function set(val) {
                val = !!val;
                if (this._selected == val) {
                    return;
                }
                this.setSelected(val);
            }
        }, {
            key: "onClick",
            set: function set(val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onClickEXE = val;
            },
            get: function get() {
                return this.onClickEXE;
            }
        }, {
            key: "onSelected",
            set: function set(val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onSelectedEXE = val;
            },
            get: function get() {
                return this.onClickEXE;
            }
        }, {
            key: "list",
            get: function get() {
                return this._list;
            }
        }]);

        return ItemRenderer;
    }(Group);

    black.ItemRenderer = ItemRenderer;
    //////////////////////////End File:extension/black/ItemRenderer.js///////////////////////////

    //////////////////////////File:extension/black/Label.js///////////////////////////

    var Label = function (_flower$TextField) {
        _inherits(Label, _flower$TextField);

        function Label() {
            var text = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            _classCallCheck(this, Label);

            var _this16 = _possibleConstructorReturn(this, Object.getPrototypeOf(Label).call(this, text));

            _this16.$initUIComponent();
            return _this16;
        }

        _createClass(Label, [{
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                }
                this.__flags |= flags;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                    this.$validateUIComponent();
                }
                _get(Object.getPrototypeOf(Label.prototype), "$onFrameEnd", this).call(this);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.removeAllBindProperty();
                _get(Object.getPrototypeOf(Label.prototype), "dispose", this).call(this);
            }
        }]);

        return Label;
    }(flower.TextField);

    UIComponent.register(Label);
    Label.prototype.__UIComponent = true;
    black.Label = Label;
    //////////////////////////End File:extension/black/Label.js///////////////////////////

    //////////////////////////File:extension/black/RectUI.js///////////////////////////

    var RectUI = function (_flower$Shape) {
        _inherits(RectUI, _flower$Shape);

        function RectUI() {
            _classCallCheck(this, RectUI);

            var _this17 = _possibleConstructorReturn(this, Object.getPrototypeOf(RectUI).call(this));

            _this17.$RectUI = {
                0: 0, //width
                1: 0 };
            //height
            _this17.drawRect = null;
            _this17.$initUIComponent();
            return _this17;
        }

        _createClass(RectUI, [{
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                }
                this.__flags |= flags;
            }
        }, {
            key: "$setFillColor",
            value: function $setFillColor(val) {
                if (_get(Object.getPrototypeOf(RectUI.prototype), "$setFillColor", this).call(this, val)) {
                    this.$resetRectUI();
                }
            }
        }, {
            key: "$setFillAlpha",
            value: function $setFillAlpha(val) {
                if (_get(Object.getPrototypeOf(RectUI.prototype), "$setFillAlpha", this).call(this, val)) {
                    this.$resetRectUI();
                }
            }
        }, {
            key: "$setLineWidth",
            value: function $setLineWidth(val) {
                if (_get(Object.getPrototypeOf(RectUI.prototype), "$setLineWidth", this).call(this, val)) {
                    this.$resetRectUI();
                }
            }
        }, {
            key: "$setLineColor",
            value: function $setLineColor(val) {
                if (_get(Object.getPrototypeOf(RectUI.prototype), "$setLineColor", this).call(this, val)) {
                    this.$resetRectUI();
                }
            }
        }, {
            key: "$setLineAlpha",
            value: function $setLineAlpha(val) {
                if (_get(Object.getPrototypeOf(RectUI.prototype), "$setLineAlpha", this).call(this, val)) {
                    this.$resetRectUI();
                }
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                val = +val || 0;
                var p = this.$RectUI;
                if (p[0] == val) {
                    return;
                }
                p[0] = val;
                this.$resetRectUI();
            }
        }, {
            key: "$resetRectUI",
            value: function $resetRectUI() {
                var p = this.$Shape;
                if (p[9].length == 0) {
                    p[9].push({});
                }
                var width = this.$RectUI[0];
                var height = this.$RectUI[1];
                var x = 0;
                var y = 0;
                p[9][0] = {
                    points: [{ x: x, y: y }, { x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }],
                    fillColor: p[0],
                    fillAlpha: p[1],
                    lineWidth: p[2],
                    lineColor: p[3],
                    lineAlpha: p[4]
                };
                this.$addFlags(0x0400);
            }
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
                val = +val || 0;
                var p = this.$RectUI;
                if (p[1] == val) {
                    return;
                }
                p[1] = val;
                this.$resetRectUI();
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                    this.$validateUIComponent();
                }
                _get(Object.getPrototypeOf(RectUI.prototype), "$onFrameEnd", this).call(this);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.removeAllBindProperty();
                _get(Object.getPrototypeOf(RectUI.prototype), "dispose", this).call(this);
            }
        }]);

        return RectUI;
    }(flower.Shape);

    UIComponent.register(RectUI);
    RectUI.prototype.__UIComponent = true;
    black.RectUI = RectUI;
    //////////////////////////End File:extension/black/RectUI.js///////////////////////////

    //////////////////////////File:extension/black/Image.js///////////////////////////

    var Image = function (_flower$Bitmap) {
        _inherits(Image, _flower$Bitmap);

        function Image() {
            var source = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _classCallCheck(this, Image);

            var _this18 = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this));

            _this18.$initUIComponent();
            _this18.source = source;
            return _this18;
        }

        _createClass(Image, [{
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                }
                this.__flags |= flags;
            }
        }, {
            key: "$setSource",
            value: function $setSource(val) {
                if (this.__source == val) {
                    return;
                }
                this.__source = val;
                if (val == null) {
                    this.texture = null;
                } else if (val instanceof flower.Texture) {
                    this.texture = val;
                } else {
                    if (this.__loader) {
                        this.__loader.dispose();
                    }
                    this.__loader = new flower.URLLoader(val);
                    this.__loader.load();
                    this.__loader.addListener(flower.Event.COMPLETE, this.__onLoadComplete, this);
                    this.__loader.addListener(flower.IOErrorEvent.ERROR, this.__onLoadError, this);
                }
            }
        }, {
            key: "__onLoadError",
            value: function __onLoadError(e) {
                this.__loader = null;
            }
        }, {
            key: "__onLoadComplete",
            value: function __onLoadComplete(e) {
                this.__loader = null;
                this.texture = e.data;
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                    this.$validateUIComponent();
                }
                _get(Object.getPrototypeOf(Image.prototype), "$onFrameEnd", this).call(this);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.__loader) {
                    this.__loader.dispose();
                }
                this.removeAllBindProperty();
                _get(Object.getPrototypeOf(Image.prototype), "dispose", this).call(this);
            }
        }, {
            key: "source",
            get: function get() {
                return this.__source;
            },
            set: function set(val) {
                this.$setSource(val);
            }
        }]);

        return Image;
    }(flower.Bitmap);

    UIComponent.register(Image);
    Image.prototype.__UIComponent = true;
    black.Image = Image;
    //////////////////////////End File:extension/black/Image.js///////////////////////////

    //////////////////////////File:extension/black/TileImage.js///////////////////////////

    var TileImage = function (_Group4) {
        _inherits(TileImage, _Group4);

        function TileImage() {
            _classCallCheck(this, TileImage);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(TileImage).call(this));
        }

        _createClass(TileImage, [{
            key: "$setSource",
            value: function $setSource() {}
        }]);

        return TileImage;
    }(Group);

    black.TileImage = Group;
    //////////////////////////End File:extension/black/TileImage.js///////////////////////////

    //////////////////////////File:extension/black/MaskUI.js///////////////////////////

    var MaskUI = function (_flower$Mask) {
        _inherits(MaskUI, _flower$Mask);

        function MaskUI() {
            _classCallCheck(this, MaskUI);

            var _this20 = _possibleConstructorReturn(this, Object.getPrototypeOf(MaskUI).call(this));

            _this20.$initUIComponent();
            return _this20;
        }

        _createClass(MaskUI, [{
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                    if (this.layout) {
                        this.__flags |= 0x2000;
                    }
                }
                this.__flags |= flags;
            }
        }, {
            key: "$validateChildrenUIComponent",
            value: function $validateChildrenUIComponent() {
                if (this.shape.__UIComponent) {
                    this.shape.$validateUIComponent(this);
                }
                var children = this.__children;
                if (children) {
                    var child;
                    for (var i = 0, len = children.length; i < len; i++) {
                        child = children[i];
                        if (child.__UIComponent) {
                            child.$validateUIComponent();
                        }
                    }
                }
            }
        }, {
            key: "$resetLayout",
            value: function $resetLayout() {
                if (this.$hasFlags(0x2000)) {
                    this.$removeFlags(0x2000);
                    if (this.layout) {
                        this.layout.updateList(this.width, this.height);
                    }
                }
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                    this.$validateUIComponent();
                }
                _get(Object.getPrototypeOf(MaskUI.prototype), "$onFrameEnd", this).call(this);
                this.shape.$onFrameEnd();
                this.$resetLayout();
            }
        }]);

        return MaskUI;
    }(flower.Mask);

    UIComponent.register(MaskUI, true);
    MaskUI.prototype.__UIComponent = true;
    black.MaskUI = MaskUI;
    //////////////////////////End File:extension/black/MaskUI.js///////////////////////////

    //////////////////////////File:extension/black/Button.js///////////////////////////

    var Button = function (_Group5) {
        _inherits(Button, _Group5);

        function Button() {
            _classCallCheck(this, Button);

            var _this21 = _possibleConstructorReturn(this, Object.getPrototypeOf(Button).call(this));

            _this21._enabled = true;

            _this21.absoluteState = true;
            _this21.currentState = "up";
            _this21.addListener(flower.TouchEvent.TOUCH_BEGIN, _this21.__onTouch, _this21);
            _this21.addListener(flower.TouchEvent.TOUCH_END, _this21.__onTouch, _this21);
            _this21.addListener(flower.TouchEvent.TOUCH_RELEASE, _this21.__onTouch, _this21);
            return _this21;
        }

        _createClass(Button, [{
            key: "$getMouseTarget",
            value: function $getMouseTarget(touchX, touchY, multiply) {
                var target = _get(Object.getPrototypeOf(Button.prototype), "$getMouseTarget", this).call(this, touchX, touchY, multiply);
                if (target) {
                    target = this;
                }
                return target;
            }
        }, {
            key: "__onTouch",
            value: function __onTouch(e) {
                if (!this.enabled) {
                    e.stopPropagation();
                    return;
                }
                switch (e.type) {
                    case flower.TouchEvent.TOUCH_BEGIN:
                        this.currentState = "down";
                        break;
                    case flower.TouchEvent.TOUCH_END:
                    case flower.TouchEvent.TOUCH_RELEASE:
                        this.currentState = "up";
                        break;
                }
            }
        }, {
            key: "__setEnabled",
            value: function __setEnabled(val) {
                val = !!val;
                if (this._enabled == val) {
                    return false;
                }
                this._enabled = val;
                if (this._enabled) {
                    this.currentState = "up";
                } else {
                    this.currentState = "disabled";
                }
                return true;
            }
        }, {
            key: "addUIComponentEvents",
            value: function addUIComponentEvents() {
                _get(Object.getPrototypeOf(Button.prototype), "addUIComponentEvents", this).call(this);
                this.addListener(flower.TouchEvent.TOUCH_END, this.onEXEClick, this);
            }
        }, {
            key: "onEXEClick",
            value: function onEXEClick(e) {
                if (this.onClickEXE && e.target == this) {
                    this.onClickEXE.call(this);
                }
            }
        }, {
            key: "enabled",
            set: function set(val) {
                this.__setEnabled(val);
            },
            get: function get() {
                return this._enabled;
            }
        }, {
            key: "onClick",
            set: function set(val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onClickEXE = val;
            },
            get: function get() {
                return this.onClickEXE;
            }
        }]);

        return Button;
    }(Group);

    black.Button = Button;
    //////////////////////////End File:extension/black/Button.js///////////////////////////

    //////////////////////////File:extension/black/ToggleButton.js///////////////////////////

    var ToggleButton = function (_Button) {
        _inherits(ToggleButton, _Button);

        function ToggleButton() {
            _classCallCheck(this, ToggleButton);

            var _this22 = _possibleConstructorReturn(this, Object.getPrototypeOf(ToggleButton).call(this));

            _this22.__selected = false;
            return _this22;
        }

        _createClass(ToggleButton, [{
            key: "__onTouch",
            value: function __onTouch(e) {
                if (!this.enabled) {
                    e.stopPropagation();
                    return;
                }
                switch (e.type) {
                    case flower.TouchEvent.TOUCH_BEGIN:
                        if (this.__selected) {
                            this.currentState = "selectedDown";
                        } else {
                            this.currentState = "down";
                        }
                        break;
                    case flower.TouchEvent.TOUCH_END:
                    case flower.TouchEvent.TOUCH_RELEASE:
                        if (e.type == flower.TouchEvent.TOUCH_END) {
                            this.selected = !this.selected;
                        }
                        if (this.__selected) {
                            this.currentState = "selectedUp";
                        } else {
                            this.currentState = "up";
                        }
                        break;
                }
            }
        }, {
            key: "__setEnabled",
            value: function __setEnabled(val) {
                _get(Object.getPrototypeOf(ToggleButton.prototype), "_setEnabled", this).call(this, val);
                if (val == false && this.__selected) {
                    this.selected = false;
                }
            }
        }, {
            key: "__setSelected",
            value: function __setSelected(val) {
                val = !!val;
                if (!this.enabled || val == this.__selected) {
                    return;
                }
                this.__selected = val;
                if (val) {
                    this.currentState = "selectedUp";
                } else {
                    this.currentState = "up";
                }
                if (this.onChangeEXE) {
                    this.onChangeEXE.call(this);
                }
            }
        }, {
            key: "selected",
            get: function get() {
                return this.__selected;
            },
            set: function set(val) {
                this.__setSelected(val);
            }
        }, {
            key: "onChange",
            set: function set(val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onChangeEXE = val;
            },
            get: function get() {
                return this.onChangeEXE;
            }
        }]);

        return ToggleButton;
    }(Button);

    black.ToggleButton = ToggleButton;
    //////////////////////////End File:extension/black/ToggleButton.js///////////////////////////

    //////////////////////////File:extension/black/CheckBox.js///////////////////////////

    var CheckBox = function (_ToggleButton) {
        _inherits(CheckBox, _ToggleButton);

        function CheckBox() {
            _classCallCheck(this, CheckBox);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(CheckBox).call(this));
        }

        return CheckBox;
    }(ToggleButton);

    black.CheckBox = CheckBox;
    //////////////////////////End File:extension/black/CheckBox.js///////////////////////////

    //////////////////////////File:extension/black/RadioButton.js///////////////////////////

    var RadioButton = function (_ToggleButton2) {
        _inherits(RadioButton, _ToggleButton2);

        function RadioButton() {
            _classCallCheck(this, RadioButton);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(RadioButton).call(this));
        }

        _createClass(RadioButton, [{
            key: "__setSelected",
            value: function __setSelected(val) {
                if (val == false && this._group && this._group.selection == this) {
                    return;
                }
                _get(Object.getPrototypeOf(RadioButton.prototype), "__setSelected", this).call(this, val);
                if (this._group) {
                    this._group.$itemSelectedChange(this);
                }
            }
        }, {
            key: "__setGroupName",
            value: function __setGroupName(val) {
                if (val == this._groupName) {
                    return;
                }
                if (this._group) {
                    this._group.$removeButton(this);
                    this._group = null;
                }
                this._groupName = val;
                this._group = RadioButtonGroup.$addButton(this);
            }
        }, {
            key: "groupName",
            get: function get() {
                return this._groupName;
            },
            set: function set(val) {
                this.__setGroupName(val);
            }
        }, {
            key: "group",
            get: function get() {
                return this._group;
            }
        }]);

        return RadioButton;
    }(ToggleButton);

    black.RadioButton = RadioButton;
    //////////////////////////End File:extension/black/RadioButton.js///////////////////////////

    //////////////////////////File:extension/black/RadioButtonGroup.js///////////////////////////

    var RadioButtonGroup = function (_Group6) {
        _inherits(RadioButtonGroup, _Group6);

        function RadioButtonGroup(groupName) {
            _classCallCheck(this, RadioButtonGroup);

            var _this25 = _possibleConstructorReturn(this, Object.getPrototypeOf(RadioButtonGroup).call(this));

            _this25._buttons = [];
            _this25._enabled = true;

            if (groupName == null || groupName == "") {
                groupName = "group" + _this25.id;
            }
            _this25._groupName = groupName;
            RadioButtonGroup.groups.push(_this25);
            return _this25;
        }

        _createClass(RadioButtonGroup, [{
            key: "addChildAt",
            value: function addChildAt(child) {
                var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                _get(Object.getPrototypeOf(RadioButtonGroup.prototype), "addChildAt", this).call(this, child);
                if (child instanceof RadioButton && child.group != this) {
                    child.groupName = this._groupName;
                }
            }
        }, {
            key: "$itemSelectedChange",
            value: function $itemSelectedChange(button) {
                if (button.selected) {
                    this.selection = button;
                }
            }
        }, {
            key: "$addButton",
            value: function $addButton(button) {
                for (var i = 0; i < this._buttons.length; i++) {
                    if (this._buttons[i] == button) {
                        return;
                    }
                }
                this._buttons.push(button);
                if (this.enabled == false) {
                    button.enabled = this.enabled;
                }
                if (button.selected) {
                    if (!this._selection) {
                        this.selection = button;
                    } else {
                        button.selected = false;
                    }
                }
            }
        }, {
            key: "$removeButton",
            value: function $removeButton(button) {
                for (var i = 0; i < this._buttons.length; i++) {
                    if (this._buttons[i] == button) {
                        this._buttons.splice(i, 1);
                        if (button == this._selection) {
                            this.selection = null;
                        }
                        return button;
                    }
                }
                return null;
            }
        }, {
            key: "__setSelection",
            value: function __setSelection(val) {
                this._selection = val;
                if (this._selection) {
                    this._selection.selected = true;
                }
                for (var i = 0; i < this._buttons.length; i++) {
                    if (this._buttons[i] != this._selection) {
                        this._buttons[i].selected = false;
                    }
                }
                if (this.onChangeEXE) {
                    this.onChangeEXE.call(this);
                }
            }
        }, {
            key: "selection",
            get: function get() {
                return this._selection;
            },
            set: function set(val) {
                if (!this._enabled || this._selection == val) {
                    return;
                }
                this.__setSelection(val);
            }
        }, {
            key: "groupName",
            get: function get() {
                return this._groupName;
            }
        }, {
            key: "enabled",
            get: function get() {
                return this._enabled;
            },
            set: function set(val) {
                val = !!val;
                if (this._enabled == val) {
                    return;
                }
                this._enabled = val;
                for (var i = 0; i < this._buttons.length; i++) {
                    this._buttons[i].enabled = this._enabled;
                }
            }

            /////////////////////////////////////Event///////////////////////////////////

        }, {
            key: "onChange",
            set: function set(val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onChangeEXE = val;
            },
            get: function get() {
                return this.onChangeEXE;
            }

            /////////////////////////////////////static///////////////////////////////////

        }], [{
            key: "$addButton",
            value: function $addButton(button) {
                if (button.groupName && button.groupName != "") {
                    var group;
                    var groupGroup;
                    var list = RadioButtonGroup.groups;
                    for (var i = 0, len = list.length; i < len; i++) {
                        if (list[i].groupName == button.groupName) {
                            group = list[i];
                            break;
                        }
                    }
                    if (!group) {
                        group = new RadioButtonGroup(button.groupName);
                    }
                    group.$addButton(button);
                    return group;
                }
                return null;
            }
        }]);

        return RadioButtonGroup;
    }(Group);

    RadioButtonGroup.groups = [];


    black.RadioButtonGroup = RadioButtonGroup;
    //////////////////////////End File:extension/black/RadioButtonGroup.js///////////////////////////

    //////////////////////////File:extension/black/ToggleSwitch.js///////////////////////////

    var ToggleSwitch = function (_ToggleButton3) {
        _inherits(ToggleSwitch, _ToggleButton3);

        function ToggleSwitch() {
            _classCallCheck(this, ToggleSwitch);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(ToggleSwitch).call(this));
        }

        return ToggleSwitch;
    }(ToggleButton);

    black.ToggleSwitch = ToggleSwitch;
    //////////////////////////End File:extension/black/ToggleSwitch.js///////////////////////////

    //////////////////////////File:extension/black/ListBase.js///////////////////////////

    var ListBase = function (_DataGroup) {
        _inherits(ListBase, _DataGroup);

        function ListBase() {
            _classCallCheck(this, ListBase);

            var _this27 = _possibleConstructorReturn(this, Object.getPrototypeOf(ListBase).call(this));

            _this27.requireSelection = true;
            _this27.itemClickedEnabled = true;
            _this27.itemSelectedEnabled = true;
            return _this27;
        }

        return ListBase;
    }(DataGroup);

    black.ListBase = ListBase;
    //////////////////////////End File:extension/black/ListBase.js///////////////////////////

    //////////////////////////File:extension/black/List.js///////////////////////////

    var List = function (_ListBase) {
        _inherits(List, _ListBase);

        function List() {
            _classCallCheck(this, List);

            var _this28 = _possibleConstructorReturn(this, Object.getPrototypeOf(List).call(this));

            _this28.layout = new VerticalLayout();
            return _this28;
        }

        return List;
    }(ListBase);

    black.List = List;
    //////////////////////////End File:extension/black/List.js///////////////////////////

    //////////////////////////File:extension/black/TabBar.js///////////////////////////

    var TabBar = function (_ListBase2) {
        _inherits(TabBar, _ListBase2);

        function TabBar() {
            _classCallCheck(this, TabBar);

            var _this29 = _possibleConstructorReturn(this, Object.getPrototypeOf(TabBar).call(this));

            _this29.layout = new HorizontalLayout();
            _this29.layout.fixElementSize = false;
            return _this29;
        }

        _createClass(TabBar, [{
            key: "_setSelectedItem",
            value: function _setSelectedItem(item) {
                _get(Object.getPrototypeOf(TabBar.prototype), "_setSelectedItem", this).call(this, item);
                this.dataProvider.selectedItem = item.data;
            }
        }]);

        return TabBar;
    }(ListBase);

    black.TabBar = TabBar;
    //////////////////////////End File:extension/black/TabBar.js///////////////////////////

    //////////////////////////File:extension/black/ViewStack.js///////////////////////////

    var ViewStack = function (_Group7) {
        _inherits(ViewStack, _Group7);

        function ViewStack() {
            _classCallCheck(this, ViewStack);

            var _this30 = _possibleConstructorReturn(this, Object.getPrototypeOf(ViewStack).call(this));

            _this30._items = [];
            _this30._selectedIndex = -1;
            return _this30;
        }

        _createClass(ViewStack, [{
            key: "addChild",
            value: function addChild(display) {
                var find = false;
                for (var i = 0; i < this._items.length; i++) {
                    if (this._items[i] == display) {
                        this._items.splice(i, 1);
                        find = true;
                        break;
                    }
                }
                this._items.push(display);
                this.dispatchWidth(flower.Event.UPDATE);
                if (this._selectedIndex < 0) {
                    this._setSelectedIndex(0);
                }
                if (!find) {
                    this.dispatchWidth(flower.Event.ADDED, display);
                }
            }
        }, {
            key: "addChildAt",
            value: function addChildAt(display, index) {
                var find = false;
                for (var i = 0; i < this._items.length; i++) {
                    if (this._items[i] == display) {
                        this._items.splice(i, 1);
                        find = true;
                        break;
                    }
                }
                this._items.splice(i, 0, display);
                this.dispatchWidth(flower.Event.UPDATE);
                if (this._selectedIndex < 0) {
                    this._setSelectedIndex(0);
                }
                if (!find) {
                    this.dispatchWidth(flower.Event.ADDED, display);
                }
            }
        }, {
            key: "removeChild",
            value: function removeChild(display) {
                for (var i = 0; i < this._items.length; i++) {
                    if (this._items[i] == display) {
                        this._items.splice(i, 1);
                        if (display == this._selectedItem) {
                            this._setSelectedIndex(0);
                            this.dispatchWidth(flower.Event.UPDATE);
                            this.dispatchWidth(flower.Event.REMOVED, display);
                        }
                        return display;
                    }
                }
                return null;
            }
        }, {
            key: "removeChildAt",
            value: function removeChildAt(index) {
                var display = this._items.splice(index, 1)[0];
                if (display == this._selectedItem) {
                    this._selectedItem = this._items[0];
                    this._selectedIndex = 0;
                    _get(Object.getPrototypeOf(ViewStack.prototype), "removeChild", this).call(this, display);
                    this.dispatchWidth(flower.Event.UPDATE);
                    this.dispatchWidth(flower.Event.REMOVED, display);
                } else {
                    flower.DebugInfo.debug("ViewStack 设置 removeChildAt 超出索引范围:" + index, DebugInfo.ERROR);
                }
                return display;
            }
        }, {
            key: "getChildIndex",
            value: function getChildIndex(display) {
                if (display) {
                    for (var i = 0; i < this._items.length; i++) {
                        if (this._items[i] == display) {
                            return i;
                        }
                    }
                }
                return -1;
            }
        }, {
            key: "setChildIndex",
            value: function setChildIndex(display, index) {
                for (var i = 0; i < this._items.length; i++) {
                    if (this._items[i] == display) {
                        this._items.splice(i, 1);
                        this._items.splice(index, 0, display);
                        this.dispatchWidth(flower.Event.UPDATE);
                        return display;
                    }
                }
                return null;
            }
        }, {
            key: "sortChild",
            value: function sortChild(key) {
                var opt = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                _get(Object.getPrototypeOf(ViewStack.prototype), "sortChild", this).call(this, key, opt);
                this.dispatchWidth(flower.Event.UPDATE);
            }
        }, {
            key: "_setSelectedIndex",
            value: function _setSelectedIndex(val) {
                if (this._selectedItem) {
                    _get(Object.getPrototypeOf(ViewStack.prototype), "removeChild", this).call(this, this._selectedItem);
                }
                this._selectedItem = null;
                this._selectedIndex = -1;
                var item = this._items[val];
                if (item) {
                    this._selectedItem = item;
                    this._selectedIndex = val;
                    _get(Object.getPrototypeOf(ViewStack.prototype), "addChildAt", this).call(this, this._selectedItem, this.numChildren);
                }
            }
        }, {
            key: "getItemAt",
            value: function getItemAt(index) {
                return this._items[index];
            }
        }, {
            key: "getItemIndex",
            value: function getItemIndex(item) {
                return this.getChildIndex(item);
            }
        }, {
            key: "length",
            get: function get() {
                return this._items.length;
            }
        }, {
            key: "selectedIndex",
            set: function set(val) {
                val = +val || 0;
                if (val == this._selectedIndex) {
                    return;
                }
                if (val < 0 || val >= this._items.length) {
                    val = -1;
                }
                this._setSelectedIndex(val);
            },
            get: function get() {
                return this._selectedIndex;
            }
        }, {
            key: "selectedItem",
            set: function set(val) {
                var index = this.getChildIndex(val);
                this._setSelectedIndex(index);
            }
        }]);

        return ViewStack;
    }(Group);

    black.ViewStack = ViewStack;
    //////////////////////////End File:extension/black/ViewStack.js///////////////////////////

    //////////////////////////File:extension/black/Scroller.js///////////////////////////

    var Scroller = function (_MaskUI) {
        _inherits(Scroller, _MaskUI);

        function Scroller() {
            _classCallCheck(this, Scroller);

            var _this31 = _possibleConstructorReturn(this, Object.getPrototypeOf(Scroller).call(this));

            _this31._viewSize = flower.Size.create(0, 0);
            _this31._scrollDisX = [];
            _this31._scrollDisY = [];
            _this31._scrollTime = [];
            _this31._upGap = 18;

            _this31.addListener(flower.TouchEvent.TOUCH_BEGIN, _this31.__onTouchScroller, _this31);
            _this31.addListener(flower.TouchEvent.TOUCH_MOVE, _this31.__onTouchScroller, _this31);
            _this31.addListener(flower.TouchEvent.TOUCH_END, _this31.__onTouchScroller, _this31);
            _this31.addListener(flower.TouchEvent.TOUCH_RELEASE, _this31.__onTouchScroller, _this31);
            _this31.width = _this31.height = 100;
            //var bg = new RectUI();
            //bg.fillColor = 0x555555;
            //bg.percentWidth = 100;
            //bg.percentHeight = 100;
            //this.addChild(bg);
            return _this31;
        }

        _createClass(Scroller, [{
            key: "$createShape",
            value: function $createShape() {
                var shape = new RectUI();
                shape.percentWidth = 100;
                shape.percentHeight = 100;
                return shape;
            }
        }, {
            key: "__onTouchScroller",
            value: function __onTouchScroller(e) {
                if (!this._viewport) {
                    return;
                }
                var x = this.lastTouchX;
                var y = this.lastTouchY;
                switch (e.type) {
                    case flower.TouchEvent.TOUCH_BEGIN:
                        if (this._throw) {
                            this._throw.dispose();
                            this._throw = null;
                        }
                        this._startX = x - this._viewport.x;
                        this._startY = y - this._viewport.y;
                        this._scrollDisX.length = this._scrollDisY.length = this._scrollTime.length = 0;
                        break;
                    case flower.TouchEvent.TOUCH_MOVE:
                        if (Math.abs(x - this._startX) > this._upGap || Math.abs(y - this._startY) > this._upGap) {
                            this._viewport.$releaseItem();
                        }
                        var _x = this._viewport.x;
                        var _y = this._viewport.y;
                        if (this._viewport.contentWidth > this.width) {
                            this._viewport.x = x - this._startX;
                        }
                        if (this._viewport.contentHeight > this.height) {
                            this._viewport.y = y - this._startY;
                        }
                        if (this._viewport.y > this.height) {
                            this._viewport.y = this.height;
                        }
                        if (this._viewport.y < -this._viewport.contentHeight) {
                            this._viewport.y = -this._viewport.contentHeight;
                        }
                        if (this._viewport.x > this.width) {
                            this._viewport.x = this.width;
                        }
                        if (this._viewport.x < -this._viewport.contentWidth) {
                            this._viewport.x = -this._viewport.contentWidth;
                        }
                        this._scrollDisX.push(this._viewport.x - _x);
                        this._scrollDisY.push(this._viewport.y - _y);
                        this._scrollTime.push(flower.CoreTime.currentTime);
                        if (this._scrollDisX.length > 4) {
                            this._scrollDisX.shift();
                            this._scrollDisY.shift();
                            this._scrollTime.shift();
                        }
                        this._lastTouchTime = flower.CoreTime.currentTime;
                        break;
                    case flower.TouchEvent.TOUCH_END:
                    case flower.TouchEvent.TOUCH_RELEASE:
                        var timeGap = 0.5;
                        if (this._scrollTime.length) {
                            timeGap = flower.CoreTime.currentTime - this._scrollTime[0];
                        }
                        var disX = 0;
                        var disY = 0;
                        for (var i = 0; i < this._scrollDisX.length; i++) {
                            disX += this._scrollDisX[i];
                            disY += this._scrollDisY[i];
                        }
                        disX = disX * 100 / timeGap;
                        disY = disY * 100 / timeGap;
                        if (disX < -600) {
                            disX = -600;
                        }
                        if (disX > 600) {
                            disX = 600;
                        }
                        if (disY < -600) {
                            disY = -600;
                        }
                        if (disY > 600) {
                            disY = 600;
                        }
                        var toX = this._viewport.x + disX * 5;
                        var toY = this._viewport.y + disY * 5;
                        var flag = true;
                        if (-toX + this.width > this._viewport.contentWidth) {
                            toX = this.width - this._viewport.contentWidth;
                            flag = false;
                        }
                        if (toX > 0) {
                            toX = 0;
                            flag = false;
                        }
                        if (-toY + this.height > this._viewport.contentHeight) {
                            toY = this.height - this._viewport.contentHeight;
                            flag = false;
                        }
                        if (toY > 0) {
                            toY = 0;
                            flag = false;
                        }
                        if (flag && disX == 0 && disY == 0 && timeGap > 250) {
                            //trace("quit", timeGap);
                            break;
                        }
                        var timeX = Math.abs(toX - this._viewport.x) / 350;
                        var timeY = Math.abs(toY - this._viewport.y) / 350;
                        var time = timeX > timeY ? timeX : timeY;
                        if (time < 0.5) {
                            time = 0.5;
                        }
                        if (time > 5) {
                            time = 5;
                        }
                        this._throw = flower.Tween.to(this._viewport, time, {
                            x: toX,
                            y: toY
                        }, flower.Ease.CUBIC_EASE_OUT);
                        break;
                }
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this._viewport) {
                    this._viewport.width = this.width;
                    this._viewport.height = this.height;
                }
                if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                    this.$validateUIComponent();
                }
                _get(Object.getPrototypeOf(Scroller.prototype), "$onFrameEnd", this).call(this);
                this.$resetLayout();
            }
        }, {
            key: "dispose",
            value: function dispose() {
                flower.Size.release(this._viewSize);
                _get(Object.getPrototypeOf(Scroller.prototype), "dispose", this).call(this);
            }
        }, {
            key: "$setViewport",
            value: function $setViewport(val) {
                if (this._viewport == val) {
                    return;
                }
                //if (this._viewport) {
                //    this._viewport.removeListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
                //    this._viewport.removeListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
                //    this._viewport.removeListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
                //    this._viewport.removeListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
                //}
                this._viewport = val;
                this._viewport.viewer = this;
                //this._viewport.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
                //this._viewport.addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
                //this._viewport.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
                //this._viewport.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
                if (this._viewport.parent != this) {
                    this.addChild(this._viewport);
                }
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                this._viewSize.width = val;
            }
        }, {
            key: "$setHeight",
            value: function $setHeight(val) {
                this._viewSize.height = val;
            }
        }, {
            key: "$getWidth",
            value: function $getWidth() {
                return this._viewSize.width;
            }
        }, {
            key: "$getHeight",
            value: function $getHeight() {
                return this._viewSize.height;
            }

            //////////////////////////////////get&set//////////////////////////////////

        }, {
            key: "viewport",
            set: function set(val) {
                this.$setViewport(val);
            },
            get: function get() {
                return this._viewport;
            }
        }, {
            key: "releaseItemDistance",
            get: function get() {
                return this._upGap;
            },
            set: function set(val) {
                this._upGap = +val || 0;
            }
        }]);

        return Scroller;
    }(MaskUI);

    black.Scroller = Scroller;
    //////////////////////////End File:extension/black/Scroller.js///////////////////////////
})();
for (var key in black) {
    flower[key] = black[key];
}