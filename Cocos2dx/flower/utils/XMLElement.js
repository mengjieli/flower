class XMLElement extends XMLAttribute {
    namesapces;
    attributes;
    list;
    value;

    constructor() {
        super();
        this.namesapces = [];
        this.attributes = [];
        this.list = [];
    }

    addNameSpace(nameSpace) {
        this.namesapces.push(nameSpace);
    }

    getAttribute(name) {
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].name == name) {
                return this.attributes[i];
            }
        }
        return null;
    }

    getNameSapce(name) {
        for (var i = 0; i < this.namesapces.length; i++) {
            if (this.namesapces[i].name == name) {
                return this.namesapces[i];
            }
        }
        return null;
    }

    getElementByAttribute(atrName, value) {
        for (var i = 0; i < this.list.length; i++) {
            for (var a = 0; a < this.list[i].attributes.length; a++) {
                if (this.list[i].attributes[a].name == atrName && this.list[i].attributes[a].value == value) {
                    return this.list[i];
                }
            }
        }
        return null;
    }

    getElement(name) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].name == name) {
                return this.list[i];
            }
        }
        return null;
    }

    getElements(atrName) {
        var res = [];
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].name == atrName) {
                res.push(this.list[i]);
            }
        }
        return res;
    }

    getAllElements() {
        var res = [this];
        for (var i = 0; i < this.list.length; i++) {
            res = res.concat(this.list[i].getAllElements());
        }
        return res;
    }

    parse(content) {
        var delStart = -1;
        for (var i = 0; i < content.length; i++) {
            if (content.charAt(i) == "\r" || content.charAt(i) == "\n") {
                content = content.slice(0, i) + content.slice(i + 1, content.length);
                i--;
            }
            if (delStart == -1 && (content.slice(i, i + 2) == "<!" || content.slice(i, i + 2) == "<?")) {
                delStart = i;
            }
            if (delStart != -1 && content.charAt(i) == ">") {
                content = content.slice(0, delStart) + content.slice(i + 1, content.length);
                i = i - (i - delStart + 1);
                delStart = -1;
            }
        }
        this.readInfo(content);
        if (this.value == "") {
            this.value = null;
        }
    }

    readInfo(content, startIndex = 0) {
        var leftSign = -1;
        var len = content.length;
        var c;
        var j;
        for (var i = startIndex; i < len; i++) {
            c = content.charAt(i);
            if (c == "<") {
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c != " " && c != "\t") {
                        i = j;
                        break;
                    }
                }
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c == " " || c == "\t" || c == "/" || c == ">") {
                        this.name = content.slice(i, j);
                        i = j;
                        break;
                    }
                }
                break;
            }
        }
        var end = false;
        var attribute;
        var nameSpace;
        for (; i < len; i++) {
            c = content.charAt(i);
            if (c == "/") {
                end = true;
            }
            else if (c == ">") {
                i++;
                break;
            }
            else if (c == " " || c == "\t") {
            }
            else {
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c == "=" || c == " " || c == "\t") {
                        var atrName = content.slice(i, j);
                        if (atrName.split(":").length == 2) {
                            nameSpace = new XMLNameSpace();
                            this.namesapces.push(nameSpace);
                            nameSpace.name = atrName.split(":")[1];
                        }
                        else {
                            attribute = new XMLAttribute();
                            this.attributes.push(attribute);
                            attribute.name = atrName;
                        }
                        break;
                    }
                }
                j++;
                var startSign;
                for (; j < len; j++) {
                    c = content.charAt(j);
                    if (c == "\"" || c == "'") {
                        i = j + 1;
                        startSign = c;
                        break;
                    }
                }
                j++;
                for (; j < len; j++) {
                    c = content.charAt(j);
                    if (c == startSign && content.charAt(j - 1) != "\\") {
                        if (attribute) {
                            attribute.value = content.slice(i, j);
                            attribute = null;
                        }
                        else {
                            nameSpace.value = content.slice(i, j);
                            nameSpace = null;
                        }
                        i = j;
                        break;
                    }
                }
            }
        }
        if (end == true)
            return i;
        var contentStart;
        for (; i < len; i++) {
            c = content.charAt(i);
            if (c != " " && c != "\t") {
                contentStart = i;
                i--;
                break;
            }
        }
        for (; i < len; i++) {
            c = content.charAt(i);
            if (c == "<") {
                for (j = i + 1; j < len; j++) {
                    c = content.charAt(j);
                    if (c != " " && c != "\t") {
                        break;
                    }
                }
                if (c == "/") {
                    for (j = i + 1; j < len; j++) {
                        c = content.charAt(j);
                        if (c == " " || c == "\t" || c == ">") {
                            var endName = content.slice(i + 2, j);
                            if (endName != this.name) {
                                $error(1020, this.name, endName);
                            }
                            break;
                        }
                    }
                    if (this.list.length == 0) {
                        i--;
                        for (; i >= 0; i--) {
                            c = content.charAt(i);
                            if (c != " " && c != "\t") {
                                break;
                            }
                        }
                        this.value = content.slice(contentStart, i + 1);
                    }
                    for (; j < len; j++) {
                        c = content.charAt(j);
                        if (c == ">") {
                            i = j + 1;
                            break;
                        }
                    }
                    end = true;
                    break;
                }
                else {
                    var element = new XMLElement();
                    this.list.push(element);
                    i = element.readInfo(content, i) - 1;
                }
            }
        }
        return i;
    }

    static parse(content) {
        var xml = new XMLElement();
        xml.parse(content);
        return xml;
    }

}
exports.XMLElement = XMLElement;