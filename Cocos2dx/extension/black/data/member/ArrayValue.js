/**
 *
 * @Event
 * Event.ADD item
 * Event.REMOV item
 * Event.CHANGE ArrayValue 所有更新都会触发，包括排序
 */
class ArrayValue extends Value {

    _length;
    list;
    _key = "";
    _rangeMinKey = "";
    _rangeMaxKey = "";
    _selectedItem = null;
    _itemType = null;
    _subs = null;
    $sub = false;

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
        if (this._subs) {
            this.__checkSubPush(item);
            this.__addItemChange(item);
        }
        this.dispatchWith(flower.Event.ADD, item);
        this.dispatchWith(flower.Event.CHANGE, this);
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
        if (this._subs) {
            this.__checkSubAddItemAt(item, index);
            this.__addItemChange(item);
        }
        this.dispatchWith(flower.Event.ADD, item);
        this.dispatchWith(flower.Event.CHANGE, this);
    }

    shift() {
        if (!this.list.length) {
            return;
        }
        var item = this.list.shift();
        this._length = this._length - 1;
        this._lengthValue.value = this._length;
        if (this._subs) {
            this.__checkSubRemoveItem(item);
            this.__removeItemChange(item);
        }
        this.dispatchWith(flower.Event.REMOVE, item);
        this.dispatchWith(flower.Event.CHANGE, this);
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
                if (this._subs) {
                    this.__checkSubAddItemAt(args[i], startIndex + i);
                    this.__addItemChange(args[i]);
                }
                this.dispatchWith(flower.Event.ADD, args[i]);
            }
            this.dispatchWith(flower.Event.CHANGE, this);
        }
        else {
            list = this.list.splice(startIndex, delCount);
            this._length = this._length - delCount;
            this._lengthValue.value = this._length;
            for (i = 0; i < list.length; i++) {
                if (this._subs) {
                    this.__checkSubRemoveItem(list[i]);
                    this.__removeItemChange(list[i]);
                }
                this.dispatchWith(flower.Event.REMOVE, list[i]);
            }
            this.dispatchWith(flower.Event.CHANGE, this);
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
        if (this._subs) {
            this.__checkSubRemoveItem(item);
            this.__removeItemChange(item);
        }
        this.dispatchWith(flower.Event.REMOVE, item);
        this.dispatchWith(flower.Event.CHANGE, this);
        return item;
    }

    removeAll() {
        if (!this.list.length) {
            return;
        }
        if (this._subs) {
            this.__subRemoveAll();
        }
        while (this.list.length) {
            var item = this.list.pop();
            this._length = this._length - 1;
            this._lengthValue.value = this._length;
            if (this._subs) {
                this.__removeItemChange(item);
            }
            this.dispatchWith(flower.Event.REMOVE, item);
        }
        this.dispatchWith(flower.Event.CHANGE, this);
    }

    removeItem(item) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i] == item) {
                this.list.splice(i, 1);
                this._length = this._length - 1;
                this._lengthValue.value = this._length;
                if (this._subs) {
                    this.__checkSubRemoveItem(item);
                    this.__removeItemChange(item);
                }
                this.dispatchWith(flower.Event.REMOVE, item);
                this.dispatchWith(flower.Event.CHANGE, this);
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
        if (this._subs) {
            this.__checkSubRemoveItem(item);
            this.__removeItemChange(item);
        }
        this.dispatchWith(flower.Event.REMOVE, item);
        this.dispatchWith(flower.Event.CHANGE, this);
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
        this._lengthValue.value = this._length;
        if (this._subs) {
            this.__checkSubRemoveItem(item);
            this.__removeItemChange(item);
        }
        this.dispatchWith(flower.Event.REMOVE, item);
        this.dispatchWith(flower.Event.CHANGE, this);
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
        this.dispatchWith(flower.Event.CHANGE, this);
    }

    setItemIndex(item, index) {
        var itemIndex = this.getItemIndex(item);
        if (itemIndex < 0 || itemIndex == index) {
            return;
        }
        this.list.splice(itemIndex, 1);
        this.list.splice(index, 0, item);
        this.dispatchWith(flower.Event.CHANGE, this);
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

    createSubArrayValue(...args) {
        if (!this._subs) {
            this._subs = [];
        }
        var init = [];
        var list = this.list;
        for (var i = 0; i < list.length; i++) {
            var item = this.list[i];
            var flag = true;
            for (var a = 0; a < arguments.length; a++, a++) {
                if (item instanceof Value) {
                    if (item[arguments[a]].value != arguments[a + 1]) {
                        flag = false;
                        break;
                    }
                } else if (item[arguments[a]] != arguments[a + 1]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                init.push(item);
            }
        }
        var sub = new ArrayValue(init, this._itemType);
        sub.$sub = true;
        this._subs.push([sub, arguments]);
        this.__addAllItemChange();
        return sub;
    }

    /**
     * 绑定子集数组
     * @param sub 需要绑定的子集数组对象
     * @param args 绑定条件，按照 属性名称1,属性值1,属性名称2,属性值2,... 的顺序传入
     */
    linkSubArrayValue(sub, ...args) {
        if (!this._subs) {
            this._subs = [];
        }
        sub.$sub = true;
        sub.removeAll();
        this._subs.push([sub, args]);
        var list = this.list;
        for (var i = 0; i < list.length; i++) {
            var item = this.list[i];
            var flag = true;
            for (var a = 1; a < args.length; a++, a++) {
                if (item instanceof Value) {
                    if (item[args[a]].value != args[a + 1]) {
                        flag = false;
                        break;
                    }
                } else if (item[args[a]] != args[a + 1]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                sub.push(item);
            }
        }
        this.__addAllItemChange();
    }

    __addAllItemChange() {
        var list = this.list;
        var subs = this._subs;
        for (var i = 0; i < list.length; i++) {
            var item = this.list[i];
            for (var s = 0; s < subs.length; s++) {
                var args = subs[s][1];
                for (var a = 0; a < args.length; a++, a++) {
                    var key = args[a];
                    if (item[key] instanceof Value) {
                        item[key].addListener(flower.Event.CHANGE, this.__onItemChange, this, 0, item);
                    }
                }
            }
        }
    }

    __addItemChange(item) {
        var subs = this._subs;
        for (var s = 0; s < subs.length; s++) {
            var args = subs[s][1];
            for (var a = 0; a < args.length; a++, a++) {
                var key = args[a];
                if (item[key] instanceof Value) {
                    item[key].addListener(flower.Event.CHANGE, this.__onItemChange, this, 0, item);
                }
            }
        }
    }

    __removeItemChange(item) {
        var keys = item.membersKey;
        for (var i = 0; i < keys.length; i++) {
            if (item[keys[i]] instanceof flower.Value) {
                item[keys[i]].removeListener(flower.Event.CHANGE, this.__onItemChange, this);
            }
        }
    }

    __onItemChange(e, item) {
        var subs = this._subs;
        for (var s = 0; s < subs.length; s++) {
            var sub = subs[s][0];
            var args = subs[s][1];
            var oldIndex = sub.getItemIndex(item);
            var flag = true;
            for (var a = 0; a < args.length; a++, a++) {
                var key = args[a];
                var value = args[a + 1];
                if (item[key] instanceof Value) {
                    if (item[key].value != value) {
                        flag = false;
                        break;
                    }
                } else if (item[key] != value) {
                    flag = false;
                    break;
                }
            }
            if (oldIndex == -1 && flag) {
                var index = this.getItemIndex(item);
                var ind = -1;
                for (var f = index - 1; f >= 0; f++) {
                    ind = sub.getItemIndex(this.list[f]);
                    if (ind != -1) {
                        ind++;
                        break;
                    }
                }
                if (ind == -1) {
                    ind = 0;
                }
                sub.addItemAt(item, ind);
            } else if (oldIndex != -1 && !flag) {
                sub.removeItem(item);
            }
        }
    }

    __checkSubPush(item) {
        for (var s = 0; s < this._subs.length; s++) {
            var sub = this._subs[s][0];
            var args = this._subs[s][1];
            var flag = true;
            for (var a = 0; a < args.length; a++, a++) {
                var key = args[a];
                var value = args[a + 1];
                if (item[key] instanceof Value) {
                    if (item[key].value != value) {
                        flag = false;
                        break;
                    }
                } else if (item[key] != value) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                sub.push(item);
            }
        }
    }

    __checkSubAddItemAt(item, index) {
        for (var s = 0; s < this._subs.length; s++) {
            var sub = this._subs[s][0];
            var args = this._subs[s][1];
            var flag = true;
            for (var a = 0; a < args.length; a++, a++) {
                var key = args[a];
                var value = args[a + 1];
                if (item[key] instanceof Value) {
                    if (item[key].value != value) {
                        flag = false;
                        break;
                    }
                } else if (item[key] != value) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                var ind = -1;
                for (var f = index - 1; f >= 0; f++) {
                    ind = sub.getItemIndex(this.list[f]);
                    if (ind != -1) {
                        ind++;
                        break;
                    }
                }
                if (ind == -1) {
                    ind = 0;
                }
                sub.addItemAt(item, ind);
            }
        }
    }

    __checkSubRemoveItem(item) {
        for (var s = 0; s < this._subs.length; s++) {
            var sub = this._subs[s][0];
            var ind = sub.getItemIndex(item);
            if (ind != -1) {
                sub.removeItemAt(ind);
            }
        }
    }

    __subRemoveAll() {
        for (var s = 0; s < this._subs.length; s++) {
            var sub = this._subs[s][0];
            sub.removeAll();
        }
    }


    dispose() {
        var list = this.list;
        for (var i = 0; i < list.length; i++) {
            var value = this.list[i];
            if (value instanceof Value) {
                value.dispose();
            }
        }
        if (this._subs) {
            while (this._subs) {
                var sub = this._subs.pop()[0];
                sub.removeAll();
                sub.dispose();
            }
            this._subs = null;
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
                this.dispatchWith(flower.Event.REMOVE, item);
            }
            this.dispatchWith(flower.Event.CHANGE, this);
        }
    }

    get lengthIntValue() {
        return this._lengthValue;
    }
}

for (var i = 0; i < 100000; i++) {
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


exports.ArrayValue = ArrayValue;