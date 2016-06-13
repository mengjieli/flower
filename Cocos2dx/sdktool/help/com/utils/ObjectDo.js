function ObjectDo() {

}

ObjectDo.deepClone = function (obj) {
    var result, oClass = ObjectDo.isClass(obj);
    //确定result的类型
    if (oClass === "Object") {
        result = {};
    } else if (oClass === "Array") {
        result = [];
    } else {
        return obj;
    }
    for (key in obj) {
        var copy = obj[key];
        if (ObjectDo.isClass(copy) == "Object") {
            result[key] = arguments.callee(copy);//递归调用
        } else if (ObjectDo.isClass(copy) == "Array") {
            result[key] = arguments.callee(copy);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

ObjectDo.isClass = function (o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}


global.ObjectDo = ObjectDo;