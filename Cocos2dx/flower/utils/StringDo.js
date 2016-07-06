class StringDo {
    static changeStringToInner(content) {
        var len = content.length;
        for (var i = 0; i < len; i++) {
            if (content.charAt(i) == "\t") {
                content = content.slice(0, i) + "\\t" + content.slice(i + 1, len);
                i++;
                len++;
            } else if (content.charAt(i) == "\n") {
                content = content.slice(0, i) + "\\n" + content.slice(i + 1, len);
                i++;
                len++;
            } else if (content.charAt(i) == "\r") {
                content = content.slice(0, i) + "\\r" + content.slice(i + 1, len);
                i++;
                len++;
            } else if (content.charAt(i) == "\"") {
                content = content.slice(0, i) + "\\\"" + content.slice(i + 1, len);
                i++;
                len++;
            }
        }
        return content;
    }

    static findString(content, findString, begin) {
        begin = begin || 0;
        for (var i = begin; i < content.length; i++) {
            if (content.slice(i, i + findString.length) == findString) {
                return i;
            }
        }
        return -1;
    }

    static findStrings(content, findStrings, begin) {
        begin = begin || 0;
        for (var i = begin; i < content.length; i++) {
            for (var j = 0; j < findStrings.length; j++) {
                if (content.slice(i, i + findStrings[j].length) == findStrings[j]) {
                    return i;
                }
            }
        }
        return -1;
    }

    static jumpStrings(content, start, jumps) {
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

    static findCharNotABC(content, start) {
        start = +start;
        for (var i = start; i < content.length; i++) {
            if (!StringDo.isCharABC(content.charAt(i))) {
                return i;
            }
        }
        return content.length;
    }

    static replaceString(str, findStr, tstr) {
        for (var i = 0; i < str.length; i++) {
            if (StringDo.hasStringAt(str, [findStr], i)) {
                str = str.slice(0, i) + tstr + str.slice(i + findStr.length, str.length);
                i--;
            }
        }
        return str;
    }

    static hasStringAt(str, hstrs, pos) {
        for (var i = 0; i < hstrs.length; i++) {
            var hstr = hstrs[i];
            if (str.length - pos >= hstr.length && str.slice(pos, pos + hstr.length) == hstr) {
                return true;
            }
        }
        return false;
    }

    static findId(str, pos) {
        if (str.length <= pos) {
            return "";
        }
        var id = "";
        var code;
        for (var j = pos, len = str.length; j < len; j++) {
            code = str.charCodeAt(j);
            if (code >= 65 && code <= 90 || code >= 97 && code <= 122 || code == 36 || code == 95 || j != pos && code >= 48 && code <= 57) {
                id += str.charAt(j);
            } else {
                break;
            }
        }
        return id;
    }

    /**
     * 分析函数体
     * @param str
     * @param pos
     */
    static findFunctionContent(str, pos) {
        if (str.length <= pos) {
            return "";
        }
        //跳过程序空白
        pos = StringDo.jumpProgramSpace(str, pos);
        if (str.charAt(pos) != "{") {
            return "";
        }
        var end = pos + 1;
        var startPos;
        var endPos;
        var count = 0;
        while (true) {
            var startPos = StringDo.findString(str, "{", end);
            var endPos = StringDo.findString(str, "}", end);
            if (startPos != -1 && endPos != -1) {
                if (startPos < endPos) {
                    count++;
                    end = startPos + 1;
                } else {
                    count--;
                    end = endPos + 1;
                    if (count < 0) {
                        break;
                    }
                }
            } else if (startPos != -1) {
                return "";
            } else if (endPos != -1) {
                end = endPos + 1;
                count--;
                if (count < 0) {
                    break;
                }
            } else {
                return "";
            }
        }
        return str.slice(pos, end);
    }

    /**
     * 删除程序注释
     * @param str
     * @param pos
     */
    static deleteProgramNote(str, pos) {
        var end;
        for (var len = str.length; pos < len; pos++) {
            if (str.slice(pos, pos + 2) == "//") {
                end = StringDo.findStrings(str, ["\r", "\n"], pos);
                str = str.slice(0, pos) + str.slice(end, str.length);
                len = str.length;
                pos--;
            } else if (str.slice(pos, pos + 2) == "/*") {
                end = StringDo.findString(str, "*/", pos);
                if (end == -1) {
                    return len;
                }
                end += 2;
                while (true) {
                    var nextStart = StringDo.findString(str, "/*", end);
                    if (nextStart == -1) {
                        nextStart = len;
                    }
                    var nextEnd = StringDo.findString(str, "*/", end);
                    if (nextEnd == -1 || nextEnd > nextStart) {
                        break;
                    }
                    end = nextEnd + 2;
                }
                str = str.slice(0, pos) + str.slice(end, str.length);
                len = str.length;
            }
        }
        return str;
    }

    /**
     * 跳过程序空格，包含 " ","\t","\r","\n"
     * @param str
     * @param pos
     */
    static jumpProgramSpace(str, pos) {
        for (var len = str.length; pos < len; pos++) {
            var char = str.charAt(pos);
            if (char == " " || char == "　" || char == "\t" || char == "\r" || char == "\n") {
            } else {
                break;
            }
        }
        return pos;
    }
}

exports.StringDo = StringDo;