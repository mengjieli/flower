var black = {};
(function(){
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
                12: false,//absoluteState
                13: this, //eventThis
                14: null, //layout
            };
            UIComponent.registerEvent(clazz, 1000, "creationComplete", flower.Event.CREATION_COMPLETE);
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

        p.$getBounds = function (fromParent = false) {
            var rect = $root._get(Object.getPrototypeOf(p), "$getBounds", this).call(this, fromParent);
            if (fromParent) {
                var ui = this.$UIComponent;
                if ((ui[0] == null || ui[1] == null) && ui[6] != null || (ui[0] != null && ui[1] != null)) {
                    rect.width = 0;
                }
                if ((ui[3] == null || ui[4] == null) && ui[7] != null || (ui[3] != null && ui[4] != null)) {
                    rect.height = 0;
                }
            }
            return rect;
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

black.UIComponent = UIComponent;
//////////////////////////End File:extension/black/core/UIComponent.js///////////////////////////



//////////////////////////File:extension/black/data/member/Value.js///////////////////////////
class Value extends flower.EventDispatcher {

    __old = null;
    __value = null;
    __checkDistort = null;

    constructor(checkDistort = null) {
        super();
        this.__checkDistort = checkDistort == null ? Value.Default_Check_Distort : checkDistort;
    }

    $setValue(val) {
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
    }

    $getValue() {
        return this.__value;
    }

    get value() {
        if (this.__checkDistort) {
            return this.$getValue();
        }
        return this.__value;
    }

    set value(val) {
        this.$setValue(val);
    }

    get old() {
        return this.__old;
    }

    //Value 是否自动检测非法修改
    static Default_Check_Distort = false;
}

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
class ArrayValue extends Value {

    _length;
    list;
    _key = "";
    _rangeMinKey = "";
    _rangeMaxKey = "";
    _selectedItem = null;
    _itemType = null;

    constructor(init = null, itemType = "*") {
        super();
        this._itemType = itemType;
        this.list = init || [];
        this._length = this.list.length;
        this.__value = this;
        this._lengthValue = new flower.IntValue();
    }

    push(item) {
        this.list.push(item);
        this._length = this._length + 1;
        this._lengthValue.value = this._length;
        this.dispatchWith(flower.Event.ADDED, item);
        this.dispatchWith(flower.Event.UPDATE, this);
    }

    addItemAt(item, index) {
        index = +index & ~0;
        if (index < 0 || index > this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        this.list.splice(index, 0, item);
        this._length = this._length + 1;
        this._lengthValue.value = this._length;
        this.dispatchWith(flower.Event.ADDED, item);
        this.dispatchWith(flower.Event.UPDATE, this);
    }

    shift() {
        if (!this.list.length) {
            return;
        }
        var item = this.list.shift();
        this._length = this._length - 1;
        this._lengthValue.value = this._length;
        this.dispatchWith(flower.Event.REMOVED, item);
        this.dispatchWith(flower.Event.UPDATE, this);
        return item;
    }

    splice(startIndex, delCount = 0, ...args) {
        var i;
        startIndex = +startIndex & ~0;
        delCount = +delCount & ~0;
        var list;
        if (delCount <= 0) {
            list = [];
            for (i = 0; i < args.length; i++) {
                list[i] = args[i];
                this.list.splice(startIndex, 0, args[i]);
            }
            this._length = this._length + 1;
            this._lengthValue.value = this._length;
            for (i = 0; i < args.length; i++) {
                this.dispatchWith(flower.Event.ADDED, args[i]);
            }
            this.dispatchWith(flower.Event.UPDATE, this);
        }
        else {
            list = this.list.splice(startIndex, delCount);
            this._length = this._length - delCount;
            this._lengthValue.value = this._length;
            for (i = 0; i < list.length; i++) {
                this.dispatchWith(flower.Event.REMOVED, list[i]);
            }
            this.dispatchWith(flower.Event.UPDATE, this);
        }
        return list;
    }

    slice(startIndex, end) {
        startIndex = +startIndex & ~0;
        end = +end & ~0;
        return new ArrayValue(this.list.slice(startIndex, end));
    }

    pop() {
        if (!this.list.length) {
            return;
        }
        var item = this.list.pop();
        this._length = this._length - 1;
        this._lengthValue.value = this._length;
        this.dispatchWith(flower.Event.REMOVED, item);
        this.dispatchWith(flower.Event.UPDATE, this);
        return item;
    }

    removeAll() {
        if (!this.list.length) {
            return;
        }
        while (this.list.length) {
            var item = this.list.pop();
            this._length = this._length - 1;
            this._lengthValue.value = this._length;
            this.dispatchWith(flower.Event.REMOVED, item);
        }
        this.dispatchWith(flower.Event.UPDATE, this);
    }

    removeItem(item) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i] == item) {
                this.list.splice(i, 1);
                this._length = this._length - 1;
                this._lengthValue.value = this._length;
                this.dispatchWith(flower.Event.REMOVED, item);
                this.dispatchWith(flower.Event.UPDATE, this);
                return item;
            }
        }
        return null;
    }

    removeItemAt(index) {
        index = +index & ~0;
        if (index < 0 || index >= this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        var item = this.list.splice(index, 1)[0];
        this._length = this._length - 1;
        this._lengthValue.value = this._length;
        this.dispatchWith(flower.Event.REMOVED, item);
        this.dispatchWith(flower.Event.UPDATE, this);
        return item;
    }

    removeItemWith(key, value, key2 = "", value2 = null) {
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
        }
        else {
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
        this._lengthValue.value = this._length;
        this.dispatchWith(flower.Event.REMOVED, item);
        this.dispatchWith(flower.Event.UPDATE, this);
        return item;
    }

    getItemIndex(item) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i] == item || !(item instanceof flower.Value) && this.list[i] instanceof Value && this.list[i].value == item) {
                return i;
            }
        }
        return -1;
    }

    getItemWith(key, value, key2 = "", value2 = null) {
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

    getItemFunction(func, thisObj, ...args) {
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

    getItemsWith(key, value, key2 = "", value2 = null) {
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

    setItemsAttributeWith(findKey, findValue, setKey = "", setValue = null) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i][findKey] instanceof flower.Value && this.list[i][findKey].value == findValue) {
                this.list[i][setKey].value = setValue
            } else if (this.list[i][findKey] == findValue) {
                this.list[i][setKey] = setValue;
            }

        }
    }

    getItemsFunction(func, thisObj = null) {
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

    sort() {
        this.list.sort.apply(this.list, arguments);
        this.dispatchWith(flower.Event.UPDATE, this);
    }

    setItemIndex(item, index) {
        var itemIndex = this.getItemIndex(item);
        if (itemIndex < 0 || itemIndex == index) {
            return;
        }
        this.list.splice(itemIndex, 1);
        this.list.splice(index, 0, item);
        this.dispatchWith(flower.Event.UPDATE, this);
    }

    getItemAt(index) {
        index = +index & ~0;
        if (index < 0 || index >= this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        return this.list[index];
    }

    setItemAt(index, item) {
        this.splice(index, 1);
        this.splice(index, 0, item);
    }

    getItemByValue(value) {
        if (this.key == "") {
            return null;
        }
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i][this.key] instanceof Value && this.list[i][this.key].value == value || this.list[i][this.key] == value) {
                return this.list[i];
            }
        }
        return null;
    }

    getItemByRange(value) {
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

    getItemsByRange(value) {
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

    dispose() {
        var list = this.list;
        for (var i = 0; i < list.length; i++) {
            var value = this.list[i];
            if (value instanceof Value) {
                value.dispose();
            }
        }
        super.dispose();
    }

    /**
     * 从 Object 中读取数据
     * @param value
     */
    $setValue(val) {
        this.removeAll();
        var itemType = this._itemType;
        for (var i = 0; i < val.length; i++) {
            this.push(DataManager.createData(itemType, val[i]));
        }
    }

    /**
     * 将数据转化成 Object
     */
    get value() {
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
    }

    set value(val) {
        this.$setValue(val);
    }

    set key(val) {
        this._key = val;
    }

    get key() {
        return this._key;
    }

    set rangeMinKey(val) {
        this._rangeMinKey = val;
    }

    get rangeMinKey() {
        return this._rangeMinKey;
    }

    set rangeMaxKey(val) {
        this._rangeMaxKey = val;
    }

    get rangeMaxKey() {
        return this._rangeMaxKey;
    }

    get length() {
        return this._length;
    }

    set length(val) {
        val = +val & ~0;
        if (this._length == val) {
        } else {
            while (this.list.length > val) {
                var item = this.list.pop();
                this._length = this._length - 1;
                this._lengthValue.value = this._length;
                this.dispatchWith(flower.Event.REMOVED, item);
            }
            this.dispatchWith(flower.Event.UPDATE, this);
        }
    }

    get lengthIntValue() {
        return this._lengthValue;
    }
}

for (var i = 0; i < 1000; i++) {
    Object.defineProperty(ArrayValue.prototype, "" + i, {
        get: function (index) {
            return function () {
                return this.list[index];
            }
        }(i),
        set: function (index) {
            return function (val) {
                this.setItemAt(index, val);
            }
        }(i),
        enumerable: true,
        configurable: true
    });
}


black.ArrayValue = ArrayValue;
//////////////////////////End File:extension/black/data/member/ArrayValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/BooleanValue.js///////////////////////////
class BooleanValue extends Value {

    constructor(init = false, enumList = null) {
        super();
        if (init == "false") {
            init = false;
        }
        this.__enumList = enumList;
        this.__old = this.__value = !!init;
    }

    $setValue(val) {
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

    $setEnumList(val) {
        if (this.__enumList == val) {
            return;
        }
        this.__enumList = val;
    }

    get enumList() {
        return this.__enumList;
    }

    set enumList(val) {
        this.$setEnumList(val);
    }
}

black.BooleanValue = BooleanValue;
//////////////////////////End File:extension/black/data/member/BooleanValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/IntValue.js///////////////////////////
class IntValue extends Value {

    constructor(init = 0, enumList = null, checkDistort = null) {
        super(checkDistort);
        this.__old = this.__value = +init & ~0 || 0;
        this.__enumList = enumList;
        this.__valueCheck = [48];
    }

    $setValue(val) {
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

    $getValue() {
        if (this.__checkDistort) {
            flower.breakPoint();
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

    $setEnumList(val) {
        if (this.__enumList == val) {
            return;
        }
        this.__enumList = val;
    }

    get enumList() {
        return this.__enumList;
    }

    set enumList(val) {
        this.$setEnumList(val);
    }
}

black.IntValue = IntValue;
//////////////////////////End File:extension/black/data/member/IntValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/NumberValue.js///////////////////////////
class NumberValue extends Value {

    constructor(init = 0, enumList = null, checkDistort = null) {
        super(checkDistort);
        this.__enumList = enumList;
        this.__old = this.__value = +init || 0;
        this.__precision = 2;
        this.__multiplier = Math.pow(10, this.__precision);
        this.__valueCheck = [48];
    }

    $setValue(val) {
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

    $getValue() {
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

    $setEnumList(val) {
        if (this.__enumList == val) {
            return;
        }
        this.__enumList = val;
    }

    get enumList() {
        return this.__enumList;
    }

    set enumList(val) {
        this.$setEnumList(val);
    }

    /**
     * 设置精确到小数点后多少位
     * @param val
     */
    set precision(val) {
        this.__precision = val;
        this.__multiplier = Math.pow(10, this.__precision);
        this.$setValue(this.__value);
    }

    get precision() {
        return this.__precision;
    }
}

black.NumberValue = NumberValue;
//////////////////////////End File:extension/black/data/member/NumberValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/ObjectValue.js///////////////////////////
/**
 * 定义 Data 时，如下关键字不能作为属性名称
 * `value
 * className
 * membersKey
 * dispose
 */
class ObjectValue extends Value {

    constructor(init = null) {
        super();
        this.__old = this.__value = {};
        if (init) {
            this.value = init;
        }
        this.__saveClass = {};
        this.__nosave = {};
    }

    $setMember(name, value) {
        var old = this.__value[name];
        this.__value[name] = value;
        this.dispatchWith(name, {
            "name": name,
            "old": old,
            "value": value
        });
    }

    $setMemberSaveClass(name, saveClass = false) {
        this.__saveClass[name] = saveClass;
    }

    $setMemberSaveFlag(name, save = false) {
        if (save == false) {
            this.__nosave[name] = true;
        } else {
            delete this.__nosave[name];
        }
    }

    hasMember(name) {
        return this.__value.hasOwnProperty(name);
    }

    getValue(name) {
        return this.__value[name];
    }

    setValue(name, value) {
        if (!this.__value.hasOwnProperty(name)) {
            sys.$error(3014, name);
            return;
        }
        if (value == null) {
            this.$setMember(name, null);
        } else {
            if (value && (!(value instanceof Value)) && typeof value == "object" && value.__className) {
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
    $setValue(val) {
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

    $getValue(saveClass = false) {
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
    get value() {
        return this.$getValue();
    }

    set value(val) {
        this.$setValue(val);
    }

    get className() {
        return this.__className ? this.__className.value : "";
    }

    set className(val) {
        if (val) {
            this.__className = new StringValue(val);
        } else {
            this.__className = null;
        }
    }

    get membersKey() {
        return Object.keys(this.value);
    }

    dispose() {
        var val = this.__value;
        var list = Object.keys(val);
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            if (val[key] instanceof Value) {
                val[key].dispose();
            }
        }
        super.dispose();
    }
}

black.ObjectValue = ObjectValue;
//////////////////////////End File:extension/black/data/member/ObjectValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/StringValue.js///////////////////////////
class StringValue extends Value {

    constructor(init = "", enumList = null) {
        super();
        this.__old = this.__value = "" + (init == null ? "" : init);
        this.__enumList = enumList;
    }

    $setValue(val) {
        val = "" + (val == null ? "" : val);
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWith(flower.Event.UPDATE, this, val);
    }

    $setEnumList(val) {
        if (this.__enumList == val) {
            return;
        }
        this.__enumList = val;
    }

    get enumList() {
        return this.__enumList;
    }

    set enumList(val) {
        this.$setEnumList(val);
    }
}

black.StringValue = StringValue;
//////////////////////////End File:extension/black/data/member/StringValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/UIntValue.js///////////////////////////
class UIntValue extends Value {

    constructor(init = 0, enumList = null, checkDistort = null) {
        super(checkDistort);
        init = +init & ~0 || 0;
        if (init < 0) {
            init = 0;
        }
        this.__enumList = enumList;
        this.__old = this.__value = init;
        this.__valueCheck = [48];
    }

    $setValue(val) {
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

    $getValue() {
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

    $setEnumList(val) {
        if (this.__enumList == val) {
            return;
        }
        this.__enumList = val;
    }

    get enumList() {
        return this.__enumList;
    }

    set enumList(val) {
        this.$setEnumList(val);
    }
}

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
class DataManager {
    
    _defines = {};
    _root = {};

    constructor() {
        if (DataManager.instance) {
            return;
        }
        DataManager.instance = this;
        this.addDefine({
            "name": "Attribute",
            "members": {
                "name": {"type": "string"},
                "content": {"type": "string"}
            }
        });
        this.addDefine({
            "name": "Size",
            "members": {
                "width": {"type": "int"},
                "height": {"type": "int"}
            }
        });
        this.addDefine({
            "name": "Point",
            "members": {
                "x": {"type": "int"},
                "y": {"type": "int"}
            }
        });
        this.addDefine({
            "name": "Rectangle",
            "members": {
                "x": {"type": "int"},
                "y": {"type": "int"},
                "width": {"type": "int"},
                "height": {"type": "int"}
            }
        });
        this.addDefine({
            "name": "ProgressData",
            "members": {
                "current": {"type": "number"},
                "max": {"type": "number"},
                "percent": {"type": "number", "bind": "{max==0?1:current/max}"},
                "tip": {"type": "string"}
            }
        });
        this.addDefine({
            "name": "flower.System",
            "members": {
                "screen": {"type": "Size"},
            }
        });
        this.addDefine({
            "name": "FlowerData",
            "members": {
                "system": {"type": "flower.System"},
            }
        });
        this.addRootData("flower", "FlowerData");
    }

    addRootData(name, className, init = null) {
        this[name] = this.createData(className, init);
        return this._root[name] = this[name];
    }

    addDefine(config) {
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
        var content = "var " + defineClass + " = (function (_super) {\n" +
            "\t__extends(" + defineClass + ", _super);\n" +
            "\tfunction " + defineClass + "(init) {\n" +
            "\t\t_super.call(this,null);\n";
        content += "\t\tthis.className = \"" + config.name + "\";\n";
        var defineMember = "";
        var members = config.members;
        var bindContent = "";
        if (members) {
            var member;
            for (var key in members) {
                member = members[key];
                if (member.init && typeof member.init == "object" && member.init.__className) {
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
                    bindContent += "\t\tnew flower.Binding(this." + key + ",[this],\"value\",\"" + member.bind + "\");\n"
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
        content += "\t}\n\n" +
            defineMember +
            "\treturn " + defineClass + ";\n" +
            "})(" + extendClassName + ");\n";
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

    $addClassDefine(clazz, className) {
        var item = this._defines[className];
        item.define = clazz;
    }

    getClass(className) {
        var item = this._defines[className];
        if (!item) {
            return null;
        }
        //if (item.moduleKey != moduleKey) {
        //    sys.$error(3016, moduleKey);
        //}
        return item.define;
    }

    createData(className, init = null, distort = null) {
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

    clear() {
        for (var key in this._root) {
            delete this._root[key];
            delete this[key];
        }
        this._defines = {};
    }

    static instance;

    static getInstance() {
        if (DataManager.instance == null) {
            new DataManager();
        }
        return DataManager.instance;
    }

    static addRootData(name, className, init = null) {
        return DataManager.getInstance().addRootData(name, className, init);
    }

    static getClass(className) {
        return DataManager.getInstance().getClass(className);
    }

    static addDefine(config) {
        return DataManager.getInstance().addDefine(config);
    }

    static createData(className, init = null) {
        return DataManager.getInstance().createData(className, init);
    }

    static clear() {
        DataManager.getInstance().clear();
    }
}

black.DataManager = DataManager;
//////////////////////////End File:extension/black/data/DataManager.js///////////////////////////



//////////////////////////File:extension/black/layout/Layout.js///////////////////////////
class Layout {

    _fixElementSize = false;
    elements = [];
    flag = false;

    constructor() {
    }

    isElementsOutSize(startX, starY, width, height) {
        return false;
    }

    getFirstItemIndex(elementWidth, elementHeight, startX, startY) {
        return 0;
    }


    getContentSize() {
        return null;
    }

    measureSize(elementWidth, elementHeight, elementCount) {
        return null;
    }

    addElementAt(element, index) {
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

    setElementIndex(element, index) {
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

    removeElement(element) {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            if (this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.flag = true;
    }

    removeElementAt(index) {
        this.elements.splice(index, 1);
        this.flag = true;
    }

    $setFlag() {
        this.flag = true;
    }

    updateList(width, height, startIndex = 0, elementWidth = 0, elementHeight = 0) {
    }

    $clear() {
        this.elements = [];
        this.flag = false;
    }

    get fixElementSize() {
        return this._fixElementSize;
    }

    set fixElementSize(val) {
        if (val == "false") {
            val = false;
        }
        this._fixElementSize = !!val;
    }

    static VerticalAlign = "vertical";
    static HorizontalAlign = "horizontal";
    static NoneAlign = "";
}

black.Layout = Layout;
//////////////////////////End File:extension/black/layout/Layout.js///////////////////////////



//////////////////////////File:extension/black/layout/LinearLayout.js///////////////////////////
class LinearLayout extends Layout {

    _gap = 0;
    _align = "";
    _maxX;
    _maxY;

    constructor() {
        super();
        this._fixElementSize = true;
    }

    isElementsOutSize(startX, starY, width, height) {
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

    getFirstItemIndex(elementWidth, elementHeight, startX, startY) {
        if (this._align == flower.Layout.VerticalAlign) {
            return Math.floor(startY / (elementHeight + this._gap));
        } else if (this._align == flower.Layout.HorizontalAlign) {
            return Math.floor(startX / (elementWidth + this._gap));
        }
        return 0;
    }

    getContentSize() {
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

    measureSize(elementWidth, elementHeight, elementCount) {
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

    updateList(width, height, startIndex = 0, elementWidth = 0, elementHeight = 0) {
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
                if (list.length) {
                    elementHeight = elementHeight || list[0].height;
                }
                for (i = 0; i < len; i++) {
                    list[i].y = (i + startIndex) * (elementHeight + this._gap);
                }
                this._maxY = (len + startIndex) * (elementHeight + this._gap);
            }
            else {
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
                if (list.length) {
                    elementWidth = elementWidth || list[0].height;
                }
                for (i = 0; i < len; i++) {
                    list[i].x = (i + startIndex) * (elementWidth + this._gap);
                }
                this._maxX = (len + startIndex) * (elementWidth + this._gap);
            }
            else {
                var x = 0;
                for (i = 0; i < len; i++) {
                    list[i].x = x;
                    x += list[i].width + this._gap;
                    this._maxX = x;
                }
            }
        }
    }

    get gap() {
        return this._gap;
    }

    set gap(val) {
        val = +val || 0;
        this._gap = val;
    }

    get align() {
        return this._align;
    }

    set align(val) {
        this._align = val;
    }

}
//////////////////////////End File:extension/black/layout/LinearLayout.js///////////////////////////



//////////////////////////File:extension/black/layout/HorizontalLayout.js///////////////////////////
class HorizontalLayout extends LinearLayout {

    constructor() {
        super();
        this.align = flower.Layout.HorizontalAlign;
    }

}

black.HorizontalLayout = HorizontalLayout;
//////////////////////////End File:extension/black/layout/HorizontalLayout.js///////////////////////////



//////////////////////////File:extension/black/layout/VerticalLayout.js///////////////////////////
class VerticalLayout extends LinearLayout {

    constructor() {
        super();
        this.align = flower.Layout.VerticalAlign;
    }
}

black.VerticalLayout = VerticalLayout;
//////////////////////////End File:extension/black/layout/VerticalLayout.js///////////////////////////



//////////////////////////File:extension/black/utils/Language.js///////////////////////////
/**
 * 简单的多语言管理
 */
class Language {

    static __languages = {};

    static register(key, language, value) {
        if (!Language.__languages[language]) {
            Language.__languages[language] = {};
        }
        Language.__languages[language][key] = value;
    }

    static getLanguage(key, language) {
        return Language.__languages[language][key];
    }
}

black.Language = Language;
//////////////////////////End File:extension/black/utils/Language.js///////////////////////////



//////////////////////////File:extension/black/utils/PanelScaleMode.js///////////////////////////
class PanelScaleMode {
    static NO_SCALE = "no_scale";
    static SHOW_ALL = "show_all";
    static NO_BORDER = "no_border";
    static SCALE_WIDTH = "scale_width";
    static SCALE_HEIGHT = "scale_height";
}

black.PanelScaleMode = PanelScaleMode;
//////////////////////////End File:extension/black/utils/PanelScaleMode.js///////////////////////////



//////////////////////////File:extension/black/utils/ScrollPolicy.js///////////////////////////
class ScrollPolicy {
    static ON = "on";
    static OFF = "off";
    static AUTO = "auto";
}

black.ScrollPolicy = ScrollPolicy;
//////////////////////////End File:extension/black/utils/ScrollPolicy.js///////////////////////////



//////////////////////////File:extension/black/Group.js///////////////////////////
class Group extends flower.Sprite {

    $UIComponent;
    _data;

    constructor(data) {
        super();
        if (data != null) {
            this._data = data;
        }
        this.$IViewPort = {
            0: 0,    //contentStartX
            1: 0,    //contentStartY
            2: 0,    //contentEndX
            3: 0,    //contentEndY
            4: null, //scrollH
            5: null, //scrollV
        }
        this.$initUIComponent();
    }

    setData(val) {
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

    get data() {
        return this._data;
    }

    set data(val) {
        this.setData(val);
    }

    $addFlags(flags) {
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
    $validateUIComponent(parent) {
        this.$removeFlags(0x1000);
        //开始验证属性
        var p = this.$UIComponent;
        if (this.$hasFlags(0x0001)) {
            this.$getContentBounds();
        }
        parent = parent || this.parent;
        if (p[0] != null && p[1] == null && p [2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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
        this.$IViewPort[0] = this.$childrenBounds.x;
        this.$IViewPort[1] = this.$childrenBounds.y;
        this.$IViewPort[2] = this.$childrenBounds.x + this.$childrenBounds.width;
        this.$IViewPort[3] = this.$childrenBounds.y + this.$childrenBounds.height;
    }

    $validateChildrenUIComponent() {
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

    $resetLayout() {
        if (this.$hasFlags(this.layout && 0x2000)) {
            this.$removeFlags(0x2000);
            this.layout.updateList(this.width, this.height);
        }
    }

    $onFrameEnd() {
        if (!this.parent.__UIComponent) {
            var flag = false;
            var count = 6;
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                //super.$onFrameEnd();
                var children = this.__children;
                /**
                 * 子对象序列改变
                 */
                if (this.$hasFlags(0x0100)) {
                    if (!this.$nativeShow) {
                        $warn(1002, this.name);
                        return;
                    }
                    this.$nativeShow.resetChildIndex(children);
                    this.$removeFlags(0x0100);
                }
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }

                this.$resetLayout();
                flag = true;
                count--;
            }
            if (!flag) {
                //super.$onFrameEnd();
                var children = this.__children;
                /**
                 * 子对象序列改变
                 */
                if (this.$hasFlags(0x0100)) {
                    if (!this.$nativeShow) {
                        $warn(1002, this.name);
                        return;
                    }
                    this.$nativeShow.resetChildIndex(children);
                    this.$removeFlags(0x0100);
                }
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }

                this.$resetLayout();
            }
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                //super.$onFrameEnd();
                var children = this.__children;
                /**
                 * 子对象序列改变
                 */
                if (this.$hasFlags(0x0100)) {
                    if (!this.$nativeShow) {
                        $warn(1002, this.name);
                        return;
                    }
                    this.$nativeShow.resetChildIndex(children);
                    this.$removeFlags(0x0100);
                }
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].visible) {
                        children[i].$onFrameEnd();
                    }
                }
                //super.$onFrameEnd();
                var p = this.$DisplayObject;
                if (this.$hasFlags(0x0002)) {
                    this.$nativeShow.setAlpha(this.$getConcatAlpha());
                }

                this.$resetLayout();
                flag = true;
                count--;
            }
        } else {
            //super.$onFrameEnd();
            var children = this.__children;
            /**
             * 子对象序列改变
             */
            if (this.$hasFlags(0x0100)) {
                if (!this.$nativeShow) {
                    $warn(1002, this.name);
                    return;
                }
                this.$nativeShow.resetChildIndex(children);
                this.$removeFlags(0x0100);
            }
            for (var i = 0, len = children.length; i < len; i++) {
                if (children[i].visible) {
                    children[i].$onFrameEnd();
                }
            }
            //super.$onFrameEnd();
            var p = this.$DisplayObject;
            if (this.$hasFlags(0x0002)) {
                this.$nativeShow.setAlpha(this.$getConcatAlpha());
            }
            this.$resetLayout();
        }
        flower.DebugInfo.frameInfo.display++;
        flower.DebugInfo.frameInfo.sprite++;
    }

    $getContentWidth() {
        return this.$IViewPort[2] - this.$IViewPort[0];
    }

    $getContentHeight() {
        return this.$IViewPort[3] - this.$IViewPort[1];
    }

    get contentWidth() {
        return this.$getContentWidth();
    }

    get contentHeight() {
        return this.$getContentHeight();
    }

    get scrollH() {
        return this.$IViewPort[4] == null ? this.$IViewPort[0] : this.$IViewPort[4];
    }

    set scrollH(val) {
        if (val != null) {
            val = +val;
        }
        if (this.$IViewPort[4] == val) {
            return;
        }
        this.$IViewPort[4] = val;
    }

    get scrollV() {
        return this.$IViewPort[5] == null ? this.$IViewPort[1] : this.$IViewPort[5];
    }

    set scrollV(val) {
        if (val != null) {
            val = +val;
        }
        if (this.$IViewPort[5] == val) {
            return;
        }
        this.$IViewPort[5] = val;
    }

    dispose() {
        flower.Binding.removeChangeObject(this);
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }
}
UIComponent.register(Group, true);
Group.prototype.__UIComponent = true;
black.Group = Group;
//////////////////////////End File:extension/black/Group.js///////////////////////////



//////////////////////////File:extension/black/RichText.js///////////////////////////
class RichText extends Group {
    constructor() {
        super();

        this.$RichText = {
            0: "", //text
            1: "", //htmlText formatHtmlText
            2: [], //lines
            3: 0,  //inputLength
            4: new flower.Sprite(), //textContainer
            5: this.__getDefaultFocus(), //focus
            6: "", //setHtmlText
            7: 0, //chars
            8: 0, //posY
            10: 12,//fontSize
            11: 0, //fontColor
            12: 1, //linegap
            13: false,  //wordWrap
            30: 0, //caretIndex
            31: 0, //caretHtmlIndex
            32: null,//caretLine
            32: null,//caretDisplayLine
            33: null,//caretDisplay
            34: 0, //caretDisplayIndex
            100: false,//updateFlag
            101: {}, //DisplayCaches
            102: {}, //ids
            200: 0, //lastTouchTime
            201: false //doubleClick
        };
        this.addChild(this.$RichText[4]);
        this.addChild(this.$RichText[5]);
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        flower.EnterFrame.add(this.$update, this);
    }

    __onTouch(e) {
        var p = this.$RichText;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                var doubleClick = false;
                var tribleClick = false;
                if (!p[201]) {
                    if (flower.CoreTime.currentTime - p[200] < 200) {
                        doubleClick = true;
                    }
                } else {
                    if (flower.CoreTime.currentTime - p[200] < 200) {
                        doubleClick = true;
                        tribleClick = true;
                    }
                }
                p[200] = flower.CoreTime.currentTime;
                p[201] = doubleClick;
                if (tribleClick) { //三击
                    this.__tribleClick();
                } else if (doubleClick) { //双击
                    this.__doubleClick();
                } else { //单击
                    this.__click();
                }
                break;
        }
    }

    /**
     * 连续三次点击
     * @private
     */
    __tribleClick() {
        console.log("三击")
    }

    /**
     * 连续两次点击
     * @private
     */
    __doubleClick() {
        console.log("双击")
    }

    /**
     * 点击
     * @private
     */
    __click() {
        console.log("单击")
    }

    $setHtmlText(text) {
        this.__resetCaches();
        this.__clearOldDisplay();
        var p = this.$RichText;
        var ids = p[102];
        for (var key in ids) {
            delete  ids[key];
            delete this[key];
        }
        var container = p[4];
        var lines = p[2];
        lines.length = 0;
        var font = {
            size: p[10],
            color: p[11],
            under: false, //下划线
            gap: p[12],
            sizes: [],
            colors: [],
            unders: [],
            gaps: []
        };
        var line = this.__getNewLine(null, font);
        lines.push(line);
        var last = -1; //上一个 <
        var lastText = "";
        var lastHtmlText = "";
        var lastTextStart = -1;
        for (var i = 0, len = text.length; i < len; i++) {
            var char = text.charAt(i);
            var decodeText = false;
            var addSingle = null;
            var oldFont = font;
            var nextHtmlText = "";
            var single = false;
            lastHtmlText += char;
            if (char == "<") {
                last = i;
            } else if (char == ">") {
                //分析<...>标签里的内容
                var sign = text.slice(last + 1, i);
                var end = false;
                if (sign.charAt(sign.length - 1) == "/") {
                    sign = sign.slice(0, sign.length - 1);
                    single = true;
                }
                var s = 0;
                if (sign.charAt(0) == "/") {
                    end = true;
                    s++;
                }
                var name = "";
                //获取标签名称
                for (; s < sign.length; s++) {
                    char = sign.charAt(s);
                    if (char == " ") {
                        break;
                    } else {
                        name += char;
                    }
                }
                //分析属性
                var attributes = [];
                while (s < sign.length) {
                    //跳过空格
                    while (sign.charAt(s) == " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    //获取属性名称
                    var pos = s;
                    while (sign.charAt(s) != "=" && sign.charAt(s) != " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    var attributeName = sign.slice(pos, s);
                    //跳过空格
                    while (sign.charAt(s) == " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    if (sign.charAt(s) == "=") {
                        s++;
                    } else {
                        break;
                    }
                    //跳过空格
                    while (sign.charAt(s) == " " && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    //获取引号
                    var begin = sign.charAt(s);
                    if (begin == "\"" || begin == "'") {
                        s++;
                    } else {
                        break;
                    }
                    //获取内容
                    var pos = s;
                    while (sign.charAt(s) != begin && s < sign.length) {
                        s++;
                    }
                    if (s == sign.length) {
                        break;
                    }
                    var attributeContent = sign.slice(pos, s);
                    s++; //跳过引号
                    attributes.push({
                        name: attributeName,
                        value: attributeContent
                    });
                }
                if (single) { //如果是单个内容，比如<img.../>
                    addSingle = {
                        name: name,
                        attributes: attributes,
                    }
                    if (name == "img") {
                        decodeText = true;
                        addSingle.htmlText = text.slice(last, i + 1);
                        lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                    } else {
                        var isfxml = false;
                        for (var a = 0; a < attributes.length; a++) {
                            if (attributes[a].name == "xmlns:f" && attributes[a].value == "flower") {
                                isfxml = true;
                                break;
                            }
                        }
                        if (isfxml) {
                            decodeText = true;
                            addSingle.name = "ui";
                            addSingle.htmlText = text.slice(last, i + 1);
                            lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                        }
                    }
                } else {
                    if (end) {
                        if (name == "font") {
                            decodeText = true;
                            font = flower.ObjectDo.clone(font);
                            font.size = font.sizes.pop();
                            font.color = font.colors.pop();
                            font.under = font.unders.pop();
                            font.gap = font.gaps.pop();
                        }
                    } else {
                        if (name == "font") {
                            nextHtmlText = text.slice(last, i + 1);
                            lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - nextHtmlText.length);
                            decodeText = true;
                            font = flower.ObjectDo.clone(font);
                            font.sizes.push(font.size);
                            font.colors.push(font.color);
                            font.unders.push(font.under);
                            font.gaps.push(font.gap);
                            for (var a = 0; a < attributes.length; a++) {
                                if (attributes[a].name == "size") {
                                    if (parseInt(attributes[a].value)) {
                                        font.size = parseInt(attributes[a].value);
                                    }
                                } else if (attributes[a].name == "color") {
                                    if (attributes[a].value.charAt(0) == "#") {
                                        font.color = parseInt("0x" + attributes[a].value.slice(1, attributes[a].value.length));
                                    }
                                }
                            }
                        } else {
                            var isfxml = false;
                            for (var a = 0; a < attributes.length; a++) {
                                if (attributes[a].name == "xmlns:f" && attributes[a].value == "flower") {
                                    isfxml = true;
                                    break;
                                }
                            }
                            if (isfxml) {
                                single = true;
                                addSingle = {
                                    name: "ui",
                                    attributes: attributes,
                                }
                                i = this.__findFXML(text, last);
                                addSingle.htmlText = text.slice(last, i + 1);
                                decodeText = true;
                                lastHtmlText = lastHtmlText.slice(0, lastHtmlText.length - addSingle.htmlText.length);
                            }
                        }
                    }
                }
                last = -1;
            } else {
                if (last == -1) {
                    lastText += char;
                    if (lastTextStart == -1) {
                        lastTextStart = lastHtmlText.length - 1;
                    }
                }
            }
            if (i == len - 1) {
                decodeText = true;
            }
            var newLine = false;
            if (char == "\n" || char == "\r" || text.slice(i, i + "<br/>".length) == "<br/>") {
                newLine = true;
                decodeText = true;
                if (char == "\n" || char == "\r") {
                    line.endHtmlText = char;
                } else if (text.slice(i, i + "<br/>".length) == "<br/>") {
                    line.endHtmlText = "<br/>";
                }
            }
            if (decodeText) {
                this.__decodeText(line, oldFont, lastText, lastHtmlText, lastTextStart);
                lastHtmlText = "";
                lastText = "";
                lastTextStart = -1;
                if (single) {
                    if (addSingle.name == "img") {
                        this.__decodeImage(line, addSingle.attributes, addSingle.htmlText);
                    } else if (addSingle.name == "ui") {
                        this.__decodeUI(line, addSingle.attributes, addSingle.htmlText);
                    }
                }
                if (newLine) {
                    line.chars++;
                    line = this.__getNewLine(line, font);
                    lines.push(line);
                }
            }
            if (newLine && text.slice(i, i + "<br/>".length) == "<br/>") {
                i += "<br/>".length - 1;
            }
            lastHtmlText += nextHtmlText;
        }
        p[1] = "";
        for (var i = 0; i < lines.length; i++) {
            p[1] += lines[i].htmlText + lines[i].endHtmlText;
        }
        p[100] = true;
    }

    __findFXML(text, start) {
        var name = "";
        var len = text.length;
        for (var i = start + 1; i < len; i++) {
            if (text.charAt(i) == " " || text.charAt(i) == ">" || text.charAt(i) == "/") {
                name = text.slice(start + 1, i);
                break;
            }
        }
        var flag = 1;
        var num1 = name.length + 1;
        var num2 = name.length + 2;
        var sign1 = "<" + name;
        var sign2 = "</" + name;
        for (var i = start + 1 + name.length; i < len; i++) {
            if (text.slice(i, i + num1) == sign1) {
                flag++;
            }
            if (text.slice(i, i + num2) == sign2) {
                flag--;
                if (flag == 0) {
                    for (; i < len; i++) {
                        if (text.charAt(i) == ">") {
                            break;
                        }
                    }
                    return i;
                }
            }
        }
        return start;
    }

    __clearOldDisplay() {
        var p = this.$RichText;
        var lines = p[2];
        for (var l = 0; l < lines.length; l++) {
            var line = lines[l];
            for (var s = 0; s < line.sublines.length; s++) {
                var subline = line.sublines[s];
                var displays = subline.displays;
                for (var d = 0; d < displays.length; d++) {
                    var item = displays[d];
                    if (item.type == 0 && item.display) {
                        item.display.dispose();
                    }
                }
            }
        }
    }

    __decodeText(line, font, text, htmlText, textStart) {
        var p = this.$RichText;
        if (!line.sublines.length) {
            this.__addSubLine(line, font);
        }
        var subline = line.sublines[line.sublines.length - 1];
        var width = flower.$measureTextWidth(font.size, text);
        if (p[13]) {
            var max = this.width;
        } else {
            var item = {
                type: 0,
                display: null,
                font: font,
                text: text,
                htmlText: htmlText,
                textStart: textStart,
                width: width,
                height: font.size,
                x: subline.positionX,
                charIndex: subline.chars,
                chars: text.length,
                subline: subline
            };
            subline.chars += item.chars;
            line.chars += item.chars;
            if (item.height + subline.gap > subline.height) {
                var oldHeight = subline.height;
                subline.height = item.height + subline.gap;
                line.height += subline.height - oldHeight;
                line.positionY += subline.height - oldHeight;
            }
            subline.width += item.width;
            if (subline.width > line.width) {
                line.width = subline.width;
            }
            subline.text += item.text;
            line.text += item.text;
            subline.htmlText += item.htmlText;
            line.htmlText += item.htmlText;
            subline.positionX += item.width;
            subline.displays.push(item);
        }
    }

    __decodeImage(line, attributes, htmlText) {
        var p = this.$RichText;
        var ids = p[102];
        var id = "";
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i].name == "id") {
                id = attributes[i].value;
            }
        }
        var caches = p[101];
        if (!line.sublines.length) {
            this.__addSubLine(line, font);
        }
        var subline = line.sublines[line.sublines.length - 1];
        var image;
        var cache;
        if (!caches[htmlText]) {
            caches[htmlText] = [];
        }
        if (caches[htmlText].length) {
            for (var i = 0; i < caches[htmlText].length; i++) {
                if (caches[htmlText][i].use == false) {
                    image = caches[htmlText][i].display;
                    caches[htmlText][i].use = true;
                    cache = caches[htmlText][i];
                }
            }
        }
        if (!image) {
            var url = "";
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].name == "src") {
                    url = attributes[i].value;
                }
            }
            image = new flower.Bitmap();
            if (url != "") {
                var loader = new flower.URLLoader(url);
                loader.load();
                loader.addListener(flower.Event.COMPLETE, function (e) {
                    if (image.isDispose) {
                        return;
                    }
                    image.texture = e.data;
                    cache.width = image.width;
                    cache.height = image.height;
                    this.$setHtmlText(p[1]);
                }, this);
            }
            cache = {
                use: true,
                display: image,
                loader: loader
            };
            caches[htmlText].push(cache);
        }
        if (id != "") {
            ids[id] = image;
            if (!this[id]) {
                this[id] = image;
            }
        }
        if (p[13]) {
            if (subline.width + image.width > this.width) {
                this.__addSubLine(line, font);
                subline = line.sublines[line.sublines.length - 1];
            }
        }
        cache.width = image.width;
        cache.height = image.height;
        var item = {
            type: 1,
            display: image,
            text: "",
            htmlText: htmlText,
            textStart: 0,
            width: image.width,
            height: image.height,
            x: subline.positionX,
            charIndex: subline.chars,
            chars: 1,
            subline: subline
        };
        subline.chars += item.chars;
        line.chars += item.chars;
        if (item.height + subline.gap > subline.height) {
            var oldHeight = subline.height;
            subline.height = item.height + subline.gap;
            line.height += subline.height - oldHeight;
            line.positionY += subline.height - oldHeight;
        }
        subline.width += item.width;
        if (subline.width > line.width) {
            line.width = subline.width;
        }
        subline.text += item.text;
        line.text += item.text;
        subline.htmlText += item.htmlText;
        line.htmlText += item.htmlText;
        subline.positionX += item.width;
        subline.displays.push(item);
    }

    __decodeUI(line, attributes, htmlText) {
        var p = this.$RichText;
        var ids = p[102];
        var id = "";
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i].name == "id") {
                id = attributes[i].value;
            }
        }
        var caches = p[101];
        if (!line.sublines.length) {
            this.__addSubLine(line, font);
        }
        var subline = line.sublines[line.sublines.length - 1];
        var ui;
        var cache;
        if (!caches[htmlText]) {
            caches[htmlText] = [];
        }
        if (caches[htmlText].length) {
            for (var i = 0; i < caches[htmlText].length; i++) {
                if (caches[htmlText][i].use == false) {
                    ui = caches[htmlText][i].display;
                    caches[htmlText][i].use = true;
                    cache = caches[htmlText];
                    break;
                }
            }
        }
        if (!ui) {
            ui = new flower.UIParser();
            ui.percentWidth = null;
            ui.percentHeight = null;
            ui.parseUI(htmlText);
            cache = {
                use: true,
                display: ui
            };
            caches[htmlText].push(cache);
        }
        if (id != "") {
            ids[id] = ui;
            if (!this[id]) {
                this[id] = ui;
            }
        }
        if (p[13]) {
            if (subline.width + ui.width > this.width) {
                this.__addSubLine(line, font);
                subline = line.sublines[line.sublines.length - 1];
            }
        }
        cache.width = ui.width;
        cache.height = ui.height;
        var item = {
            type: 1,
            display: ui,
            text: "",
            htmlText: htmlText,
            textStart: 0,
            width: ui.width,
            height: ui.height,
            x: subline.positionX,
            charIndex: subline.chars,
            chars: 1,
            subline: subline
        };
        subline.chars += item.chars;
        line.chars += item.chars;
        if (item.height + subline.gap > subline.height) {
            var oldHeight = subline.height;
            subline.height = item.height + subline.gap;
            line.height += subline.height - oldHeight;
            line.positionY += subline.height - oldHeight;
        }
        subline.width += item.width;
        if (subline.width > line.width) {
            line.width = subline.width;
        }
        subline.text += item.text;
        line.text += item.text;
        subline.htmlText += item.htmlText;
        line.htmlText += item.htmlText;
        subline.positionX += item.width;
        subline.displays.push(item);
    }

    __resetCaches() {
        var caches = this.$RichText[101];
        for (var key in caches) {
            var list = caches[key];
            for (var i = 0; i < list.length; i++) {
                list[i].use = false;
            }
        }
    }

    __clearCaches() {
        var caches = this.$RichText[101];
        for (var key in caches) {
            var list = caches[key];
            while (list.length) {
                if (list[list.length - 1].use == false) {
                    var item = list.pop();
                    item.display.dispose();
                } else {
                    break;
                }
            }
        }
        var keys = flower.ObjectDo.keys(caches);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (caches[key].length == 0) {
                delete caches[key];
            }
        }
    }

    __getNewLine(lastLine, font) {
        var line;
        line = {
            index: 0,
            text: "",
            htmlText: "",
            endHtmlText: "",
            width: 0,
            height: font.size,
            x: 0,
            y: 0,
            charIndex: 0,
            chars: 0,
            sublines: [],
            positionY: 0,
        };
        if (lastLine) {
            line.y = lastLine.y + lastLine.height;
            line.charIndex = lastLine.charIndex + lastLine.chars;
            line.height = font.size + font.gap;
        }
        return line;
    }

    __addSubLine(line, font) {
        var subline = {
            index: line.sublines.length,
            text: "",
            htmlText: "",
            width: 0,
            gap: (line.index == 0 && line.sublines.length == 0 ? 0 : font.gap),
            height: font.size + (line.index == 0 && line.sublines.length == 0 ? 0 : font.gap),
            x: 0,
            y: line.positionY,
            charIndex: line.chars,
            chars: 0,
            displays: [],
            line: line,
            positionX: 0
        };
        line.sublines.push(subline);
        line.positionY += subline.height;
    }

    __getDefaultFocus() {
        var rect = new flower.Rect();
        rect.fillColor = 0;
        rect.width = 2;
        rect.height = 12;
        rect.visible = false;
        return rect;
    }

    __setFontSize(val) {
        val = +val || 0;
        var p = this.$RichText;
        if (val == p[10]) {
            return;
        }
        p[10] = val;
    }

    __setFontColor(val) {
        val = +val || 0;
        var p = this.$RichText;
        if (val == p[11]) {
            return;
        }
        p[11] = val;
    }

    __setHtmlText(val) {
        var p = this.$RichText;
        if (p[6] == val) {
            return;
        }
        this.$setHtmlText(val);
    }

    __setText(val) {
        var val = this.__changeText(val);
        this.__setHtmlText(val);
    }

    __setWordWrap(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        var p = this.$RichText;
        if (p[13] == val) {
            return;
        }
        p[13] = val;
        this.$setHtmlText(p[1]);
    }

    __changeText(val) {
        for (var i = 0; i < val.length; i++) {
            var char = val.charAt(i);
            if (char == " ") {
                val = val.slice(0, i) + "&nbsp;" + val.slice(i + 1, val.length);
            } else if (char == "<") {
                val = val.slice(0, i) + "&lt;" + val.slice(i + 1, val.length);
            } else if (char == ">") {
                val = val.slice(0, i) + "&gt;" + val.slice(i + 1, val.length);
            } else if (char == "&") {
                val = val.slice(0, i) + "&amp;" + val.slice(i + 1, val.length);
            }
        }
        return val;
    }

    __changeRealText(val) {
        for (var i = 0; i < val.length; i++) {
            if (val.slice(i, i + 5) == "&amp;") {
                val = val.slice(0, i) + "&" + val.slice(i + 5, val.length);
            } else if (val.slice(i, i + 6) == "&nbsp;") {
                val = val.slice(0, i) + " " + val.slice(i + 6, val.length);
            } else if (val.slice(i, i + 4) == "&lt;") {
                val = val.slice(0, i) + "<" + val.slice(i + 4, val.length);
            } else if (val.slice(i, i + 4) == "&gt;") {
                val = val.slice(0, i) + ">" + val.slice(i + 4, val.length);
            } else if (val.slice(i, i + 5) == "<br/>") {
                val = val.slice(0, i) + "\n" + val.slice(i + 5, val.length);
            }
        }
        return val;
    }

    $onFrameEnd() {
        var p = this.$RichText;
        if (p[100]) {
            p[100] = false;
            var lines = p[2];
            var y = p[8];
            var container = p[4];
            container.removeAll();
            var height = this.height;
            for (var l = 0; l < lines.length; l++) {
                var line = lines[l];
                if (line.y <= y + height && line.y + line.height < y + height) {
                    for (var s = 0; s < line.sublines.length; s++) {
                        var subline = line.sublines[s];
                        if (subline.y <= y + height && subline.y + subline.height < y + height) {
                            var displays = subline.displays;
                            for (var d = 0; d < displays.length; d++) {
                                var item = displays[d];
                                var display = item.display;
                                if (item.type == 0) {
                                    if (!display) {
                                        display = new flower.TextField(item.text);
                                        display.fontSize = item.font.size;
                                        display.fontColor = item.font.color;
                                        item.display = display;
                                    }
                                }
                                container.addChild(item.display);
                                display.x = item.x;
                                display.y = line.y + subline.y + subline.height - item.height;
                            }
                        }
                    }
                }
            }
            this.__clearCaches();
        }
        super.$onFrameEnd();
    }

    $update() {
        var p = this.$RichText;
        var caches = p[101];
        var flag = false;
        for (var key in caches) {
            var list = caches[key];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.width != item.display.width || item.height != item.display.height) {
                    flag = true;
                    item.width = item.display.width;
                    item.height = item.display.height;
                }
            }
        }
        if (flag) {
            this.$setHtmlText(p[1]);
        }
    }

    dispose() {
        this.__resetCaches();
        this.__clearCaches();
        flower.EnterFrame.remove(this.$update, this);
        super.dispose();
    }

    get fontSize() {
        return this.$RichText[10];
    }

    set fontSize(val) {
        this.__setFontSize(val);
    }

    get fontColor() {
        return this.$RichText[11];
    }

    set fontColor(val) {
        this.__setFontColor(val);
    }

    get htmlText() {
        return this.$RichText[1];
    }

    set htmlText(val) {
        this.__setHtmlText(val);
    }

    get text() {
        return this.$RichText[0];
    }

    set text(val) {
        this.__setText(val);
    }

    get wordWrap() {
        return this.$RichText[13];
    }

    set wordWrap(val) {
        this.__setWordWrap(val);
    }

    get displays() {
        return this.$RichText[102];
    }
}

black.RichText = RichText;
//////////////////////////End File:extension/black/RichText.js///////////////////////////



//////////////////////////File:extension/black/UIParser.js///////////////////////////
class UIParser extends Group {
    static classes = {
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
            "TextArea": "flower.TextArea",
            "Image": "flower.Image",
            "Group": "flower.Group",
            "RichText": "flower.RichText",
            "ScrollBar": "flower.ScrollBar",
            "HScrollBar": "flower.HScrollBar",
            "VScrollBar": "flower.VScrollBar",
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

            "RemoteDirection": "flower.RemoteDirection",
            "RemoteFile": "flower.RemoteFile"
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

    _className;
    _classNameSpace;
    _beforeScript;
    defaultClassName = "";
    classes;
    parseContent;
    parseUIAsyncFlag;
    loadContent;
    loadData;
    rootXML;
    hasInitFunction;
    scriptURL;
    scriptContent;
    staticScript;
    loadURL;
    moduleName = "local";
    namespaces = {};

    constructor(beforeScript = "") {
        super();
        this._beforeScript = beforeScript;
        this.classes = flower.UIParser.classes;
        this.percentWidth = this.percentHeight = 100;
    }

    parseUIAsync(url, data = null) {
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

    parseAsync(url) {
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

    loadContentError(e) {
        if (this.hasListener(flower.Event.ERROR)) {
            this.dispatchWith(flower.Event.ERROR, sys.getLanguage(3001, e.currentTarget.url));
        } else {
            sys.$error(3001, e.currentTarget.url);
        }
    }

    loadContentComplete(e) {
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

    loadScript(url) {
        this.scriptURL = url;
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadScriptComplete, this);
        loader.addListener(flower.Event.ERROR, this.loadContentError, this);
        loader.load();
    }

    loadScriptComplete(e) {
        this.scriptContent = e.data;
        this.loadNextRelationUI();
    }

    relationUI;
    relationIndex;

    loadNextRelationUI(e = null) {
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

    relationLoadError(e) {
        if (this.hasListener(flower.Event.ERROR)) {
            this.dispatchWith(flower.Event.ERROR, e.data);
        } else {
            $error(e.data);
        }
    }

    parseUI(content, data = null) {
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

    parse(content) {
        this.parseContent = content;
        var xml;
        if (typeof(content) == "string") {
            xml = flower.XMLElement.parse(content);
        }
        else {
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

    get className() {
        return this._className;
    }

    get classDefine() {
        return this.classes[this._classNameSpace][this._className];
    }

    decodeRootComponent(xml, classContent) {
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
            allClassName = className
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
                allClassName = className
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
            "className": allClassName,
        };
    }

    decodeScripts(before, className, scripts, script) {
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
                    script.content += before + "\t" + className + (func.isStatic ? "." : ".prototype.") + func.name + " = function(" +
                        func.params + ") " + func.content + "\n";
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
                    script.content += "\t\tenumerable: true,\n"
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
                            script.content += "\t\tget: function () {\n"
                            script.content += "\t\t\t" + getFunction.value + "\n";
                            script.content += "\t\t},\n";
                        }
                        if (setFunction) {
                            script.content += "\t\tset: function (val) {\n";
                            script.content += "\t\t\t" + setFunction.value + "\n";
                            script.content += "\t\t},\n";
                        }
                        script.content += "\t\tenumerable: true,\n"
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
    findNextFunction(content, start) {
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
                params: params,
            }
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

    decodeObject(before, className, funcName, createClass, xml, namespaces, propertyFunc, nameIndex) {
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
                setObject += before + "\tif(" + thisObj + ".__UIComponent) " + thisObj + ".$filePath = \"" + this.loadURL + "\";\n";
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
            if (atrName == "class") {
            } else if (atrName == "id") {
            } else if (atrArray.length == 2) {
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
                } else if (item.value != null && item.value != "") { //属性
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

    isNumberOrBoolean(str) {
        if (str == "true" || str == "false") {
            return true;
        }
        if (str.length > 3 && ( str.slice(0, 2) == "0x" || str.slice(0, 2) == "0X")) {
            for (var i = 2; i < str.length; i++) {
                var code = str.charCodeAt(i);
                if (code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102) {
                }
                else {
                    return false;
                }
            }
        }
        else {
            for (var i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i);
                if (code >= 48 && code <= 57) {
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    static registerLocalUIClass(name, cls, moduleName = "local") {
        flower.UIParser.classes[moduleName][name] = cls;
    }

    static setLocalUIClassContent(name, content, moduleName = "local") {
        flower.UIParser.classes[moduleName + "Content"][name] = content;
    }

    static getLocalUIClassContent(name, moduleName = "local") {
        return flower.UIParser.classes[moduleName + "Content"] ? flower.UIParser.classes[moduleName + "Content"][name] : null;
    }

    static getLocalUIClass(name, moduleName = "local") {
        return this.classes[moduleName] ? this.classes[moduleName][name] : null;
    }

    static setLocalUIURL(name, url, moduleName = "local") {
        this.classes[moduleName + "URL"][name] = url;
        this.classes.uiModule[url] = moduleName;
        this.classes.defaultClassNames[url] = name;
    }

    static addModule(moduleName, url) {
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

    static setModuleBeforeScript(moduleName, beforeScript) {
        flower.UIParser.classes.beforeScripts[moduleName] = beforeScript;
    }
}

black.UIParser = UIParser;
//////////////////////////End File:extension/black/UIParser.js///////////////////////////



//////////////////////////File:extension/black/ScrollBar.js///////////////////////////
class ScrollBar extends Group {

    constructor() {
        super();
        this.$ScrollerBar = {
            0: null,  //viewport
            1: true,  //autoVisibility
            2: null,  //thumb
            3: 0, //viewportX
            4: 0, //viewportY
            5: 0, //viewportScrollH
            6: 0, //viewportScrollV
            7: 0, //viewportContentWidth
            8: 0,  //viewportContentHeight
            9: 0, //viewportWidth
            10: 0, //viewportHeight
            20: null //horizontal:true vertical:false
        };
    }

    $onFrameEnd() {
        var p = this.$ScrollerBar;
        if (p[0] && p[20] != null) {
            var viewport = p[0];
            if (p[20]) {
                if ((p[3] != viewport.x || p[5] != viewport.scrollH || p[7] != viewport.contentWidth || p[9] != viewport.width)) {
                    p[3] = viewport.x;
                    p[5] = viewport.scrollH;
                    p[7] = viewport.contentWidth;
                    p[9] = viewport.width;
                    if (p[2]) {
                        p[2].width = this.width * p[9] / p[7];
                        var x = -(this.width - p[2].width) * (p[3] - p[5]) / (p[7] - p[9]);
                        if (x < 0) {
                            x = 0;
                        }
                        if (x + p[2].width > this.width) {
                            x = this.width - p[2].width;
                        }
                        p[2].x = x;
                    }
                }
            }
            if (!p[20]) {
                if ((p[4] != viewport.y || p[6] != viewport.scrollH || p[8] != viewport.contentHeight || p[10] != viewport.height)) {
                    p[4] = viewport.y;
                    p[6] = viewport.scrollH;
                    p[8] = viewport.contentHeight;
                    p[10] = viewport.height;
                    if (p[2]) {
                        p[2].height = this.height * p[10] / p[8];
                        var y = -(this.height - p[2].height) * (p[4] - p[6]) / (p[8] - p[10]);
                        if (y < 0) {
                            y = 0;
                        }
                        if (y + p[2].height > this.height) {
                            y = this.height - p[2].height;
                        }
                        p[2].y = y;
                    }
                }
            }
        }
        super.$onFrameEnd();
    }


    set viewport(val) {
        var p = this.$ScrollerBar;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
    }

    get viewport() {
        return this.$ScrollerBar[0];
    }

    set thumb(val) {
        var p = this.$ScrollerBar;
        if (p[2] == val) {
            return;
        }
        p[2] = val;
        if (p[2]) {
            if (p[2].parent != this) {
                this.addChild(p[2]);
            }
        }
    }

    get thumb() {
        return this.$ScrollerBar[2];
    }

    set autoVisibility(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        this.$ScrollerBar[1] = val;
    }

    get autoVisibility() {
        return this.$ScrollerBar[1];
    }
}

black.ScrollBar = ScrollBar;
//////////////////////////End File:extension/black/ScrollBar.js///////////////////////////



//////////////////////////File:extension/black/VScrollBar.js///////////////////////////
class VScrollBar extends ScrollBar {

    constructor() {
        super();
        this.$ScrollerBar[20] = false;
    }
}

black.VScrollBar = VScrollBar;
//////////////////////////End File:extension/black/VScrollBar.js///////////////////////////



//////////////////////////File:extension/black/HScrollBar.js///////////////////////////
class HScrollBar extends ScrollBar {

    constructor() {
        super();
        this.$ScrollerBar[20] = true;
    }
}

black.HScrollBar = HScrollBar;
//////////////////////////End File:extension/black/HScrollBar.js///////////////////////////



//////////////////////////File:extension/black/DataGroup.js///////////////////////////
class DataGroup extends Group {

    $DataGroup;

    constructor() {
        super();
        this.$DataGroup = {
            0: null, //data
            1: null, //itemRenderer
            2: null, //items
            3: null, //viewer
            4: 0,    //viewerWidth
            5: 0,    //viewerHeight
            6: 0,    //elementWidth
            7: 0,    //elementHeight
            8: null, //downItem
            9: null, //selectedItem
            10: false,//itemSelectedEnabled
            11: true,//itemClickedEnabled
            12: false,//requireSelection
            13: flower.TouchEvent.TOUCH_BEGIN, //selectTime
            14: 100, //validDownStateTime
            15: 0, //touchTime
            16: null, //touchItemData
        }
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchItem, this);
    }

    __onDataUpdate() {
        this.$addFlags(0x4000);
        var p = this.$DataGroup;
        if (p[10] && p[0].length && this.selectedItem == null) {
            this.__setSelectedItemData(p[0].getItemAt(0));
        }
    }

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout && (!this.$DataGroup[3] || !this.layout.fixElementSize)) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $addFlags(flags) {
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

    $onFrameEnd() {
        var p = this.$DataGroup;
        if (p[3]) {
            if (p[4] != p[3].width || p[5] != p[3].height) {
                p[4] = p[3].width;
                p[5] = p[3].height;
                this.$addFlags(0x4000);
            }
        }
        if (p[0] && p[1] && (this.$hasFlags(0x4000))) {
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
                var elementWidth = p[6];
                var elementHeight = p[7];
                if (p[0].length && (!elementWidth || !elementHeight)) {
                    if (!items.length) {
                        item = this.createItem(list.getItemAt(0), 0);
                        item.data = list.getItemAt(0);
                        items.push(item);
                    }
                    if (!elementWidth) {
                        p[6] = elementWidth = items[0].width;
                    }
                    if (!elementHeight) {
                        p[7] = elementHeight = items[0].height;
                    }
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
                    layout.updateList(p[4], p[5], firstItemIndex, p[6], p[7]);
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
        super.$onFrameEnd();
        if (measureSize) {
            if (layout) {
                if (!p[3] || !layout.fixElementSize) {
                    var size = layout.getContentSize();
                    p[52] = size.width;
                    p[53] = size.height;
                    flower.Size.release(size);
                }
                else if (p[2].length) {
                    var size = layout.measureSize(p[6], p[7], list.length);
                    p[52] = size.width;
                    p[53] = size.height;
                    flower.Size.release(size);
                }
            }
        }
    }

    $validateUIComponent(parent) {
        super.$validateUIComponent(parent);
        this.$IViewPort[0] = 0;
        this.$IViewPort[1] = 0;
        this.$IViewPort[2] = this.$DataGroup[52];
        this.$IViewPort[3] = this.$DataGroup[53];
    }

    createItem(data, index) {
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

    __onMouseItem(e) {
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

    __onTouchItem(e) {
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

    __onTouchUpdate(timeStamp, gap) {
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

    $releaseItem() {
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

    _canSelecteItem() {
        var p = this.$DataGroup;
        if (p[12] && p[10] && !p[9] && p[0] && p[0].length) {
            this.__setSelectedItemData(p[0].getItemAt(0));
        }
    }

    __setSelectedItemData(itemData) {
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

    onScroll() {
        this.$addFlag(0x400);
    }

    getItemByData(data) {
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

    getItemDataIndex(data) {
        var p = this.$DataGroup;
        for (var i = 0, i = p[0].length; i < len; i++) {
            if (p[0].getItemAt(i) == data) {
                return i;
            }
        }
        return -1;
    }

    $getDataProvider() {
        return this.$DataGroup[0];
    }

    $setDataProvider(val) {
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
    get dataProvider() {
        return this.$getDataProvider();
    }

    set dataProvider(val) {
        this.$setDataProvider(val);
    }

    get itemRenderer() {
        var p = this.$DataGroup;
        return p[1];
    }

    set itemRenderer(val) {
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
        p[6] = p[7] = 0;
        this.$addFlags(0x4000);
    }

    get numElements() {
        return this.$DataGroup[2].length;
    }

    set viewer(display) {
        this.$DataGroup[3] = display;
    }

    get viewer() {
        return this.$DataGroup[3];
    }

    get scrollEnabled() {
        return true;
    }

    get selectedIndex() {
        return this.getItemDataIndex(this.$DataGroup[9]);
    }

    set selectedIndex(val) {
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

    get selectedItem() {
        return this.$DataGroup[9];
    }

    set selectedItem(val) {
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

    get itemSelectedEnabled() {
        return this.$DataGroup[10];
    }

    set itemSelectedEnabled(val) {
        if (val == "false") {
            val = false;
        }
        if (this.$DataGroup[10] == val) {
            return;
        }
        this.$DataGroup[10] = !!val;
        this._canSelecteItem();
    }

    get itemClickedEnabled() {
        return this.$DataGroup[11];
    }

    set itemClickedEnabled(val) {
        if (val == "false") {
            val = false;
        }
        val = !!val;
        if (this.$DataGroup[11] == val) {
            return;
        }
        this.$DataGroup[11] = val;
    }

    get requireSelection() {
        return this.$DataGroup[12];
    }

    set requireSelection(val) {
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

    get selectTime() {
        return this.$DataGroup[13];
    }

    set selectTime(val) {
        if (val != flower.TouchEvent.TOUCH_BEGIN && val != flower.TouchEvent.TOUCH_END) {
            sys.$error(1008, val, "DataGroup", "selectTime");
            return;
        }
        this.$DataGroup[13] = val;
    }

    get validDownStateTime() {
        return this.$DataGroup[14];
    }

    /**
     * 有效触摸时间，即按下多少秒之后才触发按下 item 的操作
     * @param val
     */
    set validDownStateTime(val) {
        this.$DataGroup[14] = (+val) * 1000 || 0;
    }
}

UIComponent.registerEvent(DataGroup, 1110, "clickItem", flower.Event.CLICK_ITEM);
UIComponent.registerEvent(DataGroup, 1111, "selectedItemChange", flower.Event.SELECTED_ITEM_CHANGE);
UIComponent.registerEvent(DataGroup, 1112, "touchBeginItem", flower.Event.TOUCH_BEGIN_ITEM);

black.DataGroup = DataGroup;
//////////////////////////End File:extension/black/DataGroup.js///////////////////////////



//////////////////////////File:extension/black/ItemRenderer.js///////////////////////////
class ItemRenderer extends Group {

    _data;
    _itemIndex;
    _selected = false;

    constructor() {
        super();
        this.absoluteState = true;
    }

    get itemIndex() {
        return this._itemIndex;
    }

    $setItemIndex(val) {
        this._itemIndex = val;
    }

    setSelected(val) {
        this._selected = val;
        if (this._selected) {
            if (this.onSelectedEXE) {
                this.onSelectedEXE.call(this);
            }
        }
    }

    get selected() {
        return this._selected;
    }

    set selected(val) {
        if(val == "false") {
            val = false;
        }
        val = !!val;
        if (this._selected == val) {
            return;
        }
        this.setSelected(val);
    }

    $onClick() {
        if (this.onClickEXE) {
            this.onClickEXE.call(this);
        }
    }

    onClickEXE;

    set onClick(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onClickEXE = val;
    }

    get onClick() {
        return this.onClickEXE;
    }

    onSelectedEXE;

    set onSelected(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onSelectedEXE = val;
    }

    get onSelected() {
        return this.onClickEXE;
    }

    _list;

    get list() {
        return this._list;
    }

    $setList(val) {
        this._list = val;
    }
}

black.ItemRenderer = ItemRenderer;
//////////////////////////End File:extension/black/ItemRenderer.js///////////////////////////



//////////////////////////File:extension/black/Label.js///////////////////////////
class Label extends flower.TextField {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
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
        if (p[0] != null && p[1] == null && p [2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        //super.$onFrameEnd();
        if (this.$hasFlags(0x0800)) {
            this.$getContentBounds();
        }
        //super.$onFrameEnd();
        flower.DebugInfo.frameInfo.display++;
        flower.DebugInfo.frameInfo.text++;
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.setAlpha(this.$getConcatAlpha());
        }
    }

    dispose() {
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }
}

UIComponent.register(Label);
Label.prototype.__UIComponent = true;
black.Label = Label;
//////////////////////////End File:extension/black/Label.js///////////////////////////



//////////////////////////File:extension/black/Input.js///////////////////////////
class Input extends flower.TextInput {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
        this.$input = {
            0: null, //value
        }
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
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
        if (p[0] != null && p[1] == null && p [2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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

    $setText(val) {
        super.$setText(val);
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].value = this.text;
            if (this.text != this.$input[0].value + "") {
                this.__valueChange();
            }
        }
    }

    __valueChange() {
        if (this.$input[0] != null) {
            this.text = this.$input[0] instanceof flower.Value ? this.$input[0].value : this.$input[0];
        }
    }

    __onValueChange(e) {
        this.__valueChange();
    }

    //$onFrameEnd() {
    //    //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
    //    //    this.$validateUIComponent();
    //    //}
    //    super.$onFrameEnd();
    //}

    dispose() {
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].removeListener(flower.Event.UPDATE, this.__onValueChange, this);
        }
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }

    set value(val) {
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
    }

    get value() {
        return this.$input[0];
    }
}

UIComponent.register(Input);
Input.prototype.__UIComponent = true;
black.Input = Input;

UIComponent.registerEvent(Input, 1140, "startInput", flower.Event.START_INPUT);
UIComponent.registerEvent(Input, 1141, "stopInput", flower.Event.STOP_INPUT);
//////////////////////////End File:extension/black/Input.js///////////////////////////



//////////////////////////File:extension/black/TextArea.js///////////////////////////
class TextArea extends flower.TextInput {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
        this.$input = {
            0: null, //value
        }
    }

    $initNativeShow(textArea = false) {
        super.$initNativeShow(true);
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
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
        if (p[0] != null && p[1] == null && p [2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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

    $setText(val) {
        super.$setText(val);
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].value = this.text;
            if (this.text != this.$input[0].value + "") {
                this.__valueChange();
            }
        }
    }

    __valueChange() {
        if (this.$input[0] != null) {
            this.text = this.$input[0] instanceof flower.Value ? this.$input[0].value : this.$input[0];
        }
    }

    __onValueChange(e) {
        this.__valueChange();
    }

    //$onFrameEnd() {
    //    //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
    //    //    this.$validateUIComponent();
    //    //}
    //    super.$onFrameEnd();
    //}

    dispose() {
        if (this.$input[0] && this.$input[0] instanceof flower.Value) {
            this.$input[0].removeListener(flower.Event.UPDATE, this.__onValueChange, this);
        }
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }

    set value(val) {
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
    }

    get value() {
        return this.$input[0];
    }
}

UIComponent.register(TextArea);
TextArea.prototype.__UIComponent = true;
black.TextArea = TextArea;

UIComponent.registerEvent(TextArea, 1140, "startInput", flower.Event.START_INPUT);
UIComponent.registerEvent(TextArea, 1141, "stopInput", flower.Event.STOP_INPUT);
//////////////////////////End File:extension/black/TextArea.js///////////////////////////



//////////////////////////File:extension/black/Rect.js///////////////////////////
class Rect extends flower.Shape {

    constructor() {
        super();
        this.$Rect = {
            0: 0, //width
            1: 0, //height
        };
        this.$initUIComponent();
    }

    $addFlags(flags) {
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
    $validateUIComponent(parent) {
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
        if (p[0] != null && p[1] == null && p [2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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

    $setFillColor(val) {
        if (super.$setFillColor(val)) {
            this.$resetRect();
        }
    }

    $setFillAlpha(val) {
        if (super.$setFillAlpha(val)) {
            this.$resetRect();
        }
    }

    $setLineWidth(val) {
        if (super.$setLineWidth(val)) {
            this.$resetRect();
        }
    }

    $setLineColor(val) {
        if (super.$setLineColor(val)) {
            this.$resetRect();
        }
    }

    $setLineAlpha(val) {
        if (super.$setLineAlpha(val)) {
            this.$resetRect();
        }
    }

    $setWidth(val) {
        val = +val || 0;
        var p = this.$Rect;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$resetRect();
    }

    $resetRect() {
        var p = this.$Shape;
        if (p[9].length == 0) {
            p[9].push({});
        }
        var width = this.$Rect[0];
        var height = this.$Rect[1];
        var x = 0;
        var y = 0;
        p[9][0] = {
            points: [{x: x, y: y},
                {x: x + width, y: y},
                {x: x + width, y: y + height},
                {x: x, y: y + height},
                {x: x, y: y}],
            fillColor: p[0],
            fillAlpha: p[1],
            lineWidth: p[2],
            lineColor: p[3],
            lineAlpha: p[4]
        };
        this.$addFlags(0x0400);
    }

    $setHeight(val) {
        val = +val || 0;
        var p = this.$Rect;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        this.$resetRect();
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        //super.$onFrameEnd();
        this.$redraw();
        //super.$onFrameEnd();
        flower.DebugInfo.frameInfo.display++;
        flower.DebugInfo.frameInfo.shape++;
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.setAlpha(this.$getConcatAlpha());
        }
    }

    dispose() {
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }
}

UIComponent.register(Rect);
Rect.prototype.__UIComponent = true;
black.Rect = Rect;
//////////////////////////End File:extension/black/Rect.js///////////////////////////



//////////////////////////File:extension/black/Image.js///////////////////////////
class Image extends flower.Bitmap {

    $UIComponent;
    __source;
    __loader;

    constructor(source = null) {
        super();
        this.$initUIComponent();
        this.source = source;
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
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
        if (p[0] != null && p[1] == null && p [2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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

    $setSource(val) {
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
                this.__loader.$useImage();
                this.__loader.dispose();
            }
            if (typeof val == "string" && val.slice(0, 2) == "./" && this.$filePath) {
                val = flower.Path.joinPath(this.$filePath, val);
            }
            this.__loader = new flower.URLLoader(val);
            this.__loader.load();
            this.__loader.addListener(flower.Event.COMPLETE, this.__onLoadComplete, this);
            this.__loader.addListener(flower.Event.ERROR, this.__onLoadError, this);
        }
    }

    __onLoadError(e) {
        this.__loader = null;
    }

    __onLoadComplete(e) {
        this.__loader = null;
        this.texture = e.data;
        this.dispatchWith(flower.Event.COMPLETE);
    }

    //$onFrameEnd() {
    //    //if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
    //    //    this.$validateUIComponent();
    //    //}
    //    super.$onFrameEnd();
    //}

    dispose() {
        if (this.__loader) {
            this.__loader.$useImage();
            this.__loader.dispose();
        }
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }

    get source() {
        return this.__source;
    }

    set source(val) {
        this.$setSource(val);
    }

    get isLoading() {
        return this.__loader?true:false;
    }
}

UIComponent.register(Image);
Image.prototype.__UIComponent = true;
black.Image = Image;

UIComponent.registerEvent(Image, 1300, "loadComplete", flower.Event.COMPLETE);
//////////////////////////End File:extension/black/Image.js///////////////////////////



//////////////////////////File:extension/black/TileImage.js///////////////////////////
class TileImage extends Group {

    constructor() {
        super();
    }

    $setSource() {

    }
}

black.TileImage = Group;
//////////////////////////End File:extension/black/TileImage.js///////////////////////////



//////////////////////////File:extension/black/MaskUI.js///////////////////////////
class MaskUI extends flower.Mask {

    constructor(data) {
        super();
        if (data != null) {
            this._data = data;
        }
        this.$initUIComponent();
    }

    setData(val) {
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

    get data() {
        return this._data;
    }

    set data(val) {
        this.setData(val);
    }

    $createShape() {
        var shape = new Rect();
        shape.percentWidth = 100;
        shape.percentHeight = 100;
        return shape;
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
        this.$removeFlags(0x1000);
        //开始验证属性
        var p = this.$UIComponent;
        if (this.$hasFlags(0x0001)) {
            this.$getContentBounds();
        }
        parent = parent || this.parent;
        if (p[0] != null && p[1] == null && p [2] != null) {
            this.width = (p[2] - p[0]) * 2;
            this.x = +p[0];
        }
        else if (p[0] == null && p[1] != null && p[2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
            if (this.layout) {
                this.__flags |= 0x2000;
            }
        }
        this.__flags |= flags;
    }

    $validateChildrenUIComponent() {
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

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $onFrameEnd() {
        if (!this.parent.__UIComponent) {
            var flag = false;
            var count = 6;
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                super.$onFrameEnd();
                this.shape.$onFrameEnd();
                this.$resetLayout();
                flag = true;
                count--;
            }
            if (!flag) {
                super.$onFrameEnd();
                this.shape.$onFrameEnd();
                this.$resetLayout();
            }
            while (count && this.$hasFlags(0x1000)) {
                this.$validateUIComponent();
                super.$onFrameEnd();
                this.shape.$onFrameEnd();
                this.$resetLayout();
                flag = true;
                count--;
            }
        } else {
            super.$onFrameEnd();
            this.shape.$onFrameEnd();
            this.$resetLayout();
        }
    }

    dispose() {
        flower.Binding.removeChangeObject(this);
        this.removeAllBindProperty();
        this.$UIComponent[11].dispose();
        super.dispose();
    }
}
UIComponent.register(MaskUI, true);
MaskUI.prototype.__UIComponent = true;
black.MaskUI = MaskUI;
//////////////////////////End File:extension/black/MaskUI.js///////////////////////////



//////////////////////////File:extension/black/Button.js///////////////////////////
class Button extends Group {

    _enabled = true;

    constructor() {
        super();
        this.absoluteState = true;
        this.currentState = "up";

        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouch, this);
        this.addListener(flower.MouseEvent.MOUSE_OVER, this.__onMouse, this);
        this.addListener(flower.MouseEvent.MOUSE_OUT, this.__onMouse, this);
        this.addListener(flower.Event.REMOVED, this.__onRemoved, this);
    }

    $getMouseTarget(touchX, touchY, multiply) {
        var target = super.$getMouseTarget(touchX, touchY, multiply);
        if (target) {
            target = this;
        }
        return target;
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                this.currentState = "down";
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                this.currentState = "up";
                break;
        }
    }

    __onMouse(e) {
        if (this.currentState == "up" || this.currentState == "over") {
            switch (e.type) {
                case flower.MouseEvent.MOUSE_OVER :
                    this.currentState = "over";
                    break;
                case flower.MouseEvent.MOUSE_OUT :
                    this.currentState = "up";
                    break;
            }
        }
    }

    __onRemoved(e) {
        this.currentState = "up";
    }

    __setEnabled(val) {
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

    set enabled(val) {
        this.__setEnabled(val);
    }

    get enabled() {
        return this._enabled;
    }
}

UIComponent.registerEvent(Button, 1100, "click", flower.TouchEvent.TOUCH_END);

black.Button = Button;
//////////////////////////End File:extension/black/Button.js///////////////////////////



//////////////////////////File:extension/black/ToggleButton.js///////////////////////////
class ToggleButton extends Button {

    constructor() {
        super();

        this.$ToggleButton = {
            0: false, //
            1: null, //value
        };
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        var p = this.$ToggleButton;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                if (p[0]) {
                    this.currentState = "selectedDown";
                } else {
                    this.currentState = "selectedUp";
                }
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
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

    __setEnabled(val) {
        super._setEnabled(val);
        if (val == false && this.$ToggleButton[0]) {
            this.selected = false;
        }
    }

    __setSelected(val) {
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

    __valueChange() {
        var p = this.$ToggleButton;
        if (p[1]) {
            this.selected = p[1] instanceof flower.Value ? p[1].value : p[1];
        }
    }

    __onValueChange(e) {
        this.__valueChange();
    }

    get selected() {
        return this.$ToggleButton[0];
    }

    set selected(val) {
        this.__setSelected(val);
    }

    set value(val) {
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
    }

    get value() {
        return this.$ToggleButton[1];
    }
}

black.ToggleButton = ToggleButton;


UIComponent.registerEvent(ToggleButton, 1402, "change", flower.Event.CHANGE);
//////////////////////////End File:extension/black/ToggleButton.js///////////////////////////



//////////////////////////File:extension/black/CheckBox.js///////////////////////////
class CheckBox extends ToggleButton {
    constructor() {
        super();
    }
}

black.CheckBox = CheckBox;
//////////////////////////End File:extension/black/CheckBox.js///////////////////////////



//////////////////////////File:extension/black/RadioButton.js///////////////////////////
class RadioButton extends ToggleButton {

    _groupName;
    _group;

    constructor() {
        super();
    }

    __setSelected(val) {
        if (val == false && this._group && this._group.selection == this) {
            return;
        }
        super.__setSelected(val);
        if (this._group) {
            this._group.$itemSelectedChange(this);
        }
        this.dispatchWith(flower.Event.CHANGE);
    }

    __setGroupName(val) {
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

    get groupName() {
        return this._groupName;
    }

    set groupName(val) {
        this.__setGroupName(val);
    }

    get group() {
        return this._group;
    }
}

black.RadioButton = RadioButton;

UIComponent.registerEvent(RadioButton, 1401, "change", flower.Event.CHANGE);
//////////////////////////End File:extension/black/RadioButton.js///////////////////////////



//////////////////////////File:extension/black/RadioButtonGroup.js///////////////////////////
class RadioButtonGroup extends Group {

    _buttons = [];
    _groupName;
    _enabled = true;
    _selection;

    constructor(groupName) {
        super();
        if (groupName == null || groupName == "") {
            groupName = "group" + this.id;
        }
        this._groupName = groupName;
        RadioButtonGroup.groups.push(this);
    }

    addChildAt(child, index = 0) {
        super.addChildAt(child);
        if (child instanceof RadioButton && child.group != this) {
            child.groupName = this._groupName;
        }
    }

    $itemSelectedChange(button) {
        if (button.selected) {
            this.selection = button;
        }
    }

    $addButton(button) {
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

    $removeButton(button) {
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

    __setSelection(val) {
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

    get selection() {
        return this._selection;
    }

    set selection(val) {
        if (!this._enabled || this._selection == val) {
            return;
        }
        this.__setSelection(val);
    }

    get groupName() {
        return this._groupName;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(val) {
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
    static groups = [];

    static $addButton(button) {
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
}

black.RadioButtonGroup = RadioButtonGroup;

UIComponent.registerEvent(RadioButtonGroup, 1400, "change", flower.Event.CHANGE);
//////////////////////////End File:extension/black/RadioButtonGroup.js///////////////////////////



//////////////////////////File:extension/black/ToggleSwitch.js///////////////////////////
class ToggleSwitch extends ToggleButton {
    constructor() {
        super();
    }
}

black.ToggleSwitch = ToggleSwitch;
//////////////////////////End File:extension/black/ToggleSwitch.js///////////////////////////



//////////////////////////File:extension/black/ListBase.js///////////////////////////
class ListBase extends DataGroup {

    constructor() {
        super();
        this.requireSelection = true;
        this.itemSelectedEnabled = true;
        this.itemClickedEnabled = true;
    }
}

black.ListBase = ListBase;
//////////////////////////End File:extension/black/ListBase.js///////////////////////////



//////////////////////////File:extension/black/List.js///////////////////////////
class List extends ListBase {
    constructor() {
        super();
        this.layout = new VerticalLayout();
    }
}

black.List = List;
//////////////////////////End File:extension/black/List.js///////////////////////////



//////////////////////////File:extension/black/TabBar.js///////////////////////////
class TabBar extends ListBase {

    $TabBar;

    constructor() {
        super();
        this.$TabBar = {
            0: false,//more
            1: null, //moreButton
            2: null, //moreData
            3: null, //moreList
        };
        this.layout = new HorizontalLayout();
        this.layout.fixElementSize = false;
    }

    $setDataProvider(val) {
        var d = this.dataProvider;
        if (super.$setDataProvider(val)) {
            if(d) {
                d.removeListener(flower.Event.CHANGE, this.__onDataProviderSelectedChange, this);
            }
            if (val && val instanceof flower.ViewStack) {
                val.addListener(flower.Event.CHANGE, this.__onDataProviderSelectedChange, this);
            }
        }
    }

    __onDataProviderSelectedChange(e) {
        this.selectedItem = this.dataProvider.selectedChild;
    }

    __setSelectedItemData(item) {
        super.__setSelectedItemData(item);
        if (this.dataProvider instanceof flower.ViewStack) {
            this.dataProvider.selectedChild = this.selectedItem;
        }
    }

    showMore(e) {
        var p = this.$TabBar;
        var moreList = p[3];
        if (moreList) {
            var point = this.moreButton.localToGlobal();
            moreList.x = point.x;
            moreList.y = point.y + this.moreButton.height;
            flower.MenuManager.showMenu(moreList);
        }
    }

    get more() {
        return this.$TabBar[0];
    }

    set more(val) {
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

    get moreData() {
        if (!this.$TabBar[2]) {
            this.$TabBar[2] = new flower.ArrayValue();
        }
        return this.$TabBar[2];
    }

    get moreButton() {
        return this.$TabBar[1];
    }

    set moreButton(val) {
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

    get moreList() {
        return this.$TabBar[3];
    }

    set moreList(val) {
        if (this.$TabBar[3] == val) {
            return;
        }
        this.$TabBar[3] = val;
        val.dataProvider = this.moreData;
    }
}

black.TabBar = TabBar;
//////////////////////////End File:extension/black/TabBar.js///////////////////////////



//////////////////////////File:extension/black/ViewStack.js///////////////////////////
class ViewStack extends Group {

    _items = [];
    _selectedIndex = -1;
    _selectedItem;

    constructor() {
        super();
    }

    addChild(display) {
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

    addChildAt(display, index) {
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

    removeChild(display) {
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

    $removeChild(display) {
        super.$removeChild(display);
        this.removeChild(display);
    }

    removeChildAt(index) {
        var display = this._items.splice(index, 1)[0];
        if (display == this._selectedItem) {
            this._selectedItem = this._items[0];
            this._selectedIndex = 0;
            super.removeChild(display);
            this.dispatchWith(flower.Event.UPDATE);
            this.dispatchWith(flower.Event.REMOVED, display);
        } else {
            flower.DebugInfo.debug("ViewStack 设置 removeChildAt 超出索引范围:" + index, DebugInfo.ERROR);
        }
        return display;
    }

    getChildIndex(display) {
        if (display) {
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] == display) {
                    return i;
                }
            }
        }
        return -1;
    }

    setChildIndex(display, index) {
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

    sortChild(key, opt = 0) {
        super.sortChild(key, opt);
        this.dispatchWith(flower.Event.UPDATE);
    }

    _setSelectedIndex(val) {
        if (this._selectedItem) {
            super.removeChild(this._selectedItem);
        }
        this._selectedItem = null;
        this._selectedIndex = -1;
        var item = this._items[val];
        if (item) {
            this._selectedItem = item;
            this._selectedIndex = val;
            super.addChildAt(this._selectedItem, this.numChildren);
        }
        this.dispatchWith(flower.Event.CHANGE, this._selectedItem);
        this.dispatchWith(flower.Event.UPDATE);
    }

    get length() {
        return this._items.length;
    }

    getItemAt(index) {
        return this._items[index];
    }

    getItemIndex(item) {
        return this.getChildIndex(item);
    }

    setItemIndex(item, index) {
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

    set selectedIndex(val) {
        val = +val || 0;
        if (val == this._selectedIndex) {
            return;
        }
        if (val < 0 || val >= this._items.length) {
            val = -1;
        }
        this._setSelectedIndex(val);
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedChild(val) {
        var index = this.getChildIndex(val);
        this._setSelectedIndex(index);
    }

    get selectedChild() {
        return this._selectedItem;
    }
}

black.ViewStack = ViewStack;

UIComponent.registerEvent(ViewStack, 1500, "selectedItemChange", flower.Event.CHANGE);
//////////////////////////End File:extension/black/ViewStack.js///////////////////////////



//////////////////////////File:extension/black/Scroller.js///////////////////////////
class Scroller extends MaskUI {

    constructor() {
        super();

        this.$Scroller = {
            0: null,  //viewport
            1: flower.Size.create(0, 0), //viewSize
            2: 0,  //startX
            3: 0,  //startY
            4: [], //scrollDisX
            5: [], //scrollDisY
            6: [], //scrollTime
            7: 0.3,  //scrollOut
            8: 0,  //throw Tween
            9: 18, //	scrollThreshold
            10: null, //horizontalScrollBar
            11: null, //verticalScrollBar
            12: "auto", //scrollPolicyH
            13: "auto", //scrollPolicyV
            14: false, //isDraging
            15: false, //dragH
            16: false, //dragV
            52: 0,//contentWidth
            53: 0,//contentHeight
        }
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
        this.width = this.height = 100;
        //var bg = new Rect();
        //bg.fillColor = 0x555555;
        //bg.percentWidth = 100;
        //bg.percentHeight = 100;
        //this.addChild(bg);
    }

    addChildAt(child, index) {
        if (child instanceof flower.HScrollBar) {
            super.addChildAt(child, index);
            this.horizontalScrollBar = child;
        } else if (child instanceof flower.VScrollBar) {
            super.addChildAt(child, index);
            this.verticalScrollBar = child;
        } else {
            if (index == this.numChildren || index == this.numChildren - 1) {
                if (index == this.numChildren && this.numChildren - 1 >= 0 && this.getChildAt(this.numChildren - 1) instanceof flower.ScrollBar) {
                    index--;
                }
                if (index == this.numChildren - 1 && this.numChildren - 2 >= 0 && this.getChildAt(this.numChildren - 2) instanceof flower.ScrollBar) {
                    index--;
                }
            }
            super.addChildAt(child, index);
            if (this.viewport == null) {
                this.viewport = child;
            }
        }
    }

    $createShape() {
        var shape = new Rect();
        shape.percentWidth = 100;
        shape.percentHeight = 100;
        return shape;
    }

    __onTouchScroller(e) {
        var p = this.$Scroller;
        if (!p[0]) {
            return;
        }
        var x = this.lastTouchX;
        var y = this.lastTouchY;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                if (p[8]) {
                    p[8].dispose();
                    p[8] = null;
                }
                p[2] = x - p[0].x;
                p[3] = y - p[0].y;
                p[4].length = p[5].length = p[6].length = 0;
                p[14] = true;
                p[15] = false;
                p[16] = false;
                break;
            case flower.TouchEvent.TOUCH_MOVE:
                if ((Math.abs(x - p[0].x - p[2]) > p[9] || Math.abs(y - p[0].y - p[3]) > p[9]) && p[0] instanceof flower.DataGroup) {
                    p[0].$releaseItem();
                }
                if (!p[15] && this.$Scroller[12] != "off" && Math.abs(x - p[0].x - p[2]) > p[9] && p[0].contentWidth > p[0].width) {
                    p[15] = true;
                    p[2] = x - p[0].x;
                }
                if (!p[16] && this.$Scroller[13] != "off" && Math.abs(y - p[0].y - p[3]) > p[9] && p[0].contentHeight > p[0].height) {
                    p[16] = true;
                    p[3] = y - p[0].y;
                }
                var _x = p[0].x;
                var _y = p[0].y;
                if (p[15]) {
                    p[0].x = x - p[2];
                    if (p[0].x > 0) {
                        p[0].x = p[0].x * p[7];
                    }
                    if (p[0].x < -p[0].contentWidth + p[0].width) {
                        p[0].x = -p[0].contentWidth + p[0].width + (p[0].x - (-p[0].contentWidth + p[0].width)) * p[7];
                    }
                }
                if (p[16]) {
                    p[0].y = y - p[3];
                    if (p[0].y > 0) {
                        p[0].y = p[0].y * p[7];
                    }
                    if (p[0].y < -p[0].contentHeight + p[0].height) {
                        p[0].y = -p[0].contentHeight + p[0].height + (p[0].y - (-p[0].contentHeight + p[0].height)) * p[7];
                    }
                }
                p[4].push(p[0].x - _x);
                p[5].push(p[0].y - _y);
                p[6].push(flower.CoreTime.currentTime);
                if (p[4].length > 4) {
                    p[4].shift();
                    p[5].shift();
                    p[6].shift();
                }
                //p[7] = flower.CoreTime.currentTime;
                break;
            case flower.TouchEvent.TOUCH_END:
            case flower.TouchEvent.TOUCH_RELEASE:
                p[14] = p[15] = p[16] = false;
                var timeGap = 0.5;
                if (p[6].length) {
                    timeGap = flower.CoreTime.currentTime - p[6][0];
                }
                var disX = 0;
                var disY = 0;
                for (var i = 0; i < p[4].length; i++) {
                    disX += p[4][i];
                    disY += p[5][i];
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
                var toX = p[0].x + disX * 5;
                var toY = p[0].y + disY * 5;
                var flag = true;
                if (-toX + p[0].width > p[0].contentWidth) {
                    toX = p[0].width - p[0].contentWidth;
                    flag = false;
                }
                if (toX > 0) {
                    toX = 0;
                    flag = false;
                }
                if (toY < -p[0].contentHeight + p[0].height) {
                    toY = p[0].height - p[0].contentHeight;
                    if (p[0] == 961) {
                        flower.breakPoint();
                        p[0].contentHeight;
                    }
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
                var timeX = Math.abs(toX - p[0].x) / 350;
                var timeY = Math.abs(toY - p[0].y) / 350;
                var time = timeX > timeY ? timeX : timeY;
                if (time < 0.5) {
                    time = 0.5;
                }
                if (time > 5) {
                    time = 5;
                }
                p[8] = flower.Tween.to(p[0], time, {
                    x: toX,
                    y: toY
                }, flower.Ease.CUBIC_EASE_OUT);
                break;
        }
    }

    $onFrameEnd() {
        var p = this.$Scroller;
        if (p[0]) {
            if (p[10]) {
                if (p[12] == "on") {
                    if (p[10].autoVisibility) {
                        p[10].visible = p[15] ? true : false;
                    }
                } else if (p[12] == "off") {
                    p[10].visible = false;
                } else if (p[12] == "auto") {
                    if (p[10].autoVisibility) {
                        p[10].visible = p[15] && p[0].contentWidth > p[0].width ? true : false;
                    } else {
                        p[10].visible = p[0].contentWidth > p[0].width ? true : false;
                    }
                }
            }
            if (p[11]) {
                if (p[13] == "on") {
                    if (p[11].autoVisibility) {
                        p[11].visible = p[16] ? true : false;
                    }
                } else if (p[13] == "off") {
                    p[11].visible = false;
                } else if (p[13] == "auto") {
                    if (p[11].autoVisibility) {
                        p[11].visible = p[16] && p[0].contentHeight > p[0].height ? true : false;
                    } else {
                        p[11].visible = p[0].contentHeight > p[0].height ? true : false;
                    }
                }
            }
            p[0].width = this.width - (p[11] && p[13] != "off" && !p[11].autoVisibility ? p[11].width : 0);
            p[0].height = this.height - (p[10] && p[12] != "off" && !p[10].autoVisibility ? p[10].height : 0);
        }
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
        this.$resetLayout();
    }

    dispose() {
        flower.Size.release(this.$Scroller[1]);
        super.dispose();
    }

    $setViewport(val) {
        var p = this.$Scroller;
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
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        p[0].viewer = this;
        if (p[0].parent == null) {
            this.addChild(p[0]);
        }
        if (p[10]) {
            p[10].viewport = p[0];
        }
        if (p[11]) {
            p[11].viewport = p[0];
        }
    }

    /**
     * 设置水平滚动条
     * @param val
     */
    $setHorizontalScrollBar(val) {
        var p = this.$Scroller;
        if (p[10] == val) {
            return;
        }
        if (val == null) {
            p[10].viewport = null;
        }
        p[10] = val;
        if (p[10]) {
            p[10].viewport = p[0];
            if (p[10].parent == null) {
                this.addChild(p[10]);
            }
        }
    }

    /**
     * 设置垂直滚动条
     * @param val
     */
    $setVerticalScrollBar(val) {
        var p = this.$Scroller;
        if (p[11] == val) {
            return;
        }
        if (val == null) {
            p[11].viewport = null;
        }
        p[11] = val;
        if (p[11]) {
            p[11].viewport = p[0];
            if (p[11].parent == null) {
                this.addChild(p[11]);
            }
        }
    }

    $setWidth(val) {
        this.$Scroller[1].width = val;
    }

    $setHeight(val) {
        this.$Scroller[1].height = val;
    }

    $getWidth() {
        return this.$Scroller[1].width;
    }

    $getHeight() {
        return this.$Scroller[1].height;
    }

    //////////////////////////////////get&set//////////////////////////////////
    set viewport(val) {
        this.$setViewport(val);
    }

    get viewport() {
        return this.$Scroller[0];
    }

    set horizontalScrollBar(val) {
        this.$setHorizontalScrollBar(val);
    }

    set verticalScrollBar(val) {
        this.$setVerticalScrollBar(val);
    }

    set scrollPolicyH(val) {
        this.$Scroller[12] = val;
    }

    get scrollPolicyH() {
        return this.$Scroller[12];
    }

    set scrollPolicyV(val) {
        this.$Scroller[13] = val;
    }

    get scrollPolicyV() {
        return this.$Scroller[13];
    }

    set scrollThreshold(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        this.$Scroller[9] = val;
    }

    get scrollThreshold() {
        return this.$Scroller[9];
    }

    set scrollOut(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        this.$Scroller[7] = val;
    }

    get scrollOut() {
        return this.$Scroller[7];
    }
}

black.Scroller = Scroller;
//////////////////////////End File:extension/black/Scroller.js///////////////////////////



//////////////////////////File:extension/black/ComboBox.js///////////////////////////
class ComboBox extends Group {

    $comboBox;

    constructor() {
        super();
        this.$comboBox = {
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
        }
    }

    __onClickButton(e) {
        this.isOpen = !this.isOpen;
    }

    __listRemoved(e) {
        this.$comboBox[3] = false;
    }

    __listSelectItemChange(e) {
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

    __listClickItem(e) {
        flower.MenuManager.hideMenu();
    }

    __typeValueChange() {
        var p = this.$comboBox;
        if (p[6] && p[7]) {
            var array = p[5];
            var value = p[7] instanceof flower.Value ? p[7].value : p[7];
            this.selectedItem = array.getItemWith(p[6], value);
        }
    }

    __onTypeValueChange(e) {
        this.__typeValueChange();
    }

    set label(val) {
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
    }

    get label() {
        return this.$comboBox[0];
    }

    set button(val) {
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
    }

    get button() {
        return this.$comboBox[1];
    }


    set list(val) {
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
    }

    get list() {
        return this.$comboBox[2];
    }

    get isOpen() {
        return this.$comboBox[3];
    }

    set isOpen(val) {
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
        } else {
        }
    }

    get labelField() {
        return this.$comboBox[4];
    }

    set labelField(val) {
        var p = this.$comboBox;
        if(p[4] == val) {
            return;
        }
        p[4] = val;
        if (p[0]) {
            if (p[8] && p[8][p[4]]) {
                p[0].text = p[8][p[4]];
            } else {
                p[0].text = "";
            }
        }
    }

    get valueField() {
        return this.$comboBox[6];
    }

    set valueField(val) {
        if (this.$comboBox[6] == val) {
            return;
        }
        this.$comboBox[6] = val;
        this.__typeValueChange();
    }

    get value() {
        return this.$comboBox[7];
    }

    set value(val) {
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
                this.dataProvider = new flower.ArrayValue(p[7].enumList);
            }
            p[9] = false;
            this.__typeValueChange();
        }
    }

    get dataProvider() {
        return this.$comboBox[5];
    }

    set dataProvider(val) {
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

    get selectedItem() {
        return this.$comboBox[8];
    }

    set selectedItem(val) {
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

    get selectedIndex() {
        var p = this.$comboBox;
        return p[5] == null ? -1 : p[5].getItemIndex(p[8]);
    }

    set selectedIndex(val) {
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
}


black.ComboBox = ComboBox;
//////////////////////////End File:extension/black/ComboBox.js///////////////////////////



//////////////////////////File:extension/black/Panel.js///////////////////////////
class Panel extends Group {

    $Panel;

    constructor() {
        super();
        this.$Panel = {
            0: "",//title
            1: null, //titleLabel
            2: null, //closeButton
            3: PanelScaleMode.NO_SCALE, //scaleMode
            4: null, //iconImage
            5: "", //icon
        }
    }

    __changeTitle() {
        var p = this.$Panel;
        if (p[0] && p[1]) {
            p[1].text = p[0];
        }
    }

    /**
     * 验证 UI 属性
     */
    $validateUIComponent(parent) {
        this.$removeFlags(0x1000);
        //开始验证属性
        //console.log("验证 ui 属性");
        var p = this.$UIComponent;
        if (this.$hasFlags(0x0001)) {
            this.$getContentBounds();
        }
        parent = parent || this.parent;
        //console.log("验证 ui 属性",flower.EnterFrame.frame);
        if (p[0] != null && p[1] == null && p [2] != null) {
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
        if (p[3] != null && p[4] == null && p [5] != null) {
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

    $checkSetting() {
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

    $onClose() {
        this.dispatchWith(flower.Event.CLOSE);
        this.closePanel();
    }

    closePanel() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    set title(val) {
        if (this.$Panel[0] == val) {
            return;
        }
        this.$Panel[0] = val;
        this.__changeTitle();
    }

    get title() {
        return this.$Panel[0];
    }

    get titleLabel() {
        return this.$Panel[1];
    }

    set titleLabel(val) {
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

    get closeButton() {
        return this.$Panel[2];
    }

    set closeButton(val) {
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

    get iconImage() {
        return this.$Panel[4];
    }

    set iconImage(val) {
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

    get icon() {
        return this.$Panel[5];
    }

    set icon(val) {
        if (this.$Panel[5] == val) {
            return;
        }
        if (this.$Panel[4]) {
            this.$Panel[4].source = val;
        }
    }

    get scaleMode() {
        return this.$Panel[3];
    }

    set scaleMode(val) {
        if (this.$Panel[3] == val) {
            return;
        }
        this.$Panel[3] = val;
        this.$invalidateContentBounds();
    }
}

UIComponent.registerEvent(Panel, 1120, "close", flower.Event.CLOSE);

black.Panel = Panel;
//////////////////////////End File:extension/black/Panel.js///////////////////////////



//////////////////////////File:extension/black/Alert.js///////////////////////////
class Alert extends Panel {

    $Alert;

    constructor() {
        super();

        this.$Alert = {
            0: null, //confirmButton
            1: null, //cancelButton
            2: null, //contentLabel
            3: "", //content
        };
    }

    $onConfirm(e) {
        this.dispatchWith(flower.Event.CONFIRM);
        this.closePanel();
    }

    $onCancel(e) {
        this.dispatchWith(flower.Event.CANCEL);
        this.closePanel();
    }

    get confirmButton() {
        return this.$Alert[0];
    }

    set confirmButton(val) {
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

    get cancelButton() {
        return this.$Alert[1];
    }

    set cancelButton(val) {
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

    get contentLabel() {
        return this.$Alert[2];
    }

    set contentLabel(val) {
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

    get content() {
        return this.$Alert[3];
    }

    set content(val) {
        if (this.$Alert[3] == val) {
            return this.$Alert[3];
        }
        this.$Alert[3] = val;
        if (this.$Alert[2]) {
            this.$Alert[2].text = val;
        }
    }
}
UIComponent.registerEvent(Panel, 1130, "confirm", flower.Event.CONFIRM);
UIComponent.registerEvent(Panel, 1131, "cancel", flower.Event.CANCEL);

black.Alert = Alert;
//////////////////////////End File:extension/black/Alert.js///////////////////////////



//////////////////////////File:extension/black/Tree.js///////////////////////////
class Tree extends DataGroup {

    constructor() {
        super();
        this.$Tree = {
            0: null,//dataProvider
            1: new flower.ArrayValue(),//dataGroupDataProvider;
            2: {}, //openCloseTable
            3: "path" //pathField
        }
        this.requireSelection = true;
        this.itemSelectedEnabled = true;
        this.itemClickedEnabled = true;
        this.layout = new VerticalLayout();
        super.$setDataProvider(this.$Tree[1]);
    }

    $getDataProvider() {
        return this.$Tree[0];
    }

    $setDataProvider(val) {
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

    __onRemovedTreeDataUpdate(e) {
        var item = e.data;
        if (item.open && item.open instanceof flower.EventDispatcher) {
            item.open.removeListener(flower.Event.UPDATE, this.__onOpenItem, this);
        }
    }

    __onTreeDataUpdate(e) {
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
                        }
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
                        }
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
                    rootList = []
                }
                if (depth == rootURLDepth) {
                    rootList.push(url);
                }
                if (!urlList[url]) {
                    urlList[url] = {
                        item: item,
                        depth: depth,
                        children: []
                    }
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
                        }
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

    __onOpenItem(e) {
        this.__onTreeDataUpdate(null);
    }

    __readTreeShowItem(url, urlList, openURL, rootURLDepth, parentData) {
        var info = urlList[url];
        var item = info.item;
        if (typeof item == "string") {

        } else {
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

    expand(url) {
        var p = this.$Tree;
        var parentData = p[1];
        for (var i = 0; i < parentData.length; i++) {
            var item = parentData[i];
            if (item.path == url.slice(0, item.path.length)) {
                item.open.value = true;
            }
        }
    }

    get pathField() {
        return this.$Tree[3];
    }

    set pathField(val) {
        if (this.$Tree[3] == val) {
            return;
        }
        this.$Tree[3] = val;
        this.__onTreeDataUpdate(null);
    }
}

black.Tree = Tree;
//////////////////////////End File:extension/black/Tree.js///////////////////////////



//////////////////////////File:extension/black/Module.js///////////////////////////
class Module extends flower.EventDispatcher {

    __progress;
    __list;
    __index;
    __url;
    __direction;
    __beforeScript;
    __moduleKey;
    __hasExecute;
    __name;

    constructor(url, beforeScript = "") {
        super();
        Module.instance = this;
        this.__url = url;
        this.__beforeScript = beforeScript;
        this.__direction = flower.Path.getPathDirection(url);
        this.__moduleKey = "key" + Math.floor(Math.random() * 100000000);
        this.__progress = flower.DataManager.getInstance().createData("ProgressData");
    }

    load() {
        var url = this.__url;
        this.__progress.tip.value = url;
        var loader = new flower.URLLoader(url);
        loader.load();
        loader.addListener(flower.Event.COMPLETE, this.__onLoadModuleComplete, this);
        loader.addListener(flower.Event.ERROR, this.__loadError, this);
    }

    __onLoadModuleComplete(e) {
        var cfg = e.data;
        this.config = cfg;
        this.__name = cfg.name;
        flower.UIParser.addModule(cfg.name, this.__url, cfg.name);
        this.__list = [];
        var classes = cfg.classes;
        if (classes && Object.keys(classes).length) {
            for (var key in  classes) {
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

    __loadError(e) {
        if (this.hasListener(flower.Event.ERROR)) {
            this.dispatch(e);
        } else {
            $error(e.data);
        }
    }

    __loadNext(e) {
        var item;
        if (this.__index != 0) {
            item = this.__list[this.__index - 1];
            if (item.type == "data") {
                flower.DataManager.getInstance().addDefine(e.data, this.__moduleKey);
            } else if (item.type == "script") {
                this.script += e.data + "\n\n\n";
                if (this.__index == this.__list.length || this.__list[this.__index].type != "script") {
                    //trace("执行script:\n", this.script);
                    this.script += "flower.Module.$currentModule.data = module;";
                    Module.$currentModule = this;
                    eval(this.script);
                    Module.$currentModule = null;
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

    get url() {
        return this.__url;
    }

    get progress() {
        return this.__progress;
    }

    get name() {
        return this.__name;
    }

    static $currentModule;
}

black.Module = Module;
//////////////////////////End File:extension/black/Module.js///////////////////////////



})();
for(var key in black) {
	flower[key] = black[key];
}
