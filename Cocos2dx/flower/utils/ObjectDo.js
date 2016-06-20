class ObjectDo {

    static toString(obj, maxDepth = 4, before = "", depth = 0) {
        before = before || "";
        depth = depth || 0;
        maxDepth = maxDepth || 4;
        var str = "";
        if (typeof(obj) == "string") {
            str += "\"" + obj + "\"";
        }
        else if (typeof(obj) == "number") {
            str += obj;
        }
        else if (obj instanceof Array) {
            if (depth > maxDepth) {
                return "...";
            }
            str = "[\n";
            for (var i = 0; i < obj.length; i++) {
                str += before + "\t" + flower.ObjectDo.toString(obj[i], maxDepth, before + "\t", depth + 1) + (i < obj.length - 1 ? ",\n" : "\n");
            }
            str += before + "]";
        }
        else if (obj instanceof Object) {
            if (depth > maxDepth) {
                return "...";
            }
            str = "{\n";
            for (var key in obj) {
                str += before + "\t" + key + "\t: " + flower.ObjectDo.toString(obj[key], maxDepth, before + "\t", depth + 1);
                str += ",\n";
            }
            if (str.slice(str.length - 2, str.length) == ",\n") {
                str = str.slice(0, str.length - 2) + "\n";
            }
            str += before + "}";
        }
        else {
            str += obj;
        }
        return str;
    }

    static keys(obj) {
        var list = [];
        for (var key in obj) {
            list.push(key);
        }
        return list;
    }

    static clone(obj) {
        var res = "";
        if (typeof(obj) == "string" || typeof(obj) == "number") {
            res = obj;
        }
        else if (obj instanceof Array) {
            res = obj.concat();
        }
        else if (obj instanceof Object) {
            res = {};
            for (var key in obj) {
                res[key] = ObjectDo.clone(obj[key]);
            }
        }
        else {
            if (obj.hasOwnProperty("clone")) {
                res = obj.clone();
            } else {
                res = obj;
            }
        }
        return res;
    }
}

exports.ObjectDo = ObjectDo;