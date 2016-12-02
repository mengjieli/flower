/**
 * 字符串处理程序
 * @constructor
 */
function StringDo() {

}

/**
 * 在一个字符串中查找某个特定的字符串，这个带查找的字符串具有特定的前缀和后缀
 * @param string
 * @param before
 * @param follow
 * @return 返回结果字符串的开头位置，如果没有找到返回-1
 */
StringDo.findStringWidthBeforeAndFollow = function (content, findString, befores, follows, begin) {
    var findInBefores = false;
    if (befores && befores.length) {
        for (var i = 0; i < befores.length; i++) {
            if (befores[i] == findString) {
                findInBefores = true;
                break;
            }
        }
    }
    while (true) {
        var find;
        var index;
        if (befores && befores.length) {
            find = false;
            for (var i = 0; i < befores.length; i++) {
                index = StringDo.findString(content, befores[i], begin);
                if (index != -1) {
                    find = true;
                    begin = index + befores[i].length;
                    break;
                }
            }
            if (find == false) {
                break;
            }
        }
        index = StringDo.findString(content, findString, begin);
        if (index == -1) {
            if (befores && befores.length) {
                continue;
            } else {
                break;
            }
        }
        begin = index;
        if (follows && follows.length) {
            find = false;
            index += findString.length;
            for (var i = 0; i < follows.length; i++) {
                if (content.slice(index, index + follows[i].length) == follows[i]) {
                    find = true;
                    break;
                }
            }
            if (find) {
                return begin;
            } else {
                if (befores && befores.length) {
                    if (!findInBefores) {
                        begin += findString.length;
                    }
                } else {
                    begin += findString.length;
                }
                continue;
            }
        } else {
            return begin;
        }
    }
    return -1;
}

/**
 * 查找某个特定的字符串，返回找到的第一个字符串的位置
 * @param content
 * @param findString
 * @return 返回找到的第一个字符串的位置
 */
StringDo.findString = function (content, findString, begin) {
    begin = begin || 0;
    for (var i = begin; i < content.length; i++) {
        if (content.slice(i, i + findString.length) == findString) {
            return i;
        }
    }
    return -1;
}

/**
 * 跳过某些制定的字符。比如 jumpStrings("abc",0,["a","b"]) = 2
 * @param content
 * @param start
 * @param jumps
 * @returns {*}
 */
StringDo.jumpStrings = function (content, start, jumps) {
    var pos = start;
    while (true) {
        var find = false;
        for (var i = 0; i < jumps.length; i++) {
            if (jumps[i] == content.slice(pos, pos + jumps[i].length)) {
                find = true;
                pos += jumps[i].length;
                break;
            }
        }
        if (find == false) {
            break;
        }
    }
    return pos;
}

/**
 * 查找下一个非字母的字符位置
 * @param content
 */
StringDo.findCharNotABC = function (content, start) {
    start = +start;
    for (var i = start; i < content.length; i++) {
        if (!StringDo.isCharABC(content.charAt(i))) {
            return i;
        }
    }
    return content.length;
}

/**
 * 判断某个字符是否为字母
 * @param char
 * @returns {boolean}
 */
StringDo.isCharABC = function (char) {
    var code = char.charCodeAt(0);
    if (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0) || code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0)) {
        return true;
    }
    return false;
}


/**
 * 跳过 start 之后紧接着的 “包” 字符串，“包”的形式如：字母(.字母)*
 * @param content
 * @param start
 */
StringDo.jumpPackage = function (content, start) {
    var index = StringDo.findCharNotABC(content, start);
    if (index == start) {
        return start;
    }
    while (true && index < content.length) {
        if (content.charAt(index) != ".") {
            break;
        }
        var next = StringDo.findCharNotABC(content, index + 1);
        if (next == index + 1) {
            break;
        }
        index = next;
    }
    return index;
}


//替换某些字符串为指定的字符串
StringDo.replaceString = function (str, findStr, tstr) {
    for (var i = 0; i < str.length; i++) {
        if (StringDo.hasStringAt(str, [findStr], i)) {
            str = str.slice(0, i) + tstr + str.slice(i + findStr.length, str.length);
            i--;
        }
    }
    return str;
}

//某个位置是否含有指定字符串之一
StringDo.hasStringAt = function (str, hstrs, pos) {
    for (var i = 0; i < hstrs.length; i++) {
        var hstr = hstrs[i];
        if (str.length - pos >= hstr.length && str.slice(pos, pos + hstr.length) == hstr) {
            return true;
        }
    }
    return false;
}

global.StringDo = StringDo;