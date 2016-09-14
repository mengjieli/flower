"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
     * 1023 rightClick
     * 1100 click
     * 1110 clickItem
     * 1111 selectedItemChange DataGroup
     * 1112 touchBeginItem
     * 1130 confirm
     * 1131 cancel
     * 1300 loadComplete
     * 1400 change  RadioButtonGroup
     * 1401 change  RadioButton
     * 1402 change ToggleButton
     * 1500 selectedItemChange ViewStack
     */

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
                        14: null };
                    //layout
                    UIComponent.registerEvent(clazz, 1000, "creationComplete", flower.Event.CREATION_COMPLETE);
                    UIComponent.registerEvent(clazz, 1001, "add", flower.Event.ADDED);
                    UIComponent.registerEvent(clazz, 1002, "addToStage", flower.Event.ADDED_TO_STAGE);
                    UIComponent.registerEvent(clazz, 1003, "remove", flower.Event.REMOVED);
                    UIComponent.registerEvent(clazz, 1004, "removeFromStage", flower.Event.REMOVED_FROM_STAGE);
                    UIComponent.registerEvent(clazz, 1020, "touchBegin", flower.TouchEvent.TOUCH_BEGIN);
                    UIComponent.registerEvent(clazz, 1021, "touchEnd", flower.TouchEvent.TOUCH_END);
                    UIComponent.registerEvent(clazz, 1022, "touchRelease", flower.TouchEvent.TOUCH_RELEASE);
                    UIComponent.registerEvent(clazz, 1023, "rightClick", flower.MouseEvent.RIGHT_CLICK);
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

                p.$callUIComponentEvent = function (type, args) {
                    var func = this.$UIComponent[type];
                    if (func) {
                        func.apply(this.eventThis, args);
                    }
                };

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
                };

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
                        if (val == "false") {
                            val = false;
                        }
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
            }
        }]);

        return UIComponent;
    }();

    UIComponent.registerEvent = function (clazz, index, name, eventType) {
        var p = clazz.prototype;
        Object.defineProperty(p, name, {
            get: function get() {
                return this.$UIComponent[index];
            },
            set: function set(val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function val() {
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
    };

    black.UIComponent = UIComponent;
    //////////////////////////End File:extension/black/core/UIComponent.js///////////////////////////

    //////////////////////////File:extension/black/data/member/Value.js///////////////////////////

    var Value = function (_flower$EventDispatch) {
        _inherits(Value, _flower$EventDispatch);

        function Value() {
            var checkDistort = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _classCallCheck(this, Value);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Value).call(this));

            _this.__old = null;
            _this.__value = null;
            _this.__checkDistort = null;

            _this.__checkDistort = checkDistort == null ? Value.Default_Check_Distort : checkDistort;
            return _this;
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
            key: "$getValue",
            value: function $getValue() {
                return this.__value;
            }
        }, {
            key: "value",
            get: function get() {
                if (this.__checkDistort) {
                    return this.$getValue();
                }
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

            //Value 是否自动检测非法修改

        }]);

        return Value;
    }(flower.EventDispatcher);

    Value.Default_Check_Distort = false;


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
            var itemType = arguments.length <= 1 || arguments[1] === undefined ? "*" : arguments[1];

            _classCallCheck(this, ArrayValue);

            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayValue).call(this));

            _this2._key = "";
            _this2._rangeMinKey = "";
            _this2._rangeMaxKey = "";
            _this2._selectedItem = null;
            _this2._itemType = null;

            _this2._itemType = itemType;
            _this2.list = init || [];
            _this2._length = _this2.list.length;
            _this2.__value = _this2;
            return _this2;
        }

        _createClass(ArrayValue, [{
            key: "push",
            value: function push(item) {
                this.list.push(item);
                this._length = this._length + 1;
                this.dispatchWith(flower.Event.ADDED, item);
                this.dispatchWith(flower.Event.UPDATE, this);
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
                this.dispatchWith(flower.Event.ADDED, item);
                this.dispatchWith(flower.Event.UPDATE, this);
            }
        }, {
            key: "shift",
            value: function shift() {
                if (!this.list.length) {
                    return;
                }
                var item = this.list.shift();
                this._length = this._length - 1;
                this.dispatchWith(flower.Event.REMOVED, item);
                this.dispatchWith(flower.Event.UPDATE, this);
                return item;
            }
        }, {
            key: "splice",
            value: function splice(startIndex) {
                var delCount = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                var i;
                startIndex = +startIndex & ~0;
                delCount = +delCount & ~0;
                var list;
                if (delCount <= 0) {
                    list = [];

                    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                        args[_key - 2] = arguments[_key];
                    }

                    for (i = 0; i < args.length; i++) {
                        list[i] = args[i];
                        this.list.splice(startIndex, 0, args[i]);
                    }
                    this._length = this._length + 1;
                    for (i = 0; i < args.length; i++) {
                        this.dispatchWith(flower.Event.ADDED, args[i]);
                    }
                    this.dispatchWith(flower.Event.UPDATE, this);
                } else {
                    list = this.list.splice(startIndex, delCount);
                    this._length = this._length - delCount;
                    for (i = 0; i < list.length; i++) {
                        this.dispatchWith(flower.Event.REMOVED, list[i]);
                    }
                    this.dispatchWith(flower.Event.UPDATE, this);
                }
                return list;
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
                this.dispatchWith(flower.Event.REMOVED, item);
                this.dispatchWith(flower.Event.UPDATE, this);
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
                    this.dispatchWith(flower.Event.REMOVED, item);
                }
                this.dispatchWith(flower.Event.UPDATE, this);
            }
        }, {
            key: "removeItem",
            value: function removeItem(item) {
                for (var i = 0, len = this.list.length; i < len; i++) {
                    if (this.list[i] == item) {
                        this.list.splice(i, 1);
                        this._length = this._length - 1;
                        this.dispatchWith(flower.Event.REMOVED, item);
                        this.dispatchWith(flower.Event.UPDATE, this);
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
                this.dispatchWith(flower.Event.REMOVED, item);
                this.dispatchWith(flower.Event.UPDATE, this);
                return item;
            }
        }, {
            key: "removeItemWith",
            value: function removeItemWith(key, value) {
                var key2 = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
                var value2 = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                var item;
                var i;
                if (key2 == "") {
                    for (i = 0; i < this.list.length; i++) {
                        var val = this.list[i][key];
                        if (val instanceof Value && !(val instanceof flower.ObjectValue) && !(val instanceof flower.ArrayValue)) {
                            val = val.value;
                        }
                        if (val == value) {
                            item = this.list.splice(i, 1)[0];
                            break;
                        }
                    }
                } else {
                    for (i = 0; i < this.list.length; i++) {
                        var val1 = this.list[i][key];
                        if (val1 instanceof Value && !(val1 instanceof flower.ObjectValue) && !(val1 instanceof flower.ArrayValue)) {
                            val1 = val1.value;
                        }
                        var val2 = this.list[i][key2];
                        if (val2 instanceof Value && !(val2 instanceof flower.ObjectValue) && !(val2 instanceof flower.ArrayValue)) {
                            val2 = val2.value;
                        }
                        if (val == value && val2 == value2) {
                            item = this.list.splice(i, 1)[0];
                            break;
                        }
                    }
                }
                if (!item) {
                    return;
                }
                this._length = this._length - 1;
                this.dispatchWith(flower.Event.REMOVED, item);
                this.dispatchWith(flower.Event.UPDATE, this);
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
                var key2 = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
                var value2 = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                var i;
                if (key2 == "") {
                    for (i = 0; i < this.list.length; i++) {
                        var keys = key.split(".");
                        var val1 = this.list[i];
                        for (var k = 0; k < keys.length; k++) {
                            val1 = val1[keys[k]];
                        }
                        if (val1 instanceof flower.Value && !(val1 instanceof flower.ObjectValue) && !(val1 instanceof flower.ArrayValue)) {
                            val1 = val1.value;
                        }
                        if (val1 == value) {
                            return this.list[i];
                        }
                    }
                } else {
                    for (i = 0; i < this.list.length; i++) {
                        var keys = key.split(".");
                        var val1 = this.list[i];
                        for (var k = 0; k < keys.length; k++) {
                            val1 = val1[keys[k]];
                        }
                        if (val1 instanceof flower.Value && !(val1 instanceof flower.ObjectValue) && !(val1 instanceof flower.ArrayValue)) {
                            val1 = val1.value;
                        }
                        keys = key2.split(".");
                        var val2 = this.list[i];
                        for (var k = 0; k < keys.length; k++) {
                            val2 = val2[keys[k]];
                        }
                        if (val2 instanceof flower.Value && !(val2 instanceof flower.ObjectValue) && !(val2 instanceof flower.ArrayValue)) {
                            val2 = val2.value;
                        }
                        if (val1 == value && val2 == value2) {
                            return this.list[i];
                        }
                    }
                }
                return null;
            }
        }, {
            key: "getItemFunction",
            value: function getItemFunction(func, thisObj) {
                for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                    args[_key2 - 2] = arguments[_key2];
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
                if (key2 == "") {
                    for (i = 0; i < this.list.length; i++) {
                        var keys = key.split(".");
                        var val1 = this.list[i];
                        for (var k = 0; k < keys.length; k++) {
                            val1 = val1[keys[k]];
                        }
                        if (val1 instanceof flower.Value && !(val1 instanceof flower.ObjectValue) && !(val1 instanceof flower.ArrayValue)) {
                            val1 = val1.value;
                        }
                        if (val1 == value) {
                            result.push(this.list[i]);
                        }
                    }
                } else {
                    for (i = 0; i < this.list.length; i++) {
                        var keys = key.split(".");
                        var val1 = this.list[i];
                        for (var k = 0; k < keys.length; k++) {
                            val1 = val1[keys[k]];
                        }
                        if (val1 instanceof flower.Value && !(val1 instanceof flower.ObjectValue) && !(val1 instanceof flower.ArrayValue)) {
                            val1 = val1.value;
                        }
                        keys = key2.split(".");
                        var val2 = this.list[i];
                        for (var k = 0; k < keys.length; k++) {
                            val2 = val2[keys[k]];
                        }
                        if (val2 instanceof flower.Value && !(val2 instanceof flower.ObjectValue) && !(val2 instanceof flower.ArrayValue)) {
                            val2 = val2.value;
                        }
                        if (val1 == value && val2 == value2) {
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
                    if (this.list[i][findKey] instanceof flower.Value && this.list[i][findKey].value == findValue) {
                        this.list[i][findKey].value = setValue;
                    } else if (this.list[i][findKey] == findValue) {
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
                this.dispatchWith(flower.Event.UPDATE, this);
            }
        }, {
            key: "setItemIndex",
            value: function setItemIndex(item, index) {
                var itemIndex = this.getItemIndex(item);
                if (itemIndex < 0 || itemIndex == index) {
                    return;
                }
                this.list.splice(itemIndex, 1);
                this.list.splice(index, 0, item);
                this.dispatchWith(flower.Event.UPDATE, this);
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
            key: "setItemAt",
            value: function setItemAt(index, item) {
                this.splice(index, 1);
                this.splice(index, 0, item);
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
            key: "dispose",
            value: function dispose() {
                var list = this.list;
                for (var i = 0; i < list.length; i++) {
                    var value = this.list[i];
                    if (value instanceof Value) {
                        value.dispose();
                    }
                }
                _get(Object.getPrototypeOf(ArrayValue.prototype), "dispose", this).call(this);
            }

            /**
             * 从 Object 中读取数据
             * @param value
             */

        }, {
            key: "$setValue",
            value: function $setValue(val) {
                this.removeAll();
                var itemType = this._itemType;
                for (var i = 0; i < val.length; i++) {
                    this.push(DataManager.createData(itemType, val[i]));
                }
            }

            /**
             * 将数据转化成 Object
             */

        }, {
            key: "value",
            get: function get() {
                var res = [];
                var list = this.list;
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    if (item instanceof Value) {
                        res.push(item.value);
                    } else {
                        res.push(item);
                    }
                }
                return res;
            },
            set: function set(val) {
                this.$setValue(val);
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
                        this.dispatchWith(flower.Event.REMOVED, item);
                    }
                    this.dispatchWith(flower.Event.UPDATE, this);
                }
            }
        }]);

        return ArrayValue;
    }(Value);

    for (var i = 0; i < 1000; i++) {
        Object.defineProperty(ArrayValue.prototype, "" + i, {
            get: function (index) {
                return function () {
                    return this.list[index];
                };
            }(i),
            set: function (index) {
                return function (val) {
                    this.setItemAt(index, val);
                };
            }(i),
            enumerable: true,
            configurable: true
        });
    }

    black.ArrayValue = ArrayValue;
    //////////////////////////End File:extension/black/data/member/ArrayValue.js///////////////////////////

    //////////////////////////File:extension/black/data/member/BooleanValue.js///////////////////////////

    var BooleanValue = function (_Value2) {
        _inherits(BooleanValue, _Value2);

        function BooleanValue() {
            var init = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
            var enumList = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            _classCallCheck(this, BooleanValue);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(BooleanValue).call(this));

            if (init == "false") {
                init = false;
            }
            _this3.__enumList = enumList;
            _this3.__old = _this3.__value = !!init;
            return _this3;
        }

        _createClass(BooleanValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                this.dispatchWith(flower.Event.UPDATE, this, val);
            }
        }, {
            key: "$setEnumList",
            value: function $setEnumList(val) {
                if (this.__enumList == val) {
                    return;
                }
                this.__enumList = val;
            }
        }, {
            key: "enumList",
            get: function get() {
                return this.__enumList;
            },
            set: function set(val) {
                this.$setEnumList(val);
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
            var enumList = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var checkDistort = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            _classCallCheck(this, IntValue);

            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(IntValue).call(this, checkDistort));

            _this4.__old = _this4.__value = +init & ~0 || 0;
            _this4.__enumList = enumList;
            _this4.__valueCheck = [48];
            return _this4;
        }

        _createClass(IntValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = +val & ~0 || 0;
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                if (this.__checkDistort) {
                    var str = val + "";
                    this.__valueCheck.length = 0;
                    for (var i = 0; i < str.length; i++) {
                        this.__valueCheck.push(str.charCodeAt(i));
                    }
                }
                this.dispatchWith(flower.Event.UPDATE, this, val);
            }
        }, {
            key: "$getValue",
            value: function $getValue() {
                if (this.__checkDistort) {
                    var str = this.__value + "";
                    var compare = "";
                    for (var i = 0; i < this.__valueCheck.length; i++) {
                        compare += String.fromCharCode(this.__valueCheck[i]);
                    }
                    if (str != compare) {
                        this.dispatchWith(flower.Event.DISTORT, this);
                        this.__value = parseFloat(compare);
                    }
                }
                return this.__value;
            }
        }, {
            key: "$setEnumList",
            value: function $setEnumList(val) {
                if (this.__enumList == val) {
                    return;
                }
                this.__enumList = val;
            }
        }, {
            key: "enumList",
            get: function get() {
                return this.__enumList;
            },
            set: function set(val) {
                this.$setEnumList(val);
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
            var enumList = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var checkDistort = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            _classCallCheck(this, NumberValue);

            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(NumberValue).call(this, checkDistort));

            _this5.__enumList = enumList;
            _this5.__old = _this5.__value = +init || 0;
            _this5.__precision = 2;
            _this5.__multiplier = Math.pow(10, _this5.__precision);
            _this5.__valueCheck = [48];
            return _this5;
        }

        _createClass(NumberValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = +val || 0;
                if (val > 0) {
                    var smallNumber = val - Math.floor(val);
                    smallNumber = Math.floor(smallNumber * this.__multiplier) / this.__multiplier;
                    val = Math.floor(val) + smallNumber;
                } else {
                    val = -val;
                    var smallNumber = val - Math.floor(val);
                    smallNumber = Math.floor(smallNumber * this.__multiplier) / this.__multiplier;
                    val = Math.floor(val) + smallNumber;
                    val = -val;
                }
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                if (this.__checkDistort) {
                    var str = val + "";
                    this.__valueCheck.length = 0;
                    for (var i = 0; i < str.length; i++) {
                        this.__valueCheck.push(str.charCodeAt(i));
                    }
                }
                this.dispatchWith(flower.Event.UPDATE, this, val);
            }
        }, {
            key: "$getValue",
            value: function $getValue() {
                if (this.__checkDistort) {
                    var str = this.__value + "";
                    var compare = "";
                    for (var i = 0; i < this.__valueCheck.length; i++) {
                        compare += String.fromCharCode(this.__valueCheck[i]);
                    }
                    if (str != compare) {
                        this.dispatchWith(flower.Event.DISTORT, this);
                        this.__value = parseFloat(compare);
                    }
                }
                return this.__value;
            }
        }, {
            key: "$setEnumList",
            value: function $setEnumList(val) {
                if (this.__enumList == val) {
                    return;
                }
                this.__enumList = val;
            }
        }, {
            key: "enumList",
            get: function get() {
                return this.__enumList;
            },
            set: function set(val) {
                this.$setEnumList(val);
            }

            /**
             * 设置精确到小数点后多少位
             * @param val
             */

        }, {
            key: "precision",
            set: function set(val) {
                this.__precision = val;
                this.__multiplier = Math.pow(10, this.__precision);
                this.$setValue(this.__value);
            },
            get: function get() {
                return this.__precision;
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
            var init = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _classCallCheck(this, ObjectValue);

            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectValue).call(this));

            _this6.__old = _this6.__value = {};
            if (init) {
                _this6.value = init;
            }
            _this6.__saveClass = {};
            _this6.__nosave = {};
            return _this6;
        }

        _createClass(ObjectValue, [{
            key: "$setMember",
            value: function $setMember(name, value) {
                var old = this.__value[name];
                this.__value[name] = value;
                this.dispatchWith(name, {
                    "name": name,
                    "old": old,
                    "value": value
                });
            }
        }, {
            key: "$setMemberSaveClass",
            value: function $setMemberSaveClass(name) {
                var saveClass = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                this.__saveClass[name] = saveClass;
            }
        }, {
            key: "$setMemberSaveFlag",
            value: function $setMemberSaveFlag(name) {
                var save = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                if (save == false) {
                    this.__nosave[name] = true;
                } else {
                    delete this.__nosave[name];
                }
            }
        }, {
            key: "hasMember",
            value: function hasMember(name) {
                return this.__value.hasOwnProperty(name);
            }
        }, {
            key: "getValue",
            value: function getValue(name) {
                return this.__value[name];
            }
        }, {
            key: "setValue",
            value: function setValue(name, value) {
                if (!this.__value.hasOwnProperty(name)) {
                    sys.$error(3014, name);
                    return;
                }
                if (value == null) {
                    this.$setMember(name, null);
                } else {
                    if (value && !(value instanceof Value) && (typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && value.__className) {
                        value = flower.DataManager.createData(value.__className, value);
                    }
                    if (value instanceof Value) {
                        this.$setMember(name, value);
                    } else {
                        var val = this.__value[name];
                        var old = val;
                        if (val instanceof Value) {
                            val.value = value;
                        } else {
                            this.__value[name] = value;
                            this.dispatchWith(name, {
                                "name": name,
                                "old": old,
                                "value": value
                            });
                        }
                    }
                }
            }

            /**
             * 从 Object 中读取数据
             * @param value
             */

        }, {
            key: "$setValue",
            value: function $setValue(val) {
                if (val == null) {
                    sys.$error(3015);
                    return;
                }
                var list = Object.keys(val);
                for (var i = 0; i < list.length; i++) {
                    var key = list[i];
                    var value = val[key];
                    if (!this.__value.hasOwnProperty(key)) {
                        this.$setMember(key, value);
                    } else {
                        this.setValue(key, value);
                    }
                }
            }
        }, {
            key: "$getValue",
            value: function $getValue() {
                var saveClass = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                var val = this.__value;
                var list = Object.keys(val);
                var config = {};
                for (var i = 0; i < list.length; i++) {
                    var key = list[i];
                    if (this.__nosave[key]) {
                        continue;
                    }
                    var member = val[key];
                    if (member instanceof Value) {
                        if (member instanceof ObjectValue) {
                            config[key] = member.$getValue(this.__saveClass[key]);
                        } else {
                            config[key] = member.value;
                        }
                    } else {
                        config[key] = member;
                    }
                }
                if (this.__className && saveClass) {
                    config.__className = this.__className.value;
                }
                return config;
            }

            /**
             * 将数据转化成 Object
             */

        }, {
            key: "dispose",
            value: function dispose() {
                var val = this.__value;
                var list = Object.keys(val);
                for (var i = 0; i < list.length; i++) {
                    var key = list[i];
                    if (val[key] instanceof Value) {
                        val[key].dispose();
                    }
                }
                _get(Object.getPrototypeOf(ObjectValue.prototype), "dispose", this).call(this);
            }
        }, {
            key: "value",
            get: function get() {
                return this.$getValue();
            },
            set: function set(val) {
                this.$setValue(val);
            }
        }, {
            key: "className",
            get: function get() {
                return this.__className ? this.__className.value : "";
            },
            set: function set(val) {
                if (val) {
                    this.__className = new StringValue(val);
                } else {
                    this.__className = null;
                }
            }
        }, {
            key: "membersKey",
            get: function get() {
                return Object.keys(this.value);
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
            var enumList = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            _classCallCheck(this, StringValue);

            var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(StringValue).call(this));

            _this7.__old = _this7.__value = "" + (init == null ? "" : init);
            _this7.__enumList = enumList;
            return _this7;
        }

        _createClass(StringValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = "" + (val == null ? "" : val);
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                this.dispatchWith(flower.Event.UPDATE, this, val);
            }
        }, {
            key: "$setEnumList",
            value: function $setEnumList(val) {
                if (this.__enumList == val) {
                    return;
                }
                this.__enumList = val;
            }
        }, {
            key: "enumList",
            get: function get() {
                return this.__enumList;
            },
            set: function set(val) {
                this.$setEnumList(val);
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
            var enumList = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var checkDistort = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            _classCallCheck(this, UIntValue);

            var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(UIntValue).call(this, checkDistort));

            init = +init & ~0 || 0;
            if (init < 0) {
                init = 0;
            }
            _this8.__enumList = enumList;
            _this8.__old = _this8.__value = init;
            _this8.__valueCheck = [48];
            return _this8;
        }

        _createClass(UIntValue, [{
            key: "$setValue",
            value: function $setValue(val) {
                val = +val & ~0 || 0;
                if (val < 0) {
                    val = 0;
                }
                if (val == this.__value) {
                    return;
                }
                this.__old = this.__value;
                this.__value = val;
                if (this.__checkDistort) {
                    var str = val + "";
                    this.__valueCheck.length = 0;
                    for (var i = 0; i < str.length; i++) {
                        this.__valueCheck.push(str.charCodeAt(i));
                    }
                }
                this.dispatchWith(flower.Event.UPDATE, this, val);
            }
        }, {
            key: "$getValue",
            value: function $getValue() {
                if (this.__checkDistort) {
                    var str = this.__value + "";
                    var compare = "";
                    for (var i = 0; i < this.__valueCheck.length; i++) {
                        compare += String.fromCharCode(this.__valueCheck[i]);
                    }
                    if (str != compare) {
                        this.dispatchWith(flower.Event.DISTORT, this);
                        this.__value = parseFloat(compare);
                    }
                }
                return this.__value;
            }
        }, {
            key: "$setEnumList",
            value: function $setEnumList(val) {
                if (this.__enumList == val) {
                    return;
                }
                this.__enumList = val;
            }
        }, {
            key: "enumList",
            get: function get() {
                return this.__enumList;
            },
            set: function set(val) {
                this.$setEnumList(val);
            }
        }]);

        return UIntValue;
    }(Value);

    black.UIntValue = UIntValue;
    //////////////////////////End File:extension/black/data/member/UIntValue.js///////////////////////////

    //////////////////////////File:extension/black/language/zh_CN.js///////////////////////////
    var locale_strings = flower.sys.$locale_strings["zh_CN"];

    locale_strings[3001] = "UIParse 异步加载资源出错 : {0}";
    locale_strings[3002] = "找不到 UI 对应的路径， UI 类名: {0}";
    locale_strings[3003] = "解析 UI 出错,:\n{0}\n{1}\n\n解析后内容为:\n{2}";
    locale_strings[3004] = "解析 UI 出错:无法解析的命名空间 {0} :\n{1}";
    locale_strings[3005] = "解析 UI 出错:无法解析的类名 {0} :\n{1}";
    locale_strings[3006] = "解析 UI 出错,未设置命名空间 xmlns:f=\"flower\" :\n{0}";
    locale_strings[3007] = "解析 UI 脚本文件出错, url={0} content:\n{1}";
    locale_strings[3010] = "没有定义数据结构类名 :\n{0}";
    locale_strings[3011] = "数据结构类定义解析出错 : {0}\n{1}";
    locale_strings[3012] = "没有定义的数据结构 : {0}";
    locale_strings[3013] = "没有找到要集成的数据结构类 :{0} ，数据结构定义为:\n{1}";
    locale_strings[3014] = "无法设置属性值，该对象没有此属性 : {0}";
    locale_strings[3015] = "对象不能设置为空";
    locale_strings[3016] = "无权访问模块数据，moduleKey 错误: {0}";
    locale_strings[3100] = "没有定义的数据类型 : {0}";
    locale_strings[3101] = "超出索引范围 : {0}，当前索引范围 0 ~ {1}";
    locale_strings[3102] = "还没有设定数据源 dataProvider";
    locale_strings[3201] = "没有找到对应的类 : {0}";
    //////////////////////////End File:extension/black/language/zh_CN.js///////////////////////////

    //////////////////////////File:extension/black/data/DataManager.js///////////////////////////

    var DataManager = function () {
        function DataManager() {
            _classCallCheck(this, DataManager);

            this._defines = {};
            this._root = {};

            if (DataManager.instance) {
                return;
            }
            DataManager.instance = this;
            this.addDefine({
                "name": "Attribute",
                "members": {
                    "name": { "type": "string" },
                    "content": { "type": "string" }
                }
            });
            this.addDefine({
                "name": "Size",
                "members": {
                    "width": { "type": "int" },
                    "height": { "type": "int" }
                }
            });
            this.addDefine({
                "name": "Point",
                "members": {
                    "x": { "type": "int" },
                    "y": { "type": "int" }
                }
            });
            this.addDefine({
                "name": "Rectangle",
                "members": {
                    "x": { "type": "int" },
                    "y": { "type": "int" },
                    "width": { "type": "int" },
                    "height": { "type": "int" }
                }
            });
            this.addDefine({
                "name": "ProgressData",
                "members": {
                    "current": { "type": "number" },
                    "max": { "type": "number" },
                    "percent": { "type": "number", "bind": "{max==0?1:current/max}" },
                    "tip": { "type": "string" }
                }
            });
            this.addDefine({
                "name": "flower.System",
                "members": {
                    "screen": { "type": "Size" }
                }
            });
            this.addDefine({
                "name": "FlowerData",
                "members": {
                    "system": { "type": "flower.System" }
                }
            });
            this.addRootData("flower", "FlowerData");
        }

        _createClass(DataManager, [{
            key: "addRootData",
            value: function addRootData(name, className) {
                var init = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                this[name] = this.createData(className, init);
                return this._root[name] = this[name];
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
                        //moduleKey: moduleKey,
                        id: 0,
                        className: "",
                        define: null
                    };
                }
                var item = this._defines[className];
                var packages = className.split(".");
                className = packages.splice(packages.length - 1, 1)[0];
                var defineClass = "" + className + (item.id != 0 ? item.id : "");
                item.className = defineClass;
                var extendClassName = "ObjectValue";
                if (config.extends) {
                    var extendsItem = this.getClass(config.extends);
                    if (extendsItem) {
                        extendClassName = "DataManager.getInstance().getClass(\"" + config.extends + "\")";
                    } else {
                        var extendPakcages = config.extends.split(".");
                        extendsItem = $root;
                        for (var i = 0; i < extendPakcages.length; i++) {
                            extendsItem = extendsItem[extendPakcages[i]];
                        }
                        if (extendsItem) {
                            extendClassName = config.extends;
                        }
                    }
                    if (!extendsItem) {
                        sys.$error(3013, config.extends, flower.ObjectDo.toString(config));
                        return;
                    }
                }
                var content = "var " + defineClass + " = (function (_super) {\n" + "\t__extends(" + defineClass + ", _super);\n" + "\tfunction " + defineClass + "(init) {\n" + "\t\t_super.call(this,null);\n";
                content += "\t\tthis.className = \"" + config.name + "\";\n";
                var defineMember = "";
                var members = config.members;
                var bindContent = "";
                if (members) {
                    var member;
                    for (var key in members) {
                        member = members[key];
                        if (member.init && _typeof(member.init) == "object" && member.init.__className) {
                            content += "\t\tthis.$setMember(\"" + key + "\" , flower.DataManager.getInstance().createData(\"" + member.init.__className + "\"," + (member.init != null ? JSON.stringify(member.init) : "null") + "," + member.checkDistort + "));\n";
                            content += "\t\tthis.$setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                        } else {
                            if (member.type === "number" || member.type === "Number") {
                                content += "\t\tthis.$setMember(\"" + key + "\" , new NumberValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "," + member.checkDistort + "));\n";
                            } else if (member.type === "int" || member.type === "Int") {
                                content += "\t\tthis.$setMember(\"" + key + "\" , new IntValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "," + member.checkDistort + "));\n";
                            } else if (member.type === "uint" || member.type === "Uint") {
                                content += "\t\tthis.$setMember(\"" + key + "\" , new UIntValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "," + member.checkDistort + "));\n";
                            } else if (member.type === "string" || member.type === "String") {
                                content += "\t\tthis.$setMember(\"" + key + "\" , new StringValue(" + (member.init != null ? "\"" + member.init + "\"" : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                            } else if (member.type === "boolean" || member.type === "Boolean" || member.type === "bool") {
                                content += "\t\tthis.$setMember(\"" + key + "\" , new BooleanValue(" + (member.init != null ? member.init : "null") + "," + (member.enumList ? JSON.stringify(member.enumList) : "null") + "));\n";
                            } else if (member.type === "array" || member.type === "Array") {
                                content += "\t\tthis.$setMember(\"" + key + "\" , new ArrayValue(" + (member.init != null ? member.init : "null") + ",\"" + member.typeValue + "\"));\n";
                            } else if (member.type === "*") {
                                content += "\t\tthis.$setMember(\"" + key + "\" , " + (member.init != null ? member.init : "null") + ");\n";
                                content += "\t\tthis.$setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                            } else {
                                if (member.hasOwnProperty("init") && member.init == null) {
                                    content += "\t\tthis.$setMember(\"" + key + "\" , null);\n";
                                } else {
                                    content += "\t\tthis.$setMember(\"" + key + "\" , flower.DataManager.getInstance().createData(\"" + member.type + "\"," + (member.init != null ? JSON.stringify(member.init) : "null") + "));\n";
                                }
                                content += "\t\tthis.$setMemberSaveClass(\"" + key + "\" ," + (member.saveClass ? true : false) + ");\n";
                            }
                        }
                        if (member.save === true || member.save === false) {
                            content += "\t\tthis.$setMemberSaveFlag(\"" + key + "\" ," + member.save + ");\n";
                        }
                        if (member.bind) {
                            bindContent += "\t\tnew flower.Binding(this." + key + ",[this],\"value\",\"" + member.bind + "\");\n";
                        }
                        defineMember += "\tObject.defineProperty(" + defineClass + ".prototype,\"" + key + "\", {\n";
                        defineMember += "\t\tget: function () {\n";
                        defineMember += "\t\t\treturn this.__value[\"" + key + "\"];\n";
                        defineMember += "\t\t},\n";
                        defineMember += "\t\tset: function (val) {\n";
                        defineMember += "\t\t\tthis.setValue(\"" + key + "\", val);\n";
                        defineMember += "\t\t},\n";
                        defineMember += "\t\tenumerable: true,\n";
                        defineMember += "\t\tconfigurable: true\n";
                        defineMember += "\t});\n\n";
                    }
                }
                if (config.init) {
                    content += "\t\tthis.value = " + JSON.stringify(config.init) + ";\n";
                }
                content += "\t\tif(init) this.value = init;\n";
                content += bindContent;
                content += "\t}\n\n" + defineMember + "\treturn " + defineClass + ";\n" + "})(" + extendClassName + ");\n";
                content += "DataManager.getInstance().$addClassDefine(" + defineClass + ", \"" + config.name + "\");\n";
                if (config.exports) {
                    var name = "";
                    for (var i = 0; i < packages.length; i++) {
                        name += packages[i];
                        content += "$root." + name + " = $root." + name + " || {}\n";
                        name += ".";
                    }
                    name += className;
                    content += "$root." + name + " = " + defineClass + ";\n";
                }
                if (sys.TIP) {
                    flower.trace("数据结构:\n" + content);
                }
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
                return this.getClass(config.name);
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
                //if (item.moduleKey != moduleKey) {
                //    sys.$error(3016, moduleKey);
                //}
                return item.define;
            }
        }, {
            key: "createData",
            value: function createData(className) {
                var init = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                var distort = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                if (className === "number" || className === "Number") {
                    return new NumberValue(init, null, distort);
                } else if (className === "int" || className === "Int") {
                    return new IntValue(init, null, distort);
                } else if (className === "uint" || className === "Uint") {
                    return new UIntValue(init, null, distort);
                } else if (className === "string" || className === "String") {
                    return new StringValue(init);
                } else if (className === "boolean" || className === "Boolean" || className === "bool") {
                    return new BooleanValue(init);
                } else if (className === "array" || className === "Array") {
                    return new ArrayValue(init);
                } else if (className === "*") {
                    return init;
                } else {
                    var item = this._defines[className];
                    if (!item) {
                        sys.$error(3012, className);
                        return;
                    }
                    //if (item.moduleKey != moduleKey) {
                    //    sys.$error(3016, moduleKey);
                    //}
                    return new item.define(init);
                }
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
                if (DataManager.instance == null) {
                    new DataManager();
                }
                return DataManager.instance;
            }
        }, {
            key: "addRootData",
            value: function addRootData(name, className) {
                var init = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                return DataManager.getInstance().addRootData(name, className, init);
            }
        }, {
            key: "getClass",
            value: function getClass(className) {
                return DataManager.getInstance().getClass(className);
            }
        }, {
            key: "addDefine",
            value: function addDefine(config) {
                return DataManager.getInstance().addDefine(config);
            }
        }, {
            key: "createData",
            value: function createData(className) {
                var init = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                return DataManager.getInstance().createData(className, init);
            }
        }, {
            key: "clear",
            value: function clear() {
                DataManager.getInstance().clear();
            }
        }]);

        return DataManager;
    }();

    black.DataManager = DataManager;
    //////////////////////////End File:extension/black/data/DataManager.js///////////////////////////

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
                if (val == "false") {
                    val = false;
                }
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

    //////////////////////////File:extension/black/utils/PanelScaleMode.js///////////////////////////

    var PanelScaleMode = function PanelScaleMode() {
        _classCallCheck(this, PanelScaleMode);
    };

    PanelScaleMode.NO_SCALE = "no_scale";
    PanelScaleMode.SHOW_ALL = "show_all";
    PanelScaleMode.NO_BORDER = "no_border";
    PanelScaleMode.SCALE_WIDTH = "scale_width";
    PanelScaleMode.SCALE_HEIGHT = "scale_height";


    black.PanelScaleMode = PanelScaleMode;
    //////////////////////////End File:extension/black/utils/PanelScaleMode.js///////////////////////////

    //////////////////////////File:extension/black/Group.js///////////////////////////

    var Group = function (_flower$Sprite) {
        _inherits(Group, _flower$Sprite);

        function Group(data) {
            _classCallCheck(this, Group);

            var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this));

            if (data != null) {
                _this12._data = data;
            }
            _this12.$initUIComponent();
            return _this12;
        }

        _createClass(Group, [{
            key: "setData",
            value: function setData(val) {
                if (val && typeof val == "string") {
                    val = flower.DataManager.getInstance().createData(val);
                }
                if (this._data == val) {
                    return false;
                }
                this._data = val;
                if (this.$UIComponent) {
                    flower.Binding.changeData(this);
                }
                return true;
            }
        }, {
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

            /**
             * 验证 UI 属性
             */

        }, {
            key: "$validateUIComponent",
            value: function $validateUIComponent(parent) {
                this.$removeFlags(0x1000);
                //开始验证属性
                var p = this.$UIComponent;
                if (this.$hasFlags(0x0001)) {
                    this.$getContentBounds();
                }
                parent = parent || this.parent;
                if (p[0] != null && p[1] == null && p[2] != null) {
                    this.width = (p[2] - p[0]) * 2;
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null && p[2] != null) {
                    this.width = (p[1] - p[2]) * 2;
                    this.x = 2 * p[2] - p[1];
                } else if (p[0] != null && p[1] != null) {
                    this.width = parent.width - p[1] - p[0];
                    this.x = p[0];
                } else {
                    if (p[0] != null) {
                        this.x = p[0];
                    }
                    if (p[1] != null) {
                        this.x = parent.width - p[1] - this.width;
                    }
                    if (p[2] != null) {
                        this.x = (parent.width - this.width) * 0.5 + p[2];
                    }
                    if (p[6]) {
                        this.width = parent.width * p[6] / 100;
                    }
                }
                if (p[3] != null && p[4] == null && p[5] != null) {
                    this.height = (p[5] - p[3]) * 2;
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null && p[5] != null) {
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] != null && p[4] != null) {
                    this.height = parent.height - p[4] - p[3];
                    this.y = p[3];
                } else {
                    if (p[3] != null) {
                        this.y = p[3];
                    }
                    if (p[4] != null) {
                        this.y = parent.height - p[4] - this.height;
                    }
                    if (p[5] != null) {
                        this.y = (parent.height - this.height) * 0.5 + p[5];
                    }
                    if (p[7]) {
                        this.height = parent.height * p[7] / 100;
                    }
                }
                this.$validateChildrenUIComponent();
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
                if (this.$hasFlags(this.layout && 0x2000)) {
                    this.$removeFlags(0x2000);
                    this.layout.updateList(this.width, this.height);
                }
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (!this.parent.__UIComponent) {
                    var flag = false;
                    var count = 6;
                    while (count && this.$hasFlags(0x1000)) {
                        this.$validateUIComponent();
                        _get(Object.getPrototypeOf(Group.prototype), "$onFrameEnd", this).call(this);
                        this.$resetLayout();
                        flag = true;
                        count--;
                    }
                    if (!flag) {
                        _get(Object.getPrototypeOf(Group.prototype), "$onFrameEnd", this).call(this);
                        this.$resetLayout();
                    }
                    while (count && this.$hasFlags(0x1000)) {
                        this.$validateUIComponent();
                        _get(Object.getPrototypeOf(Group.prototype), "$onFrameEnd", this).call(this);
                        this.$resetLayout();
                        flag = true;
                        count--;
                    }
                } else {
                    _get(Object.getPrototypeOf(Group.prototype), "$onFrameEnd", this).call(this);
                    this.$resetLayout();
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                flower.Binding.removeChangeObject(this);
                this.removeAllBindProperty();
                this.$UIComponent[11].dispose();
                _get(Object.getPrototypeOf(Group.prototype), "dispose", this).call(this);
            }
        }, {
            key: "data",
            get: function get() {
                return this._data;
            },
            set: function set(val) {
                this.setData(val);
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
            var beforeScript = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            _classCallCheck(this, UIParser);

            var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(UIParser).call(this));

            _this13.defaultClassName = "";
            _this13.moduleName = "local";
            _this13.namespaces = {};

            _this13._beforeScript = beforeScript;
            _this13.classes = flower.UIParser.classes;
            _this13.percentWidth = _this13.percentHeight = 100;
            return _this13;
        }

        _createClass(UIParser, [{
            key: "parseUIAsync",
            value: function parseUIAsync(url) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                if (this.classes.uiModule[url]) {
                    this.moduleName = this.classes.uiModule[url];
                    if (this._beforeScript == "" && flower.UIParser.classes.beforeScripts[this.moduleName]) {
                        this._beforeScript = flower.UIParser.classes.beforeScripts[this.moduleName];
                    }
                }
                if (this.classes.defaultClassNames[url]) {
                    this.defaultClassName = this.classes.defaultClassNames[url];
                }
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
                if (this.classes.uiModule[url]) {
                    this.moduleName = this.classes.uiModule[url];
                    if (this._beforeScript == "" && flower.UIParser.classes.beforeScripts[this.moduleName]) {
                        this._beforeScript = flower.UIParser.classes.beforeScripts[this.moduleName];
                    }
                }
                if (this.classes.defaultClassNames[url]) {
                    this.defaultClassName = this.classes.defaultClassNames[url];
                }
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
                if (this.hasListener(flower.Event.ERROR)) {
                    this.dispatchWith(flower.Event.ERROR, sys.getLanguage(3001, e.currentTarget.url));
                } else {
                    sys.$error(3001, e.currentTarget.url);
                }
            }
        }, {
            key: "loadContentComplete",
            value: function loadContentComplete(e) {
                this.relationUI = [];
                var xml = flower.XMLElement.parse(e.data);
                for (var i = 0; i < xml.namespaces.length; i++) {
                    if (xml.namespaces[i].name == "f") {
                        continue;
                    }
                    var moduleURL = xml.namespaces[i].value;
                    if (moduleURL.slice(0, 2) == "./") {
                        moduleURL = flower.Path.joinPath(this.loadURL, moduleURL);
                    }
                    this.namespaces[xml.namespaces[i].name] = this.classes.namespaces[moduleURL];
                    if (!this.namespaces[xml.namespaces[i].name]) {
                        sys.$error(3004, xml.namespaces[i].name, xml.namespaces[i].value);
                    }
                }
                this.loadContent = xml;
                var list = xml.getAllElements();
                var scriptURL = "";
                for (var i = 0; i < list.length; i++) {
                    var name = list[i].name;
                    var nameSpace = name.split(":")[0];
                    name = name.split(":")[1];
                    if (nameSpace != "f") {
                        nameSpace = this.namespaces[nameSpace];
                        if (!this.classes[nameSpace][name] && !this.classes[nameSpace + "Content"][name]) {
                            if (!this.classes[nameSpace + "URL"][name]) {
                                sys.$error(3002, name);
                                return;
                            }
                            var find = false;
                            for (var f = 0; f < this.relationUI.length; f++) {
                                if (this.relationUI[f].url == this.classes[nameSpace + "URL"][name]) {
                                    find = true;
                                    break;
                                }
                            }
                            if (!find) {
                                this.relationUI.push({
                                    "namesapce": nameSpace,
                                    "url": this.classes[nameSpace + "URL"][name],
                                    "name": name
                                });
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
                loader.addListener(flower.Event.ERROR, this.loadContentError, this);
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
                        this.dispatchWith(flower.Event.COMPLETE, ui);
                    } else {
                        var data = this.parse(this.loadContent);
                        this.dispatchWith(flower.Event.COMPLETE, data);
                    }
                } else {
                    var parser = new UIParser();
                    parser.defaultClassName = this.relationUI[this.relationIndex].name;
                    parser.moduleName = this.relationUI[this.relationIndex].namesapce;
                    parser.parseAsync(this.relationUI[this.relationIndex].url);
                    parser.addListener(flower.Event.COMPLETE, this.loadNextRelationUI, this);
                    parser.addListener(flower.ERROR, this.relationLoadError, this);
                }
            }
        }, {
            key: "relationLoadError",
            value: function relationLoadError(e) {
                if (this.hasListener(flower.Event.ERROR)) {
                    this.dispatchWith(flower.Event.ERROR, e.data);
                } else {
                    $error(e.data);
                }
            }
        }, {
            key: "parseUI",
            value: function parseUI(content) {
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                this.parse(content);
                var className = this._className;
                var namesapce = this.moduleName;
                var UIClass = this.classes[namesapce][className];
                var ui;
                if (data) {
                    ui = new UIClass(data);
                } else {
                    ui = new UIClass();
                }
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
                for (var i = 0; i < xml.namespaces.length; i++) {
                    if (xml.namespaces[i].name == "f") {
                        continue;
                    }
                    var moduleURL = xml.namespaces[i].value;
                    if (moduleURL.slice(0, 2) == "./") {
                        if (!this.loadURL || !moduleURL) {
                            flower.breakPoint();
                        }
                        moduleURL = flower.Path.joinPath(this.loadURL, moduleURL);
                    }
                    this.namespaces[xml.namespaces[i].name] = this.classes.namespaces[moduleURL];
                    if (!this.namespaces[xml.namespaces[i].name]) {
                        sys.$error(3004, xml.namespaces[i].name, xml.namespaces[i].value);
                    }
                }
                this.rootXML = xml;
                var classInfo = this.decodeRootComponent(xml, content);
                var namesapce = classInfo.namesapce;
                var className = classInfo.className;
                this.parseContent = "";
                this._className = className;
                this._classNameSpace = classInfo.namesapce;
                this.rootXML = null;
                return classInfo.className;
            }
        }, {
            key: "decodeRootComponent",
            value: function decodeRootComponent(xml, classContent) {
                var content = this._beforeScript;
                var namespacesList = xml.namespaces;
                var namespaces = {};
                for (var i = 0; i < namespacesList.length; i++) {
                    namespaces[namespacesList[i].name] = namespacesList[i].value;
                }
                //= xml.getNameSapce("local") ? true : false;
                var uiname = xml.name;
                var uinameNS = uiname.split(":")[0];
                var extendClass = "";
                uiname = uiname.split(":")[1];
                var className = "";
                var allClassName = "";
                var packages = [];
                if (uinameNS != "f") {
                    uinameNS = this.namespaces[uinameNS];
                    extendClass = uiname;
                } else {
                    extendClass = this.classes[uinameNS][uiname];
                    if (!extendClass && this.classes[uinameNS + "Content"][extendClass]) {
                        this.parse(this.classes[uinameNS + "Content"][extendClass]);
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
                    if (this.defaultClassName && this.defaultClassName != "") {
                        className = this.defaultClassName;
                        allClassName = className;
                    } else {
                        className = "$UI" + UIParser.id++;
                        allClassName = className;
                    }
                }
                var changeAllClassName = allClassName;
                if (uinameNS != "f" && this.classes[uinameNS][allClassName]) {
                    if (this.classes[uinameNS + "Content"][allClassName] == classContent) {
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
                content += before + "\tfunction " + className + "(data) {\n";
                content += before + "\t\t _super.call(this);\n";
                content += before + "\t\tthis." + className + "_binds = [];\n";
                var scriptInfo = {
                    content: ""
                };
                this.hasInitFunction = false;
                content += this.decodeScripts(before, className, xml.getElements("f:script"), scriptInfo);
                content += before + "\t\tthis." + className + "_initMain(this);\n";
                var propertyList = [];
                this.decodeObject(before + "\t", className, className + "_initMain", false, xml, namespaces, propertyList, {});
                if (this.hasInitFunction) {
                    content += before + "\t\tthis." + className + "_init();\n";
                }
                content += before + "\t\tif(data) this.data = data;\n";
                content += before + "\t\tthis." + className + "_setBindProperty" + "();\n";
                content += before + "\t\tif(this.dispatchWith) this.dispatchWith(flower.Event.CREATION_COMPLETE);\n";
                content += before + "\t}\n\n";
                content += propertyList[propertyList.length - 1];
                for (var i = 0; i < propertyList.length - 1; i++) {
                    content += propertyList[i];
                }
                content += scriptInfo.content;
                content += before + "\t" + className + ".prototype." + className + "_setBindProperty = function() {\n";
                content += before + "\t\tfor(var i = 0; i < this." + className + "_binds.length; i++) this." + className + "_binds[i][0].bindProperty(this." + className + "_binds[i][1],this." + className + "_binds[i][2],[this]);\n";
                content += before + "\t}\n\n";
                content += this.staticScript || "";
                content += before + "\treturn " + className + ";\n";
                if (uinameNS == "f") {
                    content += before + "})(" + extendClass + ");\n";
                } else {
                    content += before + "})(flower.UIParser.getLocalUIClass(\"" + extendClass + "\",\"" + uinameNS + "\"));\n";
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
                content += "\n\nUIParser.registerLocalUIClass(\"" + allClassName + "\", " + changeAllClassName + ",\"" + this.moduleName + "\");\n";
                var pkg = "";
                var pkgs = flower.UIParser.classes.packages[this.moduleName] || [];
                pkgs = pkgs.concat(packages);
                for (var i = 0; i < pkgs.length; i++) {
                    pkg = pkgs[i];
                    content += "if($root." + pkg + " == null) $root." + pkg + " = {};\n";
                    pkg += ".";
                }
                content += "$root." + pkg + allClassName + " = " + allClassName;
                if (sys.TIP) {
                    trace("解析类:\n", content);
                }
                if (sys.DEBUG) {
                    try {
                        eval(content);
                    } catch (e) {
                        sys.$error(3003, e, this.parseContent, content);
                    }
                } else {
                    eval(content);
                }
                flower.UIParser.setLocalUIClassContent(allClassName, classContent, this.moduleName);
                return {
                    "namesapce": uinameNS,
                    "className": allClassName
                };
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
                    this.staticScript = "";
                    while (true) {
                        var nextFunction = this.findNextFunction(scriptContent, pos);
                        if (nextFunction) {
                            this.staticScript += nextFunction.staticScript;
                            pos = nextFunction.endIndex;
                            list.push(nextFunction);
                        } else {
                            break;
                        }
                    }
                    for (var i = 0; i < list.length; i++) {
                        var func = list[i];
                        if (func.gset == 0) {
                            script.content += before + "\t" + className + (func.isStatic ? "." : ".prototype.") + func.name + " = function(" + func.params + ") " + func.content + "\n";
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
                                //if (childName == "init") {
                                //    childName = className + "_" + childName;
                                //    this.hasInitFunction = true;
                                //}
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
                var isStatic = false;
                //跳过空格和注释
                i = flower.StringDo.jumpProgramSpace(content, start);
                if (i == content.length) {
                    return null;
                }
                var j = i;
                while (j < content.length) {
                    if (content.slice(j, j + "static".length) == "static" || content.slice(j, j + len) == "function") {
                        break;
                    }
                    j++;
                }
                if (j == content.length) {
                    this.staticScript += content.slice(i, j);
                    return null;
                }
                var staticScript = content.slice(i, j);
                i = j;
                if (content.slice(i, i + "static".length) == "static") {
                    isStatic = true;
                    i += "static".length;
                    //跳过空格和注释
                    i = flower.StringDo.jumpProgramSpace(content, i);
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
                        pos += name.length;
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
                            pos += name.length;
                        }
                        //跳过空格
                        pos = flower.StringDo.jumpProgramSpace(content, pos);
                        char = content.charAt(pos);
                        if (char == ",") {
                            params += ",";
                            pos++;
                        }
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
                res.staticScript = staticScript || "";
                res.content = content;
                res.endIndex = i + content.length + 1;
                res.isStatic = isStatic;
                return res;
            }
        }, {
            key: "decodeObject",
            value: function decodeObject(before, className, funcName, createClass, xml, namespaces, propertyFunc, nameIndex) {
                var setObject = before + className + ".prototype." + funcName + " = function(parentObject) {\n";
                var thisObj = "parentObject";
                var createClassName;
                if (createClass) {
                    var createClassNameSpace = xml.name.split(":")[0];
                    createClassName = xml.name.split(":")[1];
                    if (createClassNameSpace != "f" && createClassName == "Object") {
                        thisObj = "object";
                        setObject += before + "\t" + thisObj + " = {};\n";
                    } else {
                        //if (createClassNameSpace != "f") {
                        //    createClassName = this.classes[createClassNameSpace][createClassName];
                        //}
                        thisObj = createClassName.split(".")[createClassName.split(".").length - 1];
                        thisObj = thisObj.toLocaleLowerCase();
                        if (createClassNameSpace != "f") {
                            setObject += before + "\tvar " + thisObj + " = new (flower.UIParser.getLocalUIClass(\"" + createClassName + "\",\"" + this.namespaces[createClassNameSpace] + "\"))();\n";
                        } else {
                            setObject += before + "\tvar " + thisObj + " = new " + this.classes.f[createClassName] + "();\n";
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
                            //if (atrValue.indexOf("$moduleKey$") >= 0) {
                            //
                            //} else {
                            //
                            //}
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
                        } else if (childNameNS != "f") {
                            if (!namespaces[childNameNS]) {
                                sys.$warn(3004, childNameNS, this.parseContent);
                            }
                            childNameNS = this.namespaces[childNameNS];
                            if (this.classes[childNameNS][childName]) {
                                childClass = childName;
                            } else {
                                if (this.classes[childNameNS + "Content"][childName]) {
                                    this.parse(this.classes[childNameNS + "Content"][childName]);
                                    childClass = this.classes[childNameNS][childName];
                                } else {
                                    sys.$warn(3005, childName, this.parseContent);
                                }
                            }
                        } else {
                            if (this.classes[childNameNS]) {
                                childClass = this.classes[childNameNS][childName];
                            } else {
                                sys.$warn(3004, childNameNS, this.parseContent);
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
                                for (var n = 0; n < this.rootXML.namespaces.length; n++) {
                                    item.addNameSpace(this.rootXML.namespaces[n]);
                                }
                                var itemRenderer = new UIParser();
                                itemRenderer.loadURL = this.loadURL;
                                itemRenderer.namespaces = this.namespaces;
                                setObject += before + "\t" + thisObj + "." + childName + " = flower.UIParser.getLocalUIClass(\"" + itemRenderer.parse(item) + "\",\"" + itemRenderer.moduleName + "\");\n";
                            } else {
                                funcName = className + "_get" + itemClassName;
                                setObject += before + "\t" + thisObj + "." + childName + " = this." + funcName + "(" + thisObj + ");\n";
                                this.decodeObject(before, className, funcName, true, item, namespaces, propertyFunc, nameIndex);
                            }
                        } else {
                            funcName = className + "_get" + itemClassName;
                            setObject += before + "\t" + thisObj + "." + (UIParser.classes.addChild[createClassName] ? UIParser.classes.addChild[createClassName] : "addChild") + "(this." + funcName + "(" + thisObj + "));\n";
                            this.decodeObject(before, className, funcName, true, item, namespaces, propertyFunc, nameIndex);
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
        }, {
            key: "classDefine",
            get: function get() {
                return this.classes[this._classNameSpace][this._className];
            }
        }], [{
            key: "registerLocalUIClass",
            value: function registerLocalUIClass(name, cls) {
                var moduleName = arguments.length <= 2 || arguments[2] === undefined ? "local" : arguments[2];

                flower.UIParser.classes[moduleName][name] = cls;
            }
        }, {
            key: "setLocalUIClassContent",
            value: function setLocalUIClassContent(name, content) {
                var moduleName = arguments.length <= 2 || arguments[2] === undefined ? "local" : arguments[2];

                flower.UIParser.classes[moduleName + "Content"][name] = content;
            }
        }, {
            key: "getLocalUIClassContent",
            value: function getLocalUIClassContent(name) {
                var moduleName = arguments.length <= 1 || arguments[1] === undefined ? "local" : arguments[1];

                return flower.UIParser.classes[moduleName + "Content"] ? flower.UIParser.classes[moduleName + "Content"][name] : null;
            }
        }, {
            key: "getLocalUIClass",
            value: function getLocalUIClass(name) {
                var moduleName = arguments.length <= 1 || arguments[1] === undefined ? "local" : arguments[1];

                return this.classes[moduleName] ? this.classes[moduleName][name] : null;
            }
        }, {
            key: "setLocalUIURL",
            value: function setLocalUIURL(name, url) {
                var moduleName = arguments.length <= 2 || arguments[2] === undefined ? "local" : arguments[2];

                this.classes[moduleName + "URL"][name] = url;
                this.classes.uiModule[url] = moduleName;
                this.classes.defaultClassNames[url] = name;
            }
        }, {
            key: "addModule",
            value: function addModule(moduleName, url) {
                var packageURL = moduleName;
                if (!flower.UIParser.classes[moduleName]) {
                    var pkgs = packageURL.split(".");
                    if (pkgs[0] == "") {
                        pkgs = [];
                    }
                    flower.UIParser.classes.namespaces[url] = moduleName;
                    flower.UIParser.classes.packages[moduleName] = pkgs;
                    flower.UIParser.classes[moduleName] = {};
                    flower.UIParser.classes[moduleName + "Content"] = {};
                    flower.UIParser.classes[moduleName + "URL"] = {};
                }
            }
        }, {
            key: "setModuleBeforeScript",
            value: function setModuleBeforeScript(moduleName, beforeScript) {
                flower.UIParser.classes.beforeScripts[moduleName] = beforeScript;
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

            "ArrayValue": "flower.ArrayValue",
            "BooleanValue": "flower.BooleanValue",
            "IntValue": "flower.IntValue",
            "NumberValue": "flower.NumberValue",
            "ObjectValue": "flower.ObjectValue",
            "StringValue": "flower.StringValue",
            "UIntValue": "flower.UIntValue",

            "Label": "flower.Label",
            "Input": "flower.Input",
            "Image": "flower.Image",
            "Group": "flower.Group",
            "Button": "flower.Button",
            "Rect": "flower.Rect",
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
            "ComboBox": "flower.ComboBox",
            "Panel": "flower.Panel",
            "Alert": "flower.Alert",
            "Tree": "flower.Tree",
            "LinearLayoutBase": "flower.LinearLayoutBase",
            "HorizontalLayout": "flower.HorizontalLayout",
            "VerticalLayout": "flower.VerticalLayout",

            "Direction": "flower.Direction",
            "File": "flower.File"
        },
        local: {},
        localContent: {},
        localURL: {},
        addChild: {
            "Array": "push",
            "ArrayValue": "push"
        },
        uiModule: {},
        namespaces: {},
        defaultClassNames: {},
        packages: {
            "local": ""
        },
        beforeScripts: {}
    };


    black.UIParser = UIParser;
    //////////////////////////End File:extension/black/UIParser.js///////////////////////////

    //////////////////////////File:extension/black/DataGroup.js///////////////////////////

    var DataGroup = function (_Group2) {
        _inherits(DataGroup, _Group2);

        function DataGroup() {
            _classCallCheck(this, DataGroup);

            var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(DataGroup).call(this));

            _this14.$DataGroup = {
                0: null, //data
                1: null, //itemRenderer
                2: null, //items
                3: null, //viewer
                4: 0, //viewerWidth
                5: 0, //viewerHeight
                6: 0, //contentWidth
                7: 0, //contentHeight
                8: null, //downItem
                9: null, //selectedItem
                10: false, //itemSelectedEnabled
                11: true, //itemClickedEnabled
                12: false, //requireSelection
                13: flower.TouchEvent.TOUCH_BEGIN, //selectTime
                14: 100, //validDownStateTime
                15: 0, //touchTime
                16: null };
            //touchItemData
            _this14.addListener(flower.TouchEvent.TOUCH_RELEASE, _this14.__onTouchItem, _this14);
            return _this14;
        }

        _createClass(DataGroup, [{
            key: "__onDataUpdate",
            value: function __onDataUpdate() {
                this.$addFlags(0x4000);
                var p = this.$DataGroup;
                if (p[10] && p[0].length && this.selectedItem == null) {
                    this.__setSelectedItemData(p[0].getItemAt(0));
                }
            }
        }, {
            key: "$resetLayout",
            value: function $resetLayout() {
                if (this.$hasFlags(0x2000)) {
                    this.$removeFlags(0x2000);
                    if (this.layout && (!this.$DataGroup[3] || !this.layout.fixElementSize)) {
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
                var p = this.$DataGroup;
                if (p[3]) {
                    if (p[4] != p[3].width || p[5] != p[3].height) {
                        p[4] = p[3].width;
                        p[5] = p[3].height;
                        this.$addFlags(0x4000);
                    }
                }
                if (p[0] && p[1] && this.$hasFlags(0x4000)) {
                    this.$removeFlags(0x4000);
                    if (!p[2]) {
                        p[2] = [];
                    }
                    var items = p[2];
                    var list = p[0];
                    var newItems = [];
                    var item;
                    var itemData;
                    var measureSize = false;
                    var findSelected = false;
                    var layout = this.layout;
                    if (!p[3] || !layout || !layout.fixElementSize) {
                        for (var i = 0, len = list.length; i < len; i++) {
                            item = null;
                            itemData = list.getItemAt(i);
                            for (var f = 0; f < items.length; f++) {
                                if (items[f].data == itemData) {
                                    item = items[f];
                                    items.splice(f, 1);
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
                        }
                    } else {
                        layout.$clear();
                        var elementWidth = 0;
                        var elementHeight = 0;
                        if (p[0].length) {
                            if (!items.length) {
                                item = this.createItem(list.getItemAt(0), 0);
                                item.data = list.getItemAt(0);
                                items.push(item);
                            }
                            elementWidth = items[0].width;
                            elementHeight = items[0].height;
                        }
                        var firstItemIndex = layout.getFirstItemIndex(elementWidth, elementHeight, -this.x, -this.y);
                        firstItemIndex = firstItemIndex < 0 ? 0 : firstItemIndex;
                        for (var i = firstItemIndex; i < list.length; i++) {
                            item = null;
                            itemData = list.getItemAt(i);
                            for (var f = 0; f < items.length; f++) {
                                if (items[f].data == itemData) {
                                    item = items[f];
                                    items.splice(f, 1);
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
                            layout.updateList(p[4], p[5], firstItemIndex);
                            if (layout.isElementsOutSize(-this.x, -this.y, p[4], p[5])) {
                                break;
                            }
                        }
                    }
                    if (p[9]) {
                        findSelected = false;
                        for (var i = 0, len = list.length; i < len; i++) {
                            if (list.getItemAt(i) == p[9]) {
                                findSelected = true;
                                break;
                            }
                        }
                        if (!findSelected) {
                            p[9] = null;
                        }
                    }
                    measureSize = true;
                    while (items.length) {
                        items.pop().dispose();
                    }
                    p[2] = newItems;
                    if (!p[9]) {
                        this._canSelecteItem();
                    }
                }
                _get(Object.getPrototypeOf(DataGroup.prototype), "$onFrameEnd", this).call(this);
                if (measureSize) {
                    if (layout) {
                        if (!p[3] || !layout.fixElementSize) {
                            var size = layout.getContentSize();
                            p[6] = size.width;
                            p[7] = size.height;
                            flower.Size.release(size);
                        } else if (p[2].length) {
                            var size = layout.measureSize(p[2][0].width, p[2][0].height, list.length);
                            p[6] = size.width;
                            p[7] = size.height;
                            flower.Size.release(size);
                        }
                    }
                }
            }
        }, {
            key: "createItem",
            value: function createItem(data, index) {
                var p = this.$DataGroup;
                var item = new p[1](data);
                item.index = index;
                item.$setList(p[0]);
                item.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchItem, this);
                item.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchItem, this);
                item.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchItem, this);
                item.addListener(flower.MouseEvent.MOUSE_OVER, this.__onMouseItem, this);
                item.addListener(flower.MouseEvent.MOUSE_OUT, this.__onMouseItem, this);
                if (item.data == p[8]) {
                    if (item.data == p[9]) {
                        item.currentState = "selectedDown";
                        item.selected = true;
                    } else {
                        item.currentState = "down";
                    }
                } else {
                    if (item.data == p[9]) {
                        item.currentState = "selectedUp";
                        item.selected = true;
                    } else {
                        item.currentState = "up";
                    }
                }
                return item;
            }
        }, {
            key: "__onMouseItem",
            value: function __onMouseItem(e) {
                var p = this.$DataGroup;
                var item = e.currentTarget;
                if (item.currentState == "up" || item.currentState == "over") {
                    switch (e.type) {
                        case flower.MouseEvent.MOUSE_OVER:
                            item.currentState = "over";
                            break;
                        case flower.MouseEvent.MOUSE_OUT:
                            if (item.data == p[9]) {
                                item.currentState = "selectedUp";
                                item.selected = true;
                            } else {
                                item.currentState = "up";
                            }
                            break;
                    }
                }
            }
        }, {
            key: "__onTouchItem",
            value: function __onTouchItem(e) {
                var p = this.$DataGroup;
                var item = e.currentTarget;
                switch (e.type) {
                    case flower.TouchEvent.TOUCH_BEGIN:
                        this.dispatchWith(flower.Event.TOUCH_BEGIN_ITEM, item.data, true);
                        if (p[13] == flower.TouchEvent.TOUCH_BEGIN || p[9] == item.data) {
                            p[15] = -1;
                            if (p[10]) {
                                p[8] = item.data;
                                item.currentState = "down";
                            }
                            this.__setSelectedItemData(p[8]);
                            if (p[13] == flower.TouchEvent.TOUCH_BEGIN) {
                                if (p[11]) {
                                    item.$onClick();
                                    this.dispatchWith(flower.Event.CLICK_ITEM, item.data, true);
                                }
                            }
                        } else {
                            p[15] = flower.CoreTime.currentTime;
                            p[16] = item.data;
                            if (p[10]) {
                                p[8] = p[16];
                            }
                            flower.EnterFrame.add(this.__onTouchUpdate, this);
                        }
                        break;
                    case flower.TouchEvent.TOUCH_RELEASE:
                        flower.EnterFrame.remove(this.__onTouchUpdate, this);
                        this.$releaseItem();
                        break;
                    case flower.TouchEvent.TOUCH_END:
                        flower.EnterFrame.remove(this.__onTouchUpdate, this);
                        if (p[8] == item.data) {
                            this.$releaseItem();
                            p[8] = null;
                            if (p[13] == flower.TouchEvent.TOUCH_END) {
                                this.__setSelectedItemData(item.data);
                            }
                            if (p[11]) {
                                item.$onClick();
                                this.dispatchWith(flower.Event.CLICK_ITEM, item.data, true);
                            }
                        } else {
                            this.$releaseItem();
                        }
                        break;
                }
            }
        }, {
            key: "__onTouchUpdate",
            value: function __onTouchUpdate(timeStamp, gap) {
                var p = this.$DataGroup;
                if (timeStamp > p[15] + p[14]) {
                    flower.EnterFrame.remove(this.__onTouchUpdate, this);
                    var item = this.getItemByData(p[8]);
                    if (item) {
                        item.currentState = "down";
                    }
                    if (p[13] == flower.TouchEvent.TOUCH_BEGIN || p[9] == p[8]) {
                        this.__setSelectedItemData(p[8]);
                    }
                }
            }
        }, {
            key: "$releaseItem",
            value: function $releaseItem() {
                var p = this.$DataGroup;
                var clickItem = this.getItemByData(p[8]);
                if (clickItem) {
                    if (p[8] == p[9]) {
                        clickItem.currentState = "selectedUp";
                    } else {
                        clickItem.currentState = "up";
                    }
                }
                p[8] = null;
            }
        }, {
            key: "_canSelecteItem",
            value: function _canSelecteItem() {
                var p = this.$DataGroup;
                if (p[12] && p[10] && !p[9] && p[0] && p[0].length) {
                    this.__setSelectedItemData(p[0].getItemAt(0));
                }
            }
        }, {
            key: "__setSelectedItemData",
            value: function __setSelectedItemData(itemData) {
                var p = this.$DataGroup;
                var selectedItem = p[9];
                var changeFlag = true;
                if (itemData == selectedItem || !p[10]) {
                    changeFlag = false;
                }
                var data = p[0];
                var find = false;
                for (var i = 0, len = data.length; i < data.length; i++) {
                    if (data.getItemAt(i) == itemData) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    itemData = null;
                }
                var itemRenderer;
                if (selectedItem) {
                    itemRenderer = this.getItemByData(selectedItem);
                    if (itemRenderer) {
                        if (itemRenderer.data == p[8]) {
                            itemRenderer.currentState = "down";
                        } else {
                            itemRenderer.currentState = "up";
                        }
                        itemRenderer.selected = false;
                    }
                }
                selectedItem = p[9] = itemData;
                itemRenderer = this.getItemByData(selectedItem);
                if (itemRenderer) {
                    if (itemRenderer.data == p[8]) {
                        itemRenderer.currentState = "selectedDown";
                    } else {
                        itemRenderer.currentState = "selectedUp";
                    }
                    itemRenderer.selected = true;
                }
                if (changeFlag) {
                    this.dispatchWith(flower.Event.SELECTED_ITEM_CHANGE, itemData, true);
                }
                if (!selectedItem) {
                    this._canSelecteItem();
                }
            }
        }, {
            key: "onScroll",
            value: function onScroll() {
                this.$addFlag(0x400);
            }
        }, {
            key: "getItemByData",
            value: function getItemByData(data) {
                var items = this.$DataGroup[2];
                if (!items) {
                    return null;
                }
                for (var i = 0, len = items.length; i < len; i++) {
                    if (items[i].data == data) {
                        return items[i];
                    }
                }
                return null;
            }
        }, {
            key: "getItemDataIndex",
            value: function getItemDataIndex(data) {
                var p = this.$DataGroup;
                for (var i = 0, i = p[0].length; i < len; i++) {
                    if (p[0].getItemAt(i) == data) {
                        return i;
                    }
                }
                return -1;
            }
        }, {
            key: "$getDataProvider",
            value: function $getDataProvider() {
                return this.$DataGroup[0];
            }
        }, {
            key: "$setDataProvider",
            value: function $setDataProvider(val) {
                var p = this.$DataGroup;
                if (p[0] == val) {
                    return false;
                }
                if (p[0]) {
                    p[0].removeListener(flower.Event.UPDATE, this.__onDataUpdate, this);
                }
                this.removeAll();
                p[2] = null;
                p[0] = val;
                this.$addFlags(0x4000);
                if (p[0]) {
                    if (!p[9]) {
                        this._canSelecteItem();
                    }
                    p[0].addListener(flower.Event.UPDATE, this.__onDataUpdate, this);
                }
                this.selectedItem = null;
                if (p[10] && p[0].length) {
                    this.__setSelectedItemData(p[0].getItemAt(0));
                }
                return true;
            }

            //////////////////////////////////get&set//////////////////////////////////

        }, {
            key: "dataProvider",
            get: function get() {
                return this.$getDataProvider();
            },
            set: function set(val) {
                this.$setDataProvider(val);
            }
        }, {
            key: "itemRenderer",
            get: function get() {
                var p = this.$DataGroup;
                return p[1];
            },
            set: function set(val) {
                if (typeof val == "string") {
                    var clazz = $root[val];
                    if (!clazz) {
                        clazz = flower.UIParser.getLocalUIClass(val.split(":")[val.split(":").length - 1], val.split(":").length > 1 ? val.split(":")[0] : "");
                        if (!clazz) {
                            sys.$error(3201, val);
                        }
                    }
                    val = clazz;
                }
                var p = this.$DataGroup;
                if (p[1] == val) {
                    return;
                }
                this.removeAll();
                p[2] = null;
                p[1] = val;
                this.$addFlags(0x4000);
            }
        }, {
            key: "numElements",
            get: function get() {
                return this.$DataGroup[2].length;
            }
        }, {
            key: "viewer",
            set: function set(display) {
                this.$DataGroup[3] = display;
            },
            get: function get() {
                return this.$DataGroup[3];
            }
        }, {
            key: "contentWidth",
            get: function get() {
                return this.$DataGroup[6];
            }
        }, {
            key: "contentHeight",
            get: function get() {
                return this.$DataGroup[7];
            }
        }, {
            key: "scrollEnabled",
            get: function get() {
                return true;
            }
        }, {
            key: "selectedIndex",
            get: function get() {
                return this.getItemDataIndex(this.$DataGroup[9]);
            },
            set: function set(val) {
                var p = this.$DataGroup;
                val = +val || 0;
                var item;
                if (p[0] == null) {
                    sys.$error(3102);
                }
                if (val != -1) {
                    if (val < 0 || val >= p[0].length) {
                        sys.$error(3101, val, p[0].length);
                    }
                    item = p[0][val];
                    if (p[9] && p[9].itemIndex == val) {
                        return;
                    }
                }
                this.__setSelectedItemData(item);
            }
        }, {
            key: "selectedItem",
            get: function get() {
                return this.$DataGroup[9];
            },
            set: function set(val) {
                var p = this.$DataGroup;
                if (p[9] == val) {
                    return;
                }
                if (p[0] == null) {
                    sys.$error(3102);
                }
                var p = this.$DataGroup;
                if (p[0].getItemIndex(val) == -1) {
                    this.__setSelectedItemData(null);
                } else {
                    this.__setSelectedItemData(val);
                }
            }
        }, {
            key: "itemSelectedEnabled",
            get: function get() {
                return this.$DataGroup[10];
            },
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                if (this.$DataGroup[10] == val) {
                    return;
                }
                this.$DataGroup[10] = !!val;
                this._canSelecteItem();
            }
        }, {
            key: "itemClickedEnabled",
            get: function get() {
                return this.$DataGroup[11];
            },
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (this.$DataGroup[11] == val) {
                    return;
                }
                this.$DataGroup[11] = val;
            }
        }, {
            key: "requireSelection",
            get: function get() {
                return this.$DataGroup[12];
            },
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (val == this.$DataGroup[12]) {
                    return;
                }
                this.$DataGroup[12] = val;
                if (val) {
                    this._canSelecteItem();
                }
            }
        }, {
            key: "selectTime",
            get: function get() {
                return this.$DataGroup[13];
            },
            set: function set(val) {
                if (val != flower.TouchEvent.TOUCH_BEGIN && val != flower.TouchEvent.TOUCH_END) {
                    sys.$error(1008, val, "DataGroup", "selectTime");
                    return;
                }
                this.$DataGroup[13] = val;
            }
        }, {
            key: "validDownStateTime",
            get: function get() {
                return this.$DataGroup[14];
            }

            /**
             * 有效触摸时间，即按下多少秒之后才触发按下 item 的操作
             * @param val
             */
            ,
            set: function set(val) {
                this.$DataGroup[14] = +val * 1000 || 0;
            }
        }]);

        return DataGroup;
    }(Group);

    UIComponent.registerEvent(DataGroup, 1110, "clickItem", flower.Event.CLICK_ITEM);
    UIComponent.registerEvent(DataGroup, 1111, "selectedItemChange", flower.Event.SELECTED_ITEM_CHANGE);
    UIComponent.registerEvent(DataGroup, 1112, "touchBeginItem", flower.Event.TOUCH_BEGIN_ITEM);

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
                if (val == "false") {
                    val = false;
                }
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

            /**
             * 验证 UI 属性
             */

        }, {
            key: "$validateUIComponent",
            value: function $validateUIComponent(parent) {
                this.$removeFlags(0x1000);
                //开始验证属性
                //console.log("验证 ui 属性");
                var p = this.$UIComponent;
                if (this.$hasFlags(0x0001)) {
                    this.$getContentBounds();
                }
                parent = parent || this.parent;
                //if (this instanceof flower.Panel) {
                //    console.log("验证 ui 属性",flower.EnterFrame.frame);
                //}
                if (p[0] != null && p[1] == null && p[2] != null) {
                    this.width = (p[2] - p[0]) * 2;
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null && p[2] != null) {
                    this.width = (p[1] - p[2]) * 2;
                    this.x = 2 * p[2] - p[1];
                } else if (p[0] != null && p[1] != null) {
                    this.width = parent.width - p[1] - p[0];
                    this.x = p[0];
                } else {
                    if (p[0] != null) {
                        this.x = p[0];
                    }
                    if (p[1] != null) {
                        this.x = parent.width - p[1] - this.width;
                    }
                    if (p[2] != null) {
                        this.x = (parent.width - this.width) * 0.5 + p[2];
                    }
                    if (p[6]) {
                        this.width = parent.width * p[6] / 100;
                    }
                }
                if (p[3] != null && p[4] == null && p[5] != null) {
                    this.height = (p[5] - p[3]) * 2;
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null && p[5] != null) {
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] != null && p[4] != null) {
                    this.height = parent.height - p[4] - p[3];
                    this.y = p[3];
                } else {
                    if (p[3] != null) {
                        this.y = p[3];
                    }
                    if (p[4] != null) {
                        this.y = parent.height - p[4] - this.height;
                    }
                    if (p[5] != null) {
                        this.y = (parent.height - this.height) * 0.5 + p[5];
                    }
                    if (p[7]) {
                        this.height = parent.height * p[7] / 100;
                    }
                }
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                //    this.$validateUIComponent();
                //}
                _get(Object.getPrototypeOf(Label.prototype), "$onFrameEnd", this).call(this);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.removeAllBindProperty();
                this.$UIComponent[11].dispose();
                _get(Object.getPrototypeOf(Label.prototype), "dispose", this).call(this);
            }
        }]);

        return Label;
    }(flower.TextField);

    UIComponent.register(Label);
    Label.prototype.__UIComponent = true;
    black.Label = Label;
    //////////////////////////End File:extension/black/Label.js///////////////////////////

    //////////////////////////File:extension/black/Input.js///////////////////////////

    var Input = function (_flower$TextInput) {
        _inherits(Input, _flower$TextInput);

        function Input() {
            var text = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            _classCallCheck(this, Input);

            var _this17 = _possibleConstructorReturn(this, Object.getPrototypeOf(Input).call(this, text));

            _this17.$initUIComponent();
            _this17.$input = {
                0: null };
            return _this17;
        }

        _createClass(Input, [{
            key: "$addFlags",
            //value
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                }
                this.__flags |= flags;
            }

            /**
             * 验证 UI 属性
             */

        }, {
            key: "$validateUIComponent",
            value: function $validateUIComponent(parent) {
                this.$removeFlags(0x1000);
                //开始验证属性
                //console.log("验证 ui 属性");
                var p = this.$UIComponent;
                if (this.$hasFlags(0x0001)) {
                    this.$getContentBounds();
                }
                parent = parent || this.parent;
                //if (this instanceof flower.Panel) {
                //    console.log("验证 ui 属性",flower.EnterFrame.frame);
                //}
                if (p[0] != null && p[1] == null && p[2] != null) {
                    this.width = (p[2] - p[0]) * 2;
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null && p[2] != null) {
                    this.width = (p[1] - p[2]) * 2;
                    this.x = 2 * p[2] - p[1];
                } else if (p[0] != null && p[1] != null) {
                    this.width = parent.width - p[1] - p[0];
                    this.x = p[0];
                } else {
                    if (p[0] != null) {
                        this.x = p[0];
                    }
                    if (p[1] != null) {
                        this.x = parent.width - p[1] - this.width;
                    }
                    if (p[2] != null) {
                        this.x = (parent.width - this.width) * 0.5 + p[2];
                    }
                    if (p[6]) {
                        this.width = parent.width * p[6] / 100;
                    }
                }
                if (p[3] != null && p[4] == null && p[5] != null) {
                    this.height = (p[5] - p[3]) * 2;
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null && p[5] != null) {
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] != null && p[4] != null) {
                    this.height = parent.height - p[4] - p[3];
                    this.y = p[3];
                } else {
                    if (p[3] != null) {
                        this.y = p[3];
                    }
                    if (p[4] != null) {
                        this.y = parent.height - p[4] - this.height;
                    }
                    if (p[5] != null) {
                        this.y = (parent.height - this.height) * 0.5 + p[5];
                    }
                    if (p[7]) {
                        this.height = parent.height * p[7] / 100;
                    }
                }
            }
        }, {
            key: "$setText",
            value: function $setText(val) {
                _get(Object.getPrototypeOf(Input.prototype), "$setText", this).call(this, val);
                if (this.$input[0] && this.$input[0] instanceof flower.Value) {
                    this.$input[0].value = this.text;
                    if (this.text != this.$input[0].value + "") {
                        this.__valueChange();
                    }
                }
            }
        }, {
            key: "__valueChange",
            value: function __valueChange() {
                if (this.$input[0] != null) {
                    this.text = this.$input[0] instanceof flower.Value ? this.$input[0].value : this.$input[0];
                }
            }
        }, {
            key: "__onValueChange",
            value: function __onValueChange(e) {
                this.__valueChange();
            }

            //$onFrameEnd() {
            //    //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            //    //    this.$validateUIComponent();
            //    //}
            //    super.$onFrameEnd();
            //}

        }, {
            key: "dispose",
            value: function dispose() {
                if (this.$input[0] && this.$input[0] instanceof flower.Value) {
                    this.$input[0].removeListener(flower.Event.UPDATE, this.__onValueChange, this);
                }
                this.removeAllBindProperty();
                this.$UIComponent[11].dispose();
                _get(Object.getPrototypeOf(Input.prototype), "dispose", this).call(this);
            }
        }, {
            key: "value",
            set: function set(val) {
                if (this.$input[0] == val) {
                    return;
                }
                if (this.$input[0] && this.$input[0] instanceof flower.Value) {
                    this.$input[0].removeListener(flower.Event.UPDATE, this.__onValueChange, this);
                }
                this.$input[0] = val;
                if (this.$input[0] && this.$input[0] instanceof flower.Value) {
                    this.$input[0].addListener(flower.Event.UPDATE, this.__onValueChange, this);
                }
                this.__valueChange();
            },
            get: function get() {
                return this.$input[0];
            }
        }]);

        return Input;
    }(flower.TextInput);

    UIComponent.register(Input);
    Input.prototype.__UIComponent = true;
    black.Input = Input;

    UIComponent.registerEvent(Input, 1140, "startInput", flower.Event.START_INPUT);
    UIComponent.registerEvent(Input, 1141, "stopInput", flower.Event.STOP_INPUT);
    //////////////////////////End File:extension/black/Input.js///////////////////////////

    //////////////////////////File:extension/black/Rect.js///////////////////////////

    var Rect = function (_flower$Shape) {
        _inherits(Rect, _flower$Shape);

        function Rect() {
            _classCallCheck(this, Rect);

            var _this18 = _possibleConstructorReturn(this, Object.getPrototypeOf(Rect).call(this));

            _this18.$Rect = {
                0: 0, //width
                1: 0 };
            //height
            _this18.$initUIComponent();
            return _this18;
        }

        _createClass(Rect, [{
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                }
                if (flags == 0x0002) {
                    this.__flags |= 0x0400;
                }
                this.__flags |= flags;
            }

            /**
             * 验证 UI 属性
             */

        }, {
            key: "$validateUIComponent",
            value: function $validateUIComponent(parent) {
                this.$removeFlags(0x1000);
                //开始验证属性
                //console.log("验证 ui 属性");
                var p = this.$UIComponent;
                if (this.$hasFlags(0x0001)) {
                    this.$getContentBounds();
                }
                parent = parent || this.parent;
                //if (this instanceof flower.Panel) {
                //    console.log("验证 ui 属性",flower.EnterFrame.frame);
                //}
                if (p[0] != null && p[1] == null && p[2] != null) {
                    this.width = (p[2] - p[0]) * 2;
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null && p[2] != null) {
                    this.width = (p[1] - p[2]) * 2;
                    this.x = 2 * p[2] - p[1];
                } else if (p[0] != null && p[1] != null) {
                    this.width = parent.width - p[1] - p[0];
                    this.x = p[0];
                } else {
                    if (p[0] != null) {
                        this.x = p[0];
                    }
                    if (p[1] != null) {
                        this.x = parent.width - p[1] - this.width;
                    }
                    if (p[2] != null) {
                        this.x = (parent.width - this.width) * 0.5 + p[2];
                    }
                    if (p[6]) {
                        this.width = parent.width * p[6] / 100;
                    }
                }
                if (p[3] != null && p[4] == null && p[5] != null) {
                    this.height = (p[5] - p[3]) * 2;
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null && p[5] != null) {
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] != null && p[4] != null) {
                    this.height = parent.height - p[4] - p[3];
                    this.y = p[3];
                } else {
                    if (p[3] != null) {
                        this.y = p[3];
                    }
                    if (p[4] != null) {
                        this.y = parent.height - p[4] - this.height;
                    }
                    if (p[5] != null) {
                        this.y = (parent.height - this.height) * 0.5 + p[5];
                    }
                    if (p[7]) {
                        this.height = parent.height * p[7] / 100;
                    }
                }
            }
        }, {
            key: "$setFillColor",
            value: function $setFillColor(val) {
                if (_get(Object.getPrototypeOf(Rect.prototype), "$setFillColor", this).call(this, val)) {
                    this.$resetRect();
                }
            }
        }, {
            key: "$setFillAlpha",
            value: function $setFillAlpha(val) {
                if (_get(Object.getPrototypeOf(Rect.prototype), "$setFillAlpha", this).call(this, val)) {
                    this.$resetRect();
                }
            }
        }, {
            key: "$setLineWidth",
            value: function $setLineWidth(val) {
                if (_get(Object.getPrototypeOf(Rect.prototype), "$setLineWidth", this).call(this, val)) {
                    this.$resetRect();
                }
            }
        }, {
            key: "$setLineColor",
            value: function $setLineColor(val) {
                if (_get(Object.getPrototypeOf(Rect.prototype), "$setLineColor", this).call(this, val)) {
                    this.$resetRect();
                }
            }
        }, {
            key: "$setLineAlpha",
            value: function $setLineAlpha(val) {
                if (_get(Object.getPrototypeOf(Rect.prototype), "$setLineAlpha", this).call(this, val)) {
                    this.$resetRect();
                }
            }
        }, {
            key: "$setWidth",
            value: function $setWidth(val) {
                val = +val || 0;
                var p = this.$Rect;
                if (p[0] == val) {
                    return;
                }
                p[0] = val;
                this.$resetRect();
            }
        }, {
            key: "$resetRect",
            value: function $resetRect() {
                var p = this.$Shape;
                if (p[9].length == 0) {
                    p[9].push({});
                }
                var width = this.$Rect[0];
                var height = this.$Rect[1];
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
                var p = this.$Rect;
                if (p[1] == val) {
                    return;
                }
                p[1] = val;
                this.$resetRect();
            }
        }, {
            key: "$onFrameEnd",
            value: function $onFrameEnd() {
                if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
                    this.$validateUIComponent();
                }
                _get(Object.getPrototypeOf(Rect.prototype), "$onFrameEnd", this).call(this);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.removeAllBindProperty();
                this.$UIComponent[11].dispose();
                _get(Object.getPrototypeOf(Rect.prototype), "dispose", this).call(this);
            }
        }]);

        return Rect;
    }(flower.Shape);

    UIComponent.register(Rect);
    Rect.prototype.__UIComponent = true;
    black.Rect = Rect;
    //////////////////////////End File:extension/black/Rect.js///////////////////////////

    //////////////////////////File:extension/black/Image.js///////////////////////////

    var Image = function (_flower$Bitmap) {
        _inherits(Image, _flower$Bitmap);

        function Image() {
            var source = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _classCallCheck(this, Image);

            var _this19 = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this));

            _this19.$initUIComponent();
            _this19.source = source;
            return _this19;
        }

        _createClass(Image, [{
            key: "$addFlags",
            value: function $addFlags(flags) {
                if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
                    this.__flags |= 0x1000;
                }
                this.__flags |= flags;
            }

            /**
             * 验证 UI 属性
             */

        }, {
            key: "$validateUIComponent",
            value: function $validateUIComponent(parent) {
                this.$removeFlags(0x1000);
                //开始验证属性
                //console.log("验证 ui 属性");
                var p = this.$UIComponent;
                if (this.$hasFlags(0x0001)) {
                    this.$getContentBounds();
                }
                parent = parent || this.parent;
                //if (this instanceof flower.Panel) {
                //    console.log("验证 ui 属性",flower.EnterFrame.frame);
                //}
                if (p[0] != null && p[1] == null && p[2] != null) {
                    this.width = (p[2] - p[0]) * 2;
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null && p[2] != null) {
                    this.width = (p[1] - p[2]) * 2;
                    this.x = 2 * p[2] - p[1];
                } else if (p[0] != null && p[1] != null) {
                    this.width = parent.width - p[1] - p[0];
                    this.x = p[0];
                } else {
                    if (p[0] != null) {
                        this.x = p[0];
                    }
                    if (p[1] != null) {
                        this.x = parent.width - p[1] - this.width;
                    }
                    if (p[2] != null) {
                        this.x = (parent.width - this.width) * 0.5 + p[2];
                    }
                    if (p[6]) {
                        this.width = parent.width * p[6] / 100;
                    }
                }
                if (p[3] != null && p[4] == null && p[5] != null) {
                    this.height = (p[5] - p[3]) * 2;
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null && p[5] != null) {
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] != null && p[4] != null) {
                    this.height = parent.height - p[4] - p[3];
                    this.y = p[3];
                } else {
                    if (p[3] != null) {
                        this.y = p[3];
                    }
                    if (p[4] != null) {
                        this.y = parent.height - p[4] - this.height;
                    }
                    if (p[5] != null) {
                        this.y = (parent.height - this.height) * 0.5 + p[5];
                    }
                    if (p[7]) {
                        this.height = parent.height * p[7] / 100;
                    }
                }
            }
        }, {
            key: "$setSource",
            value: function $setSource(val) {
                if (this.__source == val) {
                    return;
                }
                this.__source = val;
                if (val == "" || val == null) {
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
                    this.__loader.addListener(flower.Event.ERROR, this.__onLoadError, this);
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

            //$onFrameEnd() {
            //    //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            //    //    this.$validateUIComponent();
            //    //}
            //    super.$onFrameEnd();
            //}

        }, {
            key: "dispose",
            value: function dispose() {
                if (this.__loader) {
                    this.__loader.dispose();
                }
                this.removeAllBindProperty();
                this.$UIComponent[11].dispose();
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

    UIComponent.registerEvent(Image, 1300, "loadComplete", flower.Event.COMPLETE);
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

        function MaskUI(data) {
            _classCallCheck(this, MaskUI);

            var _this21 = _possibleConstructorReturn(this, Object.getPrototypeOf(MaskUI).call(this));

            if (data != null) {
                _this21._data = data;
            }
            _this21.$initUIComponent();
            return _this21;
        }

        _createClass(MaskUI, [{
            key: "setData",
            value: function setData(val) {
                if (val && typeof val == "string") {
                    val = flower.DataManager.getInstance().createData(val);
                }
                if (this._data == val) {
                    return false;
                }
                this._data = val;
                if (this.$UIComponent) {
                    flower.Binding.changeData(this);
                }
                return true;
            }
        }, {
            key: "$createShape",
            value: function $createShape() {
                var shape = new Rect();
                shape.percentWidth = 100;
                shape.percentHeight = 100;
                return shape;
            }

            /**
             * 验证 UI 属性
             */

        }, {
            key: "$validateUIComponent",
            value: function $validateUIComponent(parent) {
                this.$removeFlags(0x1000);
                //开始验证属性
                var p = this.$UIComponent;
                if (this.$hasFlags(0x0001)) {
                    this.$getContentBounds();
                }
                parent = parent || this.parent;
                if (p[0] != null && p[1] == null && p[2] != null) {
                    this.width = (p[2] - p[0]) * 2;
                    this.x = +p[0];
                } else if (p[0] == null && p[1] != null && p[2] != null) {
                    this.width = (p[1] - p[2]) * 2;
                    this.x = +2 * p[2] - p[1];
                } else if (p[0] != null && p[1] != null) {
                    this.width = parent.width - p[1] - p[0];
                    this.x = +p[0];
                } else {
                    if (p[0] != null) {
                        this.x = p[0];
                    }
                    if (p[1] != null) {
                        this.x = parent.width - p[1] - this.width;
                    }
                    if (p[2] != null) {
                        this.x = (parent.width - this.width) * 0.5 + p[2];
                    }
                    if (p[6]) {
                        this.width = parent.width * p[6] / 100;
                    }
                }
                if (p[3] != null && p[4] == null && p[5] != null) {
                    this.height = (p[5] - p[3]) * 2;
                    this.y = +p[3];
                } else if (p[3] == null && p[4] != null && p[5] != null) {
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] != null && p[4] != null) {
                    this.height = parent.height - p[4] - p[3];
                    this.y = +p[3];
                } else {
                    if (p[3] != null) {
                        this.y = p[3];
                    }
                    if (p[4] != null) {
                        this.y = parent.height - p[4] - this.height;
                    }
                    if (p[5] != null) {
                        this.y = (parent.height - this.height) * 0.5 + p[5];
                    }
                    if (p[7]) {
                        this.height = parent.height * p[7] / 100;
                    }
                }
                this.$validateChildrenUIComponent();
            }
        }, {
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
                if (!this.parent.__UIComponent) {
                    var flag = false;
                    var count = 6;
                    while (count && this.$hasFlags(0x1000)) {
                        this.$validateUIComponent();
                        _get(Object.getPrototypeOf(MaskUI.prototype), "$onFrameEnd", this).call(this);
                        this.shape.$onFrameEnd();
                        this.$resetLayout();
                        flag = true;
                        count--;
                    }
                    if (!flag) {
                        _get(Object.getPrototypeOf(MaskUI.prototype), "$onFrameEnd", this).call(this);
                        this.shape.$onFrameEnd();
                        this.$resetLayout();
                    }
                    while (count && this.$hasFlags(0x1000)) {
                        this.$validateUIComponent();
                        _get(Object.getPrototypeOf(MaskUI.prototype), "$onFrameEnd", this).call(this);
                        this.shape.$onFrameEnd();
                        this.$resetLayout();
                        flag = true;
                        count--;
                    }
                } else {
                    _get(Object.getPrototypeOf(MaskUI.prototype), "$onFrameEnd", this).call(this);
                    this.shape.$onFrameEnd();
                    this.$resetLayout();
                }
            }
        }, {
            key: "dispose",
            value: function dispose() {
                flower.Binding.removeChangeObject(this);
                this.removeAllBindProperty();
                this.$UIComponent[11].dispose();
                _get(Object.getPrototypeOf(MaskUI.prototype), "dispose", this).call(this);
            }
        }, {
            key: "data",
            get: function get() {
                return this._data;
            },
            set: function set(val) {
                this.setData(val);
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

            var _this22 = _possibleConstructorReturn(this, Object.getPrototypeOf(Button).call(this));

            _this22._enabled = true;

            _this22.absoluteState = true;
            _this22.currentState = "up";

            _this22.addListener(flower.TouchEvent.TOUCH_BEGIN, _this22.__onTouch, _this22);
            _this22.addListener(flower.TouchEvent.TOUCH_END, _this22.__onTouch, _this22);
            _this22.addListener(flower.TouchEvent.TOUCH_RELEASE, _this22.__onTouch, _this22);
            _this22.addListener(flower.MouseEvent.MOUSE_OVER, _this22.__onMouse, _this22);
            _this22.addListener(flower.MouseEvent.MOUSE_OUT, _this22.__onMouse, _this22);
            _this22.addListener(flower.Event.REMOVED, _this22.__onRemoved, _this22);
            return _this22;
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
            key: "__onMouse",
            value: function __onMouse(e) {
                if (this.currentState == "up" || this.currentState == "over") {
                    switch (e.type) {
                        case flower.MouseEvent.MOUSE_OVER:
                            this.currentState = "over";
                            break;
                        case flower.MouseEvent.MOUSE_OUT:
                            this.currentState = "up";
                            break;
                    }
                }
            }
        }, {
            key: "__onRemoved",
            value: function __onRemoved(e) {
                this.currentState = "up";
            }
        }, {
            key: "__setEnabled",
            value: function __setEnabled(val) {
                if (val == "false") {
                    val = false;
                }
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
            key: "enabled",
            set: function set(val) {
                this.__setEnabled(val);
            },
            get: function get() {
                return this._enabled;
            }
        }]);

        return Button;
    }(Group);

    UIComponent.registerEvent(Button, 1100, "click", flower.TouchEvent.TOUCH_END);

    black.Button = Button;
    //////////////////////////End File:extension/black/Button.js///////////////////////////

    //////////////////////////File:extension/black/ToggleButton.js///////////////////////////

    var ToggleButton = function (_Button) {
        _inherits(ToggleButton, _Button);

        function ToggleButton() {
            _classCallCheck(this, ToggleButton);

            var _this23 = _possibleConstructorReturn(this, Object.getPrototypeOf(ToggleButton).call(this));

            _this23.$ToggleButton = {
                0: false, //
                1: null };
            return _this23;
        }

        _createClass(ToggleButton, [{
            key: "__onTouch",
            //value
            value: function __onTouch(e) {
                if (!this.enabled) {
                    e.stopPropagation();
                    return;
                }
                var p = this.$ToggleButton;
                switch (e.type) {
                    case flower.TouchEvent.TOUCH_BEGIN:
                        if (p[0]) {
                            this.currentState = "selectedDown";
                        } else {
                            this.currentState = "selectedUp";
                        }
                        break;
                    case flower.TouchEvent.TOUCH_END:
                    case flower.TouchEvent.TOUCH_RELEASE:
                        if (e.type == flower.TouchEvent.TOUCH_END) {
                            this.selected = !this.selected;
                        }
                        if (p[0]) {
                            this.currentState = "down";
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
                if (val == false && this.$ToggleButton[0]) {
                    this.selected = false;
                }
            }
        }, {
            key: "__setSelected",
            value: function __setSelected(val) {
                var p = this.$ToggleButton;
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (!this.enabled || val == p[0]) {
                    return;
                }
                p[0] = val;
                if (p[1] && p[1] instanceof flower.Value) {
                    p[1].value = val;
                    if (p[0] != p[1].value) {
                        this.__valueChange();
                    }
                }
                if (val) {
                    this.currentState = "down";
                } else {
                    this.currentState = "up";
                }
                this.dispatchWith(flower.Event.CHANGE);
            }
        }, {
            key: "__valueChange",
            value: function __valueChange() {
                var p = this.$ToggleButton;
                if (p[1]) {
                    this.selected = p[1] instanceof flower.Value ? p[1].value : p[1];
                }
            }
        }, {
            key: "__onValueChange",
            value: function __onValueChange(e) {
                this.__valueChange();
            }
        }, {
            key: "selected",
            get: function get() {
                return this.$ToggleButton[0];
            },
            set: function set(val) {
                this.__setSelected(val);
            }
        }, {
            key: "value",
            set: function set(val) {
                var p = this.$ToggleButton;
                if (p[1] == val) {
                    return;
                }
                if (p[1] && p[1] instanceof flower.Value) {
                    p[1].removeListener(flower.Event.UPDATE, this.__onValueChange, this);
                }
                p[1] = val;
                if (p[1] && p[1] instanceof flower.Value) {
                    p[1].addListener(flower.Event.UPDATE, this.__onValueChange, this);
                }
                this.__valueChange();
            },
            get: function get() {
                return this.$ToggleButton[1];
            }
        }]);

        return ToggleButton;
    }(Button);

    black.ToggleButton = ToggleButton;

    UIComponent.registerEvent(ToggleButton, 1402, "change", flower.Event.CHANGE);
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
                this.dispatchWith(flower.Event.CHANGE);
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

    UIComponent.registerEvent(RadioButton, 1401, "change", flower.Event.CHANGE);
    //////////////////////////End File:extension/black/RadioButton.js///////////////////////////

    //////////////////////////File:extension/black/RadioButtonGroup.js///////////////////////////

    var RadioButtonGroup = function (_Group6) {
        _inherits(RadioButtonGroup, _Group6);

        function RadioButtonGroup(groupName) {
            _classCallCheck(this, RadioButtonGroup);

            var _this26 = _possibleConstructorReturn(this, Object.getPrototypeOf(RadioButtonGroup).call(this));

            _this26._buttons = [];
            _this26._enabled = true;

            if (groupName == null || groupName == "") {
                groupName = "group" + _this26.id;
            }
            _this26._groupName = groupName;
            RadioButtonGroup.groups.push(_this26);
            return _this26;
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
                this.dispatchWith(flower.Event.CHANGE);
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
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (this._enabled == val) {
                    return;
                }
                this._enabled = val;
                for (var i = 0; i < this._buttons.length; i++) {
                    this._buttons[i].enabled = this._enabled;
                }
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

    UIComponent.registerEvent(RadioButtonGroup, 1400, "change", flower.Event.CHANGE);
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

            var _this28 = _possibleConstructorReturn(this, Object.getPrototypeOf(ListBase).call(this));

            _this28.requireSelection = true;
            _this28.itemSelectedEnabled = true;
            _this28.itemClickedEnabled = true;
            return _this28;
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

            var _this29 = _possibleConstructorReturn(this, Object.getPrototypeOf(List).call(this));

            _this29.layout = new VerticalLayout();
            return _this29;
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

            var _this30 = _possibleConstructorReturn(this, Object.getPrototypeOf(TabBar).call(this));

            _this30.$TabBar = {
                0: false, //more
                1: null, //moreButton
                2: null, //moreData
                3: null };
            //moreList
            _this30.layout = new HorizontalLayout();
            _this30.layout.fixElementSize = false;
            return _this30;
        }

        _createClass(TabBar, [{
            key: "$setDataProvider",
            value: function $setDataProvider(val) {
                var d = this.dataProvider;
                if (_get(Object.getPrototypeOf(TabBar.prototype), "$setDataProvider", this).call(this, val)) {
                    if (d) {
                        d.removeListener(flower.Event.CHANGE, this.__onDataProviderSelectedChange, this);
                    }
                    if (val && val instanceof flower.ViewStack) {
                        val.addListener(flower.Event.CHANGE, this.__onDataProviderSelectedChange, this);
                    }
                }
            }
        }, {
            key: "__onDataProviderSelectedChange",
            value: function __onDataProviderSelectedChange(e) {
                this.selectedItem = this.dataProvider.selectedChild;
            }
        }, {
            key: "__setSelectedItemData",
            value: function __setSelectedItemData(item) {
                _get(Object.getPrototypeOf(TabBar.prototype), "__setSelectedItemData", this).call(this, item);
                if (this.dataProvider instanceof flower.ViewStack) {
                    this.dataProvider.selectedChild = this.selectedItem;
                }
            }
        }, {
            key: "showMore",
            value: function showMore(e) {
                var p = this.$TabBar;
                var moreList = p[3];
                if (moreList) {
                    var point = this.moreButton.localToGlobal();
                    moreList.x = point.x;
                    moreList.y = point.y + this.moreButton.height;
                    flower.MenuManager.showMenu(moreList);
                }
            }
        }, {
            key: "more",
            get: function get() {
                return this.$TabBar[0];
            },
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (this.$TabBar[0] == val) {
                    return;
                }
                this.$TabBar[0] = val;
                if (!this.$TabBar[2]) {
                    this.$TabBar[2] = new flower.ArrayValue();
                }
                this.$invalidateContentBounds();
            }
        }, {
            key: "moreData",
            get: function get() {
                if (!this.$TabBar[2]) {
                    this.$TabBar[2] = new flower.ArrayValue();
                }
                return this.$TabBar[2];
            }
        }, {
            key: "moreButton",
            get: function get() {
                return this.$TabBar[1];
            },
            set: function set(val) {
                if (this.$TabBar[1] == val) {
                    return;
                }
                if (this.$TabBar[1]) {
                    this.$TabBar[1].removeListener(flower.TouchEvent.TOUCH_END, this.showMore, this);
                    if (this.$TabBar[1].parent == this) {
                        this.removeChild(this.$TabBar[1]);
                    }
                }
                this.$TabBar[1] = val;
                if (this.$TabBar[1]) {
                    this.$TabBar[1].addListener(flower.TouchEvent.TOUCH_END, this.showMore, this);
                }
                this.$invalidateContentBounds();
            }
        }, {
            key: "moreList",
            get: function get() {
                return this.$TabBar[3];
            },
            set: function set(val) {
                if (this.$TabBar[3] == val) {
                    return;
                }
                this.$TabBar[3] = val;
                val.dataProvider = this.moreData;
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

            var _this31 = _possibleConstructorReturn(this, Object.getPrototypeOf(ViewStack).call(this));

            _this31._items = [];
            _this31._selectedIndex = -1;
            return _this31;
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
                this.dispatchWith(flower.Event.UPDATE);
                if (this._selectedIndex < 0) {
                    this._setSelectedIndex(0);
                }
                if (!find) {
                    this.dispatchWith(flower.Event.ADDED, display);
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
                this.dispatchWith(flower.Event.UPDATE);
                if (this._selectedIndex < 0) {
                    this._setSelectedIndex(0);
                }
                if (!find) {
                    this.dispatchWith(flower.Event.ADDED, display);
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
                            this.dispatchWith(flower.Event.UPDATE);
                            this.dispatchWith(flower.Event.REMOVED, display);
                        }
                        return display;
                    }
                }
                return null;
            }
        }, {
            key: "$removeChild",
            value: function $removeChild(display) {
                _get(Object.getPrototypeOf(ViewStack.prototype), "$removeChild", this).call(this, display);
                this.removeChild(display);
            }
        }, {
            key: "removeChildAt",
            value: function removeChildAt(index) {
                var display = this._items.splice(index, 1)[0];
                if (display == this._selectedItem) {
                    this._selectedItem = this._items[0];
                    this._selectedIndex = 0;
                    _get(Object.getPrototypeOf(ViewStack.prototype), "removeChild", this).call(this, display);
                    this.dispatchWith(flower.Event.UPDATE);
                    this.dispatchWith(flower.Event.REMOVED, display);
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
                        this.dispatchWith(flower.Event.UPDATE);
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
                this.dispatchWith(flower.Event.UPDATE);
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
                this.dispatchWith(flower.Event.CHANGE, this._selectedItem);
                this.dispatchWith(flower.Event.UPDATE);
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
            key: "setItemIndex",
            value: function setItemIndex(item, index) {
                var itemIndex = this.getItemIndex(item);
                if (itemIndex < 0 || itemIndex == index) {
                    return;
                }
                this._items.splice(itemIndex, 1);
                if (this._selectedIndex != -1 && this._selectedIndex > itemIndex) {
                    this._selectedIndex--;
                }
                this._items.splice(index, 0, item);
                if (this._selectedIndex != -1 && this._selectedIndex >= index) {
                    this._selectedIndex++;
                }
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
            key: "selectedChild",
            set: function set(val) {
                var index = this.getChildIndex(val);
                this._setSelectedIndex(index);
            },
            get: function get() {
                return this._selectedItem;
            }
        }]);

        return ViewStack;
    }(Group);

    black.ViewStack = ViewStack;

    UIComponent.registerEvent(ViewStack, 1500, "selectedItemChange", flower.Event.CHANGE);
    //////////////////////////End File:extension/black/ViewStack.js///////////////////////////

    //////////////////////////File:extension/black/Scroller.js///////////////////////////

    var Scroller = function (_MaskUI) {
        _inherits(Scroller, _MaskUI);

        function Scroller() {
            _classCallCheck(this, Scroller);

            var _this32 = _possibleConstructorReturn(this, Object.getPrototypeOf(Scroller).call(this));

            _this32._viewSize = flower.Size.create(0, 0);
            _this32._scrollDisX = [];
            _this32._scrollDisY = [];
            _this32._scrollTime = [];
            _this32._upGap = 18;

            _this32.addListener(flower.TouchEvent.TOUCH_BEGIN, _this32.__onTouchScroller, _this32);
            _this32.addListener(flower.TouchEvent.TOUCH_MOVE, _this32.__onTouchScroller, _this32);
            _this32.addListener(flower.TouchEvent.TOUCH_END, _this32.__onTouchScroller, _this32);
            _this32.addListener(flower.TouchEvent.TOUCH_RELEASE, _this32.__onTouchScroller, _this32);
            _this32.width = _this32.height = 100;
            //var bg = new Rect();
            //bg.fillColor = 0x555555;
            //bg.percentWidth = 100;
            //bg.percentHeight = 100;
            //this.addChild(bg);
            return _this32;
        }

        _createClass(Scroller, [{
            key: "$createShape",
            value: function $createShape() {
                var shape = new Rect();
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
                if (typeof val == "string") {
                    var clazz = $root[val];
                    if (!clazz) {
                        clazz = flower.UIParser.getLocalUIClass(val.split(":")[val.split(":").length - 1], val.split(":").length > 1 ? val.split(":")[0] : "");
                        if (!clazz) {
                            sys.$error(3201, val);
                        }
                    }
                    val = new clazz();
                }
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

    //////////////////////////File:extension/black/ComboBox.js///////////////////////////

    var ComboBox = function (_Group8) {
        _inherits(ComboBox, _Group8);

        function ComboBox() {
            _classCallCheck(this, ComboBox);

            var _this33 = _possibleConstructorReturn(this, Object.getPrototypeOf(ComboBox).call(this));

            _this33.$comboBox = {
                0: null, //label
                1: null, //button
                2: null, //list
                3: false, //openFlags
                4: "label", //labelField
                5: null, //dataProvider
                6: "type", //valueField
                7: null, //value
                8: null, //selectedItem
                9: false //inSettingValue
            };
            return _this33;
        }

        _createClass(ComboBox, [{
            key: "__onClickButton",
            value: function __onClickButton(e) {
                this.isOpen = !this.isOpen;
            }
        }, {
            key: "__listRemoved",
            value: function __listRemoved(e) {
                this.$comboBox[3] = false;
            }
        }, {
            key: "__listSelectItemChange",
            value: function __listSelectItemChange(e) {
                var p = this.$comboBox;
                if (p[9]) {
                    return;
                }
                p[8] = e.data;
                if (p[0]) {
                    if (p[8] && p[8][p[4]]) {
                        p[0].text = p[8][p[4]];
                    } else {
                        p[0].text = "";
                    }
                }
                if (e) {
                    this.dispatch(e);
                }
                if (p[6] && p[7] && p[8]) {
                    if (p[7] instanceof flower.Value) {
                        p[7].value = p[8][p[6]];
                    }
                }
            }
        }, {
            key: "__listClickItem",
            value: function __listClickItem(e) {
                flower.MenuManager.hideMenu();
            }
        }, {
            key: "__typeValueChange",
            value: function __typeValueChange() {
                var p = this.$comboBox;
                if (p[6] && p[7]) {
                    var array = p[5];
                    var value = p[7] instanceof flower.Value ? p[7].value : p[7];
                    this.selectedItem = array.getItemWith(p[6], value);
                }
            }
        }, {
            key: "__onTypeValueChange",
            value: function __onTypeValueChange(e) {
                this.__typeValueChange();
            }
        }, {
            key: "label",
            set: function set(val) {
                var p = this.$comboBox;
                if (p[0] == val) {
                    return;
                }
                p[0] = val;
                if (val) {
                    val.touchEnabled = false;
                    if (val.parent != this) {
                        this.addChild(val);
                    }
                }
                if (p[0]) {
                    if (p[8] && p[8][p[4]]) {
                        p[0].text = p[8][p[4]];
                    } else {
                        p[0].text = "";
                    }
                }
            },
            get: function get() {
                return this.$comboBox[0];
            }
        }, {
            key: "button",
            set: function set(val) {
                var p = this.$comboBox;
                if (p[1] == val) {
                    return;
                }
                if (p[1]) {
                    p[1].removeListener(flower.TouchEvent.TOUCH_END, this.__onClickButton, this);
                }
                p[1] = val;
                if (val) {
                    val.addListener(flower.TouchEvent.TOUCH_END, this.__onClickButton, this);
                    if (val.parent != this) {
                        this.addChild(val);
                    }
                }
            },
            get: function get() {
                return this.$comboBox[1];
            }
        }, {
            key: "list",
            set: function set(val) {
                var p = this.$comboBox;
                if (p[2] == val) {
                    return;
                }
                if (p[2]) {
                    p[2].removeListener(flower.Event.REMOVED, this.__listRemoved, this);
                    p[2].removeListener(flower.Event.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
                    p[2].removeListener(flower.Event.CLICK_ITEM, this.__listClickItem, this);
                }
                p[2] = val;
                if (val) {
                    val.dataProvider = p[5];
                    if (p[8]) {
                        val.selectedItem = p[8];
                    }
                    val.addListener(flower.Event.REMOVED, this.__listRemoved, this);
                    val.addListener(flower.Event.SELECTED_ITEM_CHANGE, this.__listSelectItemChange, this);
                    val.addListener(flower.Event.CLICK_ITEM, this.__listClickItem, this);
                }
            },
            get: function get() {
                return this.$comboBox[2];
            }
        }, {
            key: "isOpen",
            get: function get() {
                return this.$comboBox[3];
            },
            set: function set(val) {
                if (val == "false") {
                    val = false;
                }
                val = !!val;
                if (val == this.$comboBox[3]) {
                    return;
                }
                this.$comboBox[3] = val;
                if (val) {
                    var list = this.$comboBox[2];
                    if (this.stage && list) {
                        var point = flower.Point.create();
                        this.localToGlobal(point);
                        flower.Point.release(point);
                        flower.MenuManager.showMenu(list, point.x, point.y + this.height, false);
                    }
                } else {}
            }
        }, {
            key: "labelField",
            get: function get() {
                return this.$comboBox[4];
            },
            set: function set(val) {
                this.$comboBox[4] = val;
                if (p[0]) {
                    if (p[8] && p[8][p[4]]) {
                        p[0].text = p[8][p[4]];
                    } else {
                        p[0].text = "";
                    }
                }
            }
        }, {
            key: "valueField",
            get: function get() {
                return this.$comboBox[6];
            },
            set: function set(val) {
                if (this.$comboBox[6] == val) {
                    return;
                }
                this.$comboBox[6] = val;
                this.__typeValueChange();
            }
        }, {
            key: "value",
            get: function get() {
                return this.$comboBox[7];
            },
            set: function set(val) {
                var p = this.$comboBox;
                if (p[7] == val) {
                    return;
                }
                if (p[7] && p[7] instanceof flower.Value) {
                    p[7].removeListener(flower.Event.UPDATE, this.__onTypeValueChange, this);
                }
                p[7] = val;
                if (p[7]) {
                    p[9] = true;
                    if (p[7] instanceof flower.Value) {
                        p[7].addListener(flower.Event.UPDATE, this.__onTypeValueChange, this);
                        if (p[7].enumList) {
                            this.dataProvider = new flower.ArrayValue(p[7].enumList);
                        }
                    }
                    p[9] = false;
                    this.__typeValueChange();
                }
            }
        }, {
            key: "dataProvider",
            get: function get() {
                return this.$comboBox[5];
            },
            set: function set(val) {
                var p = this.$comboBox;
                if (p[5] == val) {
                    return;
                }
                p[5] = val;
                if (!p[9]) {
                    if (p[5] == null || p[5].length == 0) {
                        p[8] = null;
                    } else {
                        p[8] = p[5][0];
                    }
                }
                if (this.list) {
                    this.list.dataProvider = p[5];
                    if (!p[9] && this.list && p[8]) {
                        this.list.selectedItem = p[8];
                    }
                }
            }
        }, {
            key: "selectedItem",
            get: function get() {
                return this.$comboBox[8];
            },
            set: function set(val) {
                var p = this.$comboBox;
                if (p[8] == val) {
                    return;
                }
                if (p[5] == null) {
                    sys.$error(3102);
                }
                var array = p[5];
                var index = array.getItemIndex(val);
                if (index == -1) {
                    p[8] = null;
                    if (this.list) {
                        this.list.selectedItem = null;
                    }
                    if (p[0]) {
                        p[0].text = "";
                    }
                } else {
                    p[8] = val;
                    if (this.list) {
                        this.list.selectedItem = val;
                    }
                    if (p[0]) {
                        if (p[8] && p[8][p[4]]) {
                            p[0].text = p[8][p[4]];
                        } else {
                            p[0].text = "";
                        }
                    }
                }
            }
        }, {
            key: "selectedIndex",
            get: function get() {
                var p = this.$comboBox;
                return p[5] == null ? -1 : p[5].getItemIndex(p[8]);
            },
            set: function set(val) {
                var p = this.$comboBox;
                var item;
                if (p[5] == null) {
                    sys.$error(3102);
                }
                if (val != -1) {
                    if (val < 0 || val >= p[5].length) {
                        sys.$error(3101, val, p[0].length);
                    }
                    item = p[5][val];
                }
                this.selectedItem = item;
            }
        }]);

        return ComboBox;
    }(Group);

    black.ComboBox = ComboBox;
    //////////////////////////End File:extension/black/ComboBox.js///////////////////////////

    //////////////////////////File:extension/black/Panel.js///////////////////////////

    var Panel = function (_Group9) {
        _inherits(Panel, _Group9);

        function Panel() {
            _classCallCheck(this, Panel);

            var _this34 = _possibleConstructorReturn(this, Object.getPrototypeOf(Panel).call(this));

            _this34.$Panel = {
                0: "", //title
                1: null, //titleLabel
                2: null, //closeButton
                3: PanelScaleMode.NO_SCALE, //scaleMode
                4: null, //iconImage
                5: "" };
            return _this34;
        }

        _createClass(Panel, [{
            key: "__changeTitle",
            //icon
            value: function __changeTitle() {
                var p = this.$Panel;
                if (p[0] && p[1]) {
                    p[1].text = p[0];
                }
            }

            /**
             * 验证 UI 属性
             */

        }, {
            key: "$validateUIComponent",
            value: function $validateUIComponent(parent) {
                this.$removeFlags(0x1000);
                //开始验证属性
                //console.log("验证 ui 属性");
                var p = this.$UIComponent;
                if (this.$hasFlags(0x0001)) {
                    this.$getContentBounds();
                }
                parent = parent || this.parent;
                //console.log("验证 ui 属性",flower.EnterFrame.frame);
                if (p[0] != null && p[1] == null && p[2] != null) {
                    this.width = (p[2] - p[0]) * 2;
                    this.x = p[0];
                } else if (p[0] == null && p[1] != null && p[2] != null) {
                    this.width = (p[1] - p[2]) * 2;
                    this.x = 2 * p[2] - p[1];
                } else if (p[0] != null && p[1] != null) {
                    this.width = parent.width - p[1] - p[0];
                    this.x = p[0];
                } else {
                    if (p[0] != null) {
                        this.x = p[0];
                    }
                    if (p[1] != null) {
                        this.x = parent.width - p[1] - this.width;
                    }
                    if (p[2] != null) {
                        this.x = (parent.width - this.width) * 0.5 + p[2];
                    }
                    if (p[6]) {
                        this.width = parent.width * p[6] / 100;
                    }
                }
                if (p[3] != null && p[4] == null && p[5] != null) {
                    this.height = (p[5] - p[3]) * 2;
                    this.y = p[3];
                } else if (p[3] == null && p[4] != null && p[5] != null) {
                    this.height = (p[4] - p[5]) * 2;
                    this.y = 2 * p[5] - p[4];
                } else if (p[3] != null && p[4] != null) {
                    this.height = parent.height - p[4] - p[3];
                    this.y = p[3];
                } else {
                    if (p[3] != null) {
                        this.y = p[3];
                    }
                    if (p[4] != null) {
                        this.y = parent.height - p[4] - this.height;
                    }
                    if (p[5] != null) {
                        this.y = (parent.height - this.height) * 0.5 + p[5];
                    }
                    if (p[7]) {
                        this.height = parent.height * p[7] / 100;
                    }
                }
                this.$checkSetting();
                this.$validateChildrenUIComponent();
            }
        }, {
            key: "$checkSetting",
            value: function $checkSetting() {
                if (this.width && this.height && this.$Panel[3] != PanelScaleMode.NO_SCALE) {
                    var scaleMode = this.$Panel[3];
                    var scaleX = this.parent.width / this.width;
                    var scaleY = this.parent.height / this.height;
                    if (scaleMode == PanelScaleMode.SHOW_ALL) {
                        this.scaleX = scaleX < scaleY ? scaleX : scaleY;
                        this.scaleY = scaleX < scaleY ? scaleX : scaleY;
                    } else if (scaleMode == PanelScaleMode.NO_BORDER) {
                        this.scaleX = scaleX > scaleY ? scaleX : scaleY;
                        this.scaleY = scaleX > scaleY ? scaleX : scaleY;
                    } else if (scaleMode == PanelScaleMode.SCALE_WIDTH) {
                        this.height = this.parent.height / scaleX;
                        this.scaleX = scaleX;
                        this.scaleY = scaleX;
                    } else if (scaleMode == PanelScaleMode.SCALE_HEIGHT) {
                        this.width = this.parent.width / scaleY;
                        this.scaleX = scaleY;
                        this.scaleY = scaleY;
                    }
                }
            }
        }, {
            key: "$onClose",
            value: function $onClose() {
                this.dispatchWith(flower.Event.CLOSE);
                this.closePanel();
            }
        }, {
            key: "closePanel",
            value: function closePanel() {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            }
        }, {
            key: "title",
            set: function set(val) {
                if (this.$Panel[0] == val) {
                    return;
                }
                this.$Panel[0] = val;
                this.__changeTitle();
            },
            get: function get() {
                return this.$Panel[0];
            }
        }, {
            key: "titleLabel",
            get: function get() {
                return this.$Panel[1];
            },
            set: function set(val) {
                if (this.$Panel[1] == val) {
                    return;
                }
                if (this.$Panel[1] && this.$Panel[1].parent && this.$Panel[1].parent != this) {
                    this.$Panel[1].parent.removeChild(this.$Panel[1]);
                }
                this.$Panel[1] = val;
                if (val.parent != this) {
                    this.addChild(val);
                }
                this.__changeTitle();
            }
        }, {
            key: "closeButton",
            get: function get() {
                return this.$Panel[2];
            },
            set: function set(val) {
                if (this.$Panel[2] == val) {
                    return;
                }
                if (this.$Panel[2]) {
                    if (this.$Panel[2].parent && this.$Panel[2].parent != this) {
                        this.$Panel[2].parent.removeChild(this.$Panel[2]);
                    }
                    this.$Panel[2].removeListener(flower.TouchEvent.TOUCH_END, this.$onClose, this);
                }
                this.$Panel[2] = val;
                if (val) {
                    if (val.parent != this) {
                        this.addChild(val);
                    }
                    val.addListener(flower.TouchEvent.TOUCH_END, this.$onClose, this);
                }
            }
        }, {
            key: "iconImage",
            get: function get() {
                return this.$Panel[4];
            },
            set: function set(val) {
                if (this.$Panel[4] == val) {
                    return;
                }
                if (this.$Panel[4] && this.$Panel[4].parent && this.$Panel[4].parent != this) {
                    this.$Panel[4].parent.removeChild(this.$Panel[4]);
                }
                this.$Panel[4] = val;
                if (val) {
                    val.source = this.$Panel[5];
                    if (val.parent != this) {
                        this.addChild(val);
                    }
                }
            }
        }, {
            key: "icon",
            get: function get() {
                return this.$Panel[5];
            },
            set: function set(val) {
                if (this.$Panel[5] == val) {
                    return;
                }
                if (this.$Panel[4]) {
                    this.$Panel[4].source = val;
                }
            }
        }, {
            key: "scaleMode",
            get: function get() {
                return this.$Panel[3];
            },
            set: function set(val) {
                if (this.$Panel[3] == val) {
                    return;
                }
                this.$Panel[3] = val;
                this.$invalidateContentBounds();
            }
        }]);

        return Panel;
    }(Group);

    UIComponent.registerEvent(Panel, 1120, "close", flower.Event.CLOSE);

    black.Panel = Panel;
    //////////////////////////End File:extension/black/Panel.js///////////////////////////

    //////////////////////////File:extension/black/Alert.js///////////////////////////

    var Alert = function (_Panel) {
        _inherits(Alert, _Panel);

        function Alert() {
            _classCallCheck(this, Alert);

            var _this35 = _possibleConstructorReturn(this, Object.getPrototypeOf(Alert).call(this));

            _this35.$Alert = {
                0: null, //confirmButton
                1: null, //cancelButton
                2: null, //contentLabel
                3: "" };
            return _this35;
        }

        _createClass(Alert, [{
            key: "$onConfirm",
            //content
            value: function $onConfirm(e) {
                this.dispatchWith(flower.Event.CONFIRM);
                this.closePanel();
            }
        }, {
            key: "$onCancel",
            value: function $onCancel(e) {
                this.dispatchWith(flower.Event.CANCEL);
                this.closePanel();
            }
        }, {
            key: "confirmButton",
            get: function get() {
                return this.$Alert[0];
            },
            set: function set(val) {
                if (this.$Alert[0] == val) {
                    return;
                }
                if (this.$Alert[0]) {
                    this.$Alert[0].removeListener(flower.TouchEvent.TOUCH_END, this.$onConfirm, this);
                    if (this.$Alert[0].parent && this.$Alert[0].parent != this) {
                        this.$Alert[0].parent.removeChild(this.$Alert[0]);
                    }
                }
                this.$Alert[0] = val;
                if (val) {
                    val.addListener(flower.TouchEvent.TOUCH_END, this.$onConfirm, this);
                    if (val.parent != this) {
                        this.addChild(val);
                    }
                }
            }
        }, {
            key: "cancelButton",
            get: function get() {
                return this.$Alert[1];
            },
            set: function set(val) {
                if (this.$Alert[1] == val) {
                    return;
                }
                if (this.$Alert[1]) {
                    this.$Alert[1].removeListener(flower.TouchEvent.TOUCH_END, this.$onCancel, this);
                    if (this.$Alert[1].parent && this.$Alert[1].parent != this) {
                        this.$Alert[1].parent.removeChild(this.$Alert[1]);
                    }
                }
                this.$Alert[1] = val;
                if (val) {
                    this.$Alert[1].addListener(flower.TouchEvent.TOUCH_END, this.$onCancel, this);
                    if (val.parent != this) {
                        this.addChild(val);
                    }
                }
            }
        }, {
            key: "contentLabel",
            get: function get() {
                return this.$Alert[2];
            },
            set: function set(val) {
                if (this.$Alert[2] == val) {
                    return;
                }
                if (this.$Alert[2] && this.$Alert[2].parent && this.$Alert[2].parent != this) {
                    this.$Alert[2].parent.removeChild(this.$Alert[2]);
                }
                this.$Alert[2] = val;
                if (val) {
                    val.text = this.$Alert[3];
                    if (val.parent != this) {
                        this.addChild(val);
                    }
                }
            }
        }, {
            key: "content",
            get: function get() {
                return this.$Alert[3];
            },
            set: function set(val) {
                if (this.$Alert[3] == val) {
                    return this.$Alert[3];
                }
                this.$Alert[3] = val;
                if (this.$Alert[2]) {
                    this.$Alert[2].text = val;
                }
            }
        }]);

        return Alert;
    }(Panel);

    UIComponent.registerEvent(Panel, 1130, "confirm", flower.Event.CONFIRM);
    UIComponent.registerEvent(Panel, 1131, "cancel", flower.Event.CANCEL);

    black.Alert = Alert;
    //////////////////////////End File:extension/black/Alert.js///////////////////////////

    //////////////////////////File:extension/black/Tree.js///////////////////////////

    var Tree = function (_DataGroup2) {
        _inherits(Tree, _DataGroup2);

        function Tree() {
            _classCallCheck(this, Tree);

            var _this36 = _possibleConstructorReturn(this, Object.getPrototypeOf(Tree).call(this));

            _this36.$Tree = {
                0: null, //dataProvider
                1: new flower.ArrayValue(), //dataGroupDataProvider;
                2: {}, //openCloseTable
                3: "path" //pathField
            };
            _this36.requireSelection = true;
            _this36.itemSelectedEnabled = true;
            _this36.itemClickedEnabled = true;
            _this36.layout = new VerticalLayout();
            _get(Object.getPrototypeOf(Tree.prototype), "$setDataProvider", _this36).call(_this36, _this36.$Tree[1]);
            return _this36;
        }

        _createClass(Tree, [{
            key: "$getDataProvider",
            value: function $getDataProvider() {
                return this.$Tree[0];
            }
        }, {
            key: "$setDataProvider",
            value: function $setDataProvider(val) {
                var p = this.$Tree;
                if (p[0] == val) {
                    return;
                }
                if (p[0]) {
                    p[0].removeListener(flower.Event.UPDATE, this.__onTreeDataUpdate, this);
                    p[0].removeListener(flower.Event.REMOVED, this.__onRemovedTreeDataUpdate, this);
                }
                p[0] = val;
                if (p[0]) {
                    p[0].addListener(flower.Event.UPDATE, this.__onTreeDataUpdate, this);
                    p[0].addListener(flower.Event.REMOVED, this.__onRemovedTreeDataUpdate, this);
                }
                this.__onTreeDataUpdate(null);
            }
        }, {
            key: "__onRemovedTreeDataUpdate",
            value: function __onRemovedTreeDataUpdate(e) {
                var item = e.data;
                if (item.open && item.open instanceof flower.EventDispatcher) {
                    item.open.removeListener(flower.Event.UPDATE, this.__onOpenItem, this);
                }
            }
        }, {
            key: "__onTreeDataUpdate",
            value: function __onTreeDataUpdate(e) {
                var p = this.$Tree;
                var treeData = p[0];
                var parentData = p[1];
                var openURL = p[2];
                var pathField = p[3];
                if (!treeData || !treeData.length) {
                    parentData.removeAll();
                } else {
                    parentData.removeAll();
                    var item;
                    var url;
                    var depth;
                    var keys = Object.keys(openURL);
                    var rootURL;
                    var rootURLDepth = -1;
                    var rootList = [];
                    var urlList = {};
                    for (var i = 0, len = keys.length; i < len; i++) {
                        openURL[keys[i]].state = false;
                    }
                    for (var i = 0, len = treeData.length; i < len; i++) {
                        item = treeData.list[i];
                        if (typeof item == "string") {
                            url = item;
                            if (!openURL[url]) {
                                openURL[url] = {
                                    open: false,
                                    state: true
                                };
                            } else {
                                openURL[url].state = true;
                            }
                            openURL[url].open = false;
                        } else {
                            url = item[pathField] || "";
                            if (!openURL[url]) {
                                openURL[url] = {
                                    open: false,
                                    state: true
                                };
                            } else {
                                openURL[url].state = true;
                            }
                            if (item.open != null) {
                                if (item.open instanceof flower.Value) {
                                    openURL[url].open = !!item.open.value;
                                    item.open.addListener(flower.Event.UPDATE, this.__onOpenItem, this);
                                } else {
                                    openURL[url].open = !!item.open;
                                }
                            } else {
                                openURL[url].open = false;
                            }
                        }
                        depth = url.split("/").length;
                        if (rootURLDepth == -1 || rootURLDepth > depth) {
                            rootURLDepth = depth;
                            rootURL = url;
                            rootList = [];
                        }
                        if (depth == rootURLDepth) {
                            rootList.push(url);
                        }
                        if (!urlList[url]) {
                            urlList[url] = {
                                item: item,
                                depth: depth,
                                children: []
                            };
                        } else {
                            urlList[url].item = item;
                        }
                        if (url.split("/").length > 1) {
                            var parentURL = url.slice(0, url.length - (url.split("/")[url.split("/").length - 1].length + 1));
                            if (!urlList[parentURL]) {
                                urlList[parentURL] = {
                                    item: null,
                                    depth: null,
                                    children: [url]
                                };
                            } else {
                                urlList[parentURL].children.push(url);
                            }
                        }
                    }
                    keys = Object.keys(openURL);
                    for (var i = 0, len = keys.length; i < len; i++) {
                        if (openURL[keys[i]].state == false) {
                            delete openURL[keys[i]];
                        }
                    }
                    for (var i = 0; i < rootList.length; i++) {
                        this.__readTreeShowItem(rootList[i], urlList, openURL, rootURLDepth, parentData);
                    }
                }
            }
        }, {
            key: "__onOpenItem",
            value: function __onOpenItem(e) {
                this.__onTreeDataUpdate(null);
            }
        }, {
            key: "__readTreeShowItem",
            value: function __readTreeShowItem(url, urlList, openURL, rootURLDepth, parentData) {
                var info = urlList[url];
                var item = info.item;
                if (typeof item == "string") {} else {
                    item.depth = info.depth - rootURLDepth;
                    if (item.open != null) {
                        if (item.open instanceof flower.Value) {
                            item.open.value = openURL[url].open;
                        }
                    } else {
                        item.open = new BooleanValue(openURL[url].open);
                        item.open.addListener(flower.Event.UPDATE, this.__onOpenItem, this);
                    }
                }
                parentData.push(item);
                if (openURL[url].open) {
                    var children = info.children;
                    for (var i = 0, len = children.length; i < len; i++) {
                        this.__readTreeShowItem(children[i], urlList, openURL, rootURLDepth, parentData);
                    }
                }
            }
        }, {
            key: "expand",
            value: function expand(url) {
                var p = this.$Tree;
                var parentData = p[1];
                for (var i = 0; i < parentData.length; i++) {
                    var item = parentData[i];
                    if (item.path == url.slice(0, item.path.length)) {
                        item.open.value = true;
                    }
                }
            }
        }, {
            key: "pathField",
            get: function get() {
                return this.$Tree[3];
            },
            set: function set(val) {
                if (this.$Tree[3] == val) {
                    return;
                }
                this.$Tree[3] = val;
                this.__onTreeDataUpdate(null);
            }
        }]);

        return Tree;
    }(DataGroup);

    black.Tree = Tree;
    //////////////////////////End File:extension/black/Tree.js///////////////////////////

    //////////////////////////File:extension/black/Module.js///////////////////////////

    var Module = function (_flower$EventDispatch2) {
        _inherits(Module, _flower$EventDispatch2);

        function Module(url) {
            var beforeScript = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

            _classCallCheck(this, Module);

            var _this37 = _possibleConstructorReturn(this, Object.getPrototypeOf(Module).call(this));

            Module.instance = _this37;
            _this37.__url = url;
            _this37.__beforeScript = beforeScript;
            _this37.__direction = flower.Path.getPathDirection(url);
            _this37.__moduleKey = "key" + Math.floor(Math.random() * 100000000);
            _this37.__progress = flower.DataManager.getInstance().createData("ProgressData");
            return _this37;
        }

        _createClass(Module, [{
            key: "load",
            value: function load() {
                var url = this.__url;
                this.__progress.tip.value = url;
                var loader = new flower.URLLoader(url);
                loader.load();
                loader.addListener(flower.Event.COMPLETE, this.__onLoadModuleComplete, this);
                loader.addListener(flower.Event.ERROR, this.__loadError, this);
            }
        }, {
            key: "__onLoadModuleComplete",
            value: function __onLoadModuleComplete(e) {
                var cfg = e.data;
                this.__name = cfg.name;
                flower.UIParser.addModule(cfg.name, this.__url, cfg.name);
                this.__list = [];
                var classes = cfg.classes;
                if (classes && Object.keys(classes).length) {
                    for (var key in classes) {
                        var url = classes[key];
                        if (url.slice(0, 2) == "./") {
                            url = this.__direction + url.slice(2, url.length);
                        }
                        flower.UIParser.setLocalUIURL(key, url, cfg.name);
                    }
                }
                this.script = "";
                this.script += this.__beforeScript;
                this.script += "var module = $root." + cfg.name + " = $root." + cfg.name + "||{};\n";
                this.__beforeScript += "var module = $root." + cfg.name + ";\n";
                this.__beforeScript += "var moduleKey = \"key" + Math.floor(Math.random() * 100000000) + "\";\n";
                this.script += "module.path = \"" + this.__direction + "\";\n";
                this.script += "var moduleKey = \"" + this.__moduleKey + "\";\n";
                if (cfg.execute) {
                    this.__hasExecute = true;
                    this.script += "$root." + cfg.name + "__executeModule = function() {" + cfg.execute + "}\n";
                }
                flower.UIParser.setModuleBeforeScript(cfg.name, this.__beforeScript);
                var scripts = cfg.scripts;
                if (scripts && Object.keys(scripts).length) {
                    for (var i = 0; i < scripts.length; i++) {
                        var url = scripts[i];
                        if (url.slice(0, 2) == "./") {
                            url = this.__direction + url.slice(2, url.length);
                        }
                        this.__list.push({
                            type: "script",
                            url: url
                        });
                    }
                }
                var data = cfg.data;
                if (data && Object.keys(data).length) {
                    for (var i = 0; i < data.length; i++) {
                        var url = data[i];
                        if (url.slice(0, 2) == "./") {
                            url = this.__direction + url.slice(2, url.length);
                        }
                        this.__list.push({
                            type: "data",
                            url: url
                        });
                    }
                }
                var components = cfg.components;
                if (components && Object.keys(components).length) {
                    for (var i = 0; i < components.length; i++) {
                        var url = components[i];
                        if (url.slice(0, 2) == "./") {
                            url = this.__direction + url.slice(2, url.length);
                        }
                        var parser = new flower.UIParser(this.__beforeScript);
                        parser.moduleName = cfg.name;
                        this.__list.push({
                            type: "ui",
                            ui: parser,
                            url: url
                        });
                    }
                }
                this.__index = 0;
                this.__loadNext();
            }
        }, {
            key: "__loadError",
            value: function __loadError(e) {
                if (this.hasListener(flower.Event.ERROR)) {
                    this.dispatch(e);
                } else {
                    $error(e.data);
                }
            }
        }, {
            key: "__loadNext",
            value: function __loadNext(e) {
                var item;
                if (this.__index != 0) {
                    item = this.__list[this.__index - 1];
                    if (item.type == "data") {
                        flower.DataManager.getInstance().addDefine(e.data, this.__moduleKey);
                    } else if (item.type == "script") {
                        this.script += e.data + "\n\n\n";
                        if (this.__index == this.__list.length || this.__list[this.__index].type != "script") {
                            //trace("执行script:\n", this.script);
                            eval(this.script);
                        }
                    }
                }
                if (this.__list.length == 0) {
                    this.__index = this.__list.length = 1;
                }
                this.__progress.max.value = this.__list.length;
                this.__progress.current.value = this.__index;
                if (this.__index == this.__list.length) {
                    if (this.__hasExecute) {
                        $root[this.__name + "__executeModule"]();
                    }
                    this.dispatchWith(flower.Event.COMPLETE);
                    return;
                }
                item = this.__list[this.__index];
                if (item.type == "ui") {
                    var ui = this.__list[this.__index].ui;
                    var url = this.__list[this.__index].url;
                    ui.addListener(flower.Event.COMPLETE, this.__loadNext, this);
                    ui.addListener(flower.Event.ERROR, this.__loadError, this);
                    ui.parseAsync(url);
                } else if (item.type == "data" || item.type == "script") {
                    var loader = new flower.URLLoader(item.url);
                    loader.addListener(flower.Event.COMPLETE, this.__loadNext, this);
                    loader.addListener(flower.Event.ERROR, this.__loadError, this);
                    loader.load();
                }
                this.__index++;
            }
        }, {
            key: "progress",
            get: function get() {
                return this.__progress;
            }
        }]);

        return Module;
    }(flower.EventDispatcher);

    black.Module = Module;
    //////////////////////////End File:extension/black/Module.js///////////////////////////
})();
for (var key in black) {
    flower[key] = black[key];
}