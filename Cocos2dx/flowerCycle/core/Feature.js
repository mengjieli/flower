class Feature {

    items = [];

    constructor() {

    }

    /**
     * 获取某个特征
     * @param name
     * @returns {*}
     */
    getItemByName(name) {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].name == name) {
                return items[i];
            }
        }
        return null;
    }

    /**
     * 添加特征描述，如果之前已有此名称的特征，会覆盖之前的特征值，不会插入新的特征描述
     * @param name 特征名称,比如 x
     * @param value 特征值，比如 100
     */
    addItem(name, value) {
        var item = this.getItemByName(name);
        if(item) {
            item.value = value;
            return;
        }
        this.items.push({
            "name": name,
            "value": value
        })
    }

    /**
     * 移除特征，根据名字匹配
     * @param name
     * @returns {*}
     */
    removeItemByName(name) {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].name == name) {
                return items.splice(i, 1)[0];
            }
        }
        return null;
    }

    /**
     * 检测对象特征是否符合
     * @param object
     */
    checkObject(object) {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (object[item.name] != item.value) {
                return false;
            }
        }
        return true;
    }
}