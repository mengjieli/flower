class ExprAtr {
    type = "attribute";
    list;
    value;
    before;
    beforeClass;
    equalBefore;

    constructor() {
        this.list = [];
        this.equalBefore = false;
    }

    addItem(item) {
        if (this.list.length == 0 && item.type == "id" && item.val == "this") {
            return;
        }
        if (this.list.length == 0 && item.type == ".") {
            item.type = "id";
        }
        this.list.push(item);
    }

    checkPropertyBinding(commonInfo) {
        var atr;
        var atr2;
        var getValue = false;
        if (this.list[0].type == "()") {
            (this.list[0].val).checkPropertyBinding(commonInfo);
        }
        else if (this.list[0].type == "object") {
            (this.list[0].val).checkPropertyBinding(commonInfo);
        }
        else if (this.list[0].type == "id") {
            if (commonInfo.specialFor && this.list[0].val == "$i") {
                this.checkSpecialFor(commonInfo.specialFor, commonInfo.binding);
            }
            getValue = this.list[0].getValue;
            var name = this.list[0].val;
            if (name == "this") {
                this.list.shift();
            }
            if (commonInfo.objects["this"] && commonInfo.objects["this"][name] != null) {
                atr = commonInfo.objects["this"][name];
                atr2 = commonInfo.objects["this"]["$" + name];
                this.before = commonInfo.objects["this"];
            } else if (commonInfo.objects[name] != null) {
                this.before = commonInfo.objects[name];
                this.beforeClass = false;
                this.equalBefore = true;
            }
            else if (commonInfo.classes[name] != null) {
                this.before = commonInfo.classes[name];
                this.beforeClass = true;
                this.equalBefore = true;
            }
            else if (commonInfo.checks) {
                for (var c = 0; c < commonInfo.checks.length; c++) {
                    try {
                        atr = commonInfo.checks[c][name];
                        atr2 = commonInfo.checks[c]["$" + name];
                        if (atr != null) {
                            this.before = commonInfo.checks[c];
                        }
                    }
                    catch (e) {
                        atr = null;
                        this.before = null;
                    }
                    if (atr != null) {
                        break;
                    }
                }
            }
        }
        for (var i = 1; i < this.list.length; i++) {
            if (this.list[i].type == ".") {
                if (atr != null) {
                    var atrName = this.list[i].val;
                    getValue = this.list[i].getValue;
                    try {
                        if (i == this.list.length - 1) {
                            atr2 = atr["$" + atrName];
                        }
                        atr = atr[atrName];
                    }
                    catch (e) {
                        atr = null;
                    }

                }
            }
            else if (this.list[i].type == "call") {
                atr = null;
                atr2 = null;
                this.list[i].val.checkPropertyBinding(commonInfo);
            }
        }
        if (((atr != null && atr instanceof flower.Value) || (atr2 && atr2 instanceof flower.Value)) && !getValue) {
            if (atr2 && atr2 instanceof flower.Value) {
                this.value = atr2;
                commonInfo.result.push(atr2);
            } else {
                this.value = atr;
                commonInfo.result.push(atr);
            }
        }
    }

    getValue(params) {
        if (this.value) {
            if (this.value instanceof flower.ArrayValue || this.value instanceof  flower.ObjectValue) {
                return this.value;
            } else {
                return this.value.value;
            }
        }
        var getValue = false;
        var atr;
        var atr2;
        var lastAtr = null;
        if (this.list[0].type == "()") {
            atr = (this.list[0].val).getValue(params);
        }
        else if (this.list[0].type == "object") {
            atr = (this.list[0].val).getValue(params);
        }
        else if (this.list[0].type == "id") {
            if (params && params[this.list[0].val] != null) {
                this.before = params;
            }
            getValue = this.list[0].getValue;
            atr = this.before;
            lastAtr = this.before;
            if (!this.equalBefore) {
                try {
                    atr2 = atr["$" + this.list[0].val];
                    atr = atr[this.list[0].val];
                }
                catch (e) {
                    return null;
                }
            }
        }
        for (var i = 1; i < this.list.length; i++) {
            try {
                if (this.list[i].type == ".") {
                    if (i == this.list.length - 1) {
                        atr2 = atr["$" + this.list[i].val];
                    }
                    atr = atr[this.list[i].val];
                    getValue = this.list[i].getValue;
                }
                else if (this.list[i].type == "call") {
                    if (i == 2 && this.beforeClass) {
                        atr = atr.apply(null, (this.list[i].val).getValueList(params));
                    }
                    else {
                        atr = atr.apply(lastAtr, (this.list[i].val).getValueList(params));
                    }
                }
                if (i < this.list.length - 1 && this.list[i + 1].type == "call") {
                    continue;
                }
                lastAtr = atr;
            }
            catch (e) {
                return null;
            }
        }
        //if (!getValue && (atr && atr instanceof flower.Value)) {
        //    atr = atr.value;
        //}
        return atr;
    }

    setValue(val, params) {
        if (this.value) {
            this.value.value = val;
            return;
        }
        var atr;
        if (this.list.length > 1) {
            if (this.list[0].type == "id") {
                if (params && params[this.list[0].val] != null) {
                    atr = params[this.list[0].val];
                } else {
                    try {
                        atr = this.before[this.list[0].val];
                    } catch (e) {
                        return null;
                    }
                }
            }
        } else {
            if (this.list[0].type == "id") {
                if (params && params[this.list[0].val] != null) {
                    params[this.list[0].val] = val;
                } else {
                    try {
                        this.before[this.list[0].val] = val;
                    } catch (e) {
                        return null;
                    }
                }
            }
            return;
        }
        for (var i = 1; i < this.list.length; i++) {
            try {
                if (this.list[i].type == ".") {
                    if (i == this.list.length - 1) {
                        atr[this.list[i].val] = val;
                    } else {
                        atr = atr[this.list[i].val];
                    }
                }
            } catch (e) {
                return;
            }
        }
    }

    getAttribute(name) {
        var val = this.getValue();
        return val[name];
    }

    checkSpecialFor(list, binding) {
        var checkItemListener = function (item, type) {
            if (binding.hasDispose) {
                return;
            }
            var atr = item;
            var atr2 = item;
            for (var i = 1; i < this.list.length; i++) {
                try {
                    if (this.list[i].type == ".") {
                        if (i == this.list.length - 1) {
                            atr2 = atr["$" + this.list[i].val];
                        }
                        atr = atr[this.list[i].val];
                    }
                    else if (this.list[i].type == "call") {
                        if (i == 2 && this.beforeClass) {
                            atr = atr.apply(null, (this.list[i].val).getValueList());
                        }
                        else {
                            atr = atr.apply(lastAtr, (this.list[i].val).getValueList());
                        }
                    }
                    if (i < this.list.length - 1 && this.list[i + 1].type == "call") {
                        continue;
                    }
                }
                catch (e) {
                    return null;
                }
            }
            if (atr2 && atr2 instanceof flower.Value) {
                binding["$" + type + "ValueListener"](atr2);
            } else if (atr && atr instanceof flower.Value) {
                binding["$" + type + "ValueListener"](atr);
            }
        }
        if (this.list.length > 1) {
            for (var i = 0; i < list.length; i++) {
                checkItemListener.call(this, list[i], "add");
            }
        }
        list.addListener(flower.Event.ADD, function (e) {
            checkItemListener.call(this, e.data, "add");
        }, this);
        list.addListener(flower.Event.REMOVE, function (e) {
            checkItemListener.call(this, e.data, "remove");
        }, this);
    }

    print() {
        var content = "";
        for (var i = 0; i < this.list.length; i++) {
            content += this.list[i].val;
        }
        return content;
    }

}