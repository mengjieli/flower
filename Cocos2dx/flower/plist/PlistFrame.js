class PlistFrame {
    _name;
    _x;
    _y;
    _width;
    _height;
    _rotation = false;
    _offX = 0;
    _offY = 0;
    _moveX;
    _moveY;
    _sourceHeight;
    _sourceWidth;
    _texture;
    _plist;

    constructor(name) {
        this._name = name;
    }

    decode(xml) {
        var content;
        for (var i = 0; i < xml.list.length; i++) {
            if (xml.list[i].name == "key") {
                content = xml.list[i + 1].value;
                if (content) {
                    while (content.indexOf("{") != -1) {
                        content = content.slice(0, content.indexOf("{")) + content.slice(content.indexOf("{") + 1, content.length);
                    }
                    while (content.indexOf("}") != -1) {
                        content = content.slice(0, content.indexOf("}")) + content.slice(content.indexOf("}") + 1, content.length);
                    }
                }
                if (xml.list[i].value == "frame") {
                    this._x = parseInt(content.split(",")[0]);
                    this._y = parseInt(content.split(",")[1]);
                    this._width = parseInt(content.split(",")[2]);
                    this._height = parseInt(content.split(",")[3]);
                }
                else if (xml.list[i].value == "rotated") {
                    if (xml.list[i + 1].name == "true") this._rotation = true;
                    else  this._rotation = false;
                }
                else if (xml.list[i].value == "offset") {
                    this._offX = parseInt(content.split(",")[0]);
                    this._offY = parseInt(content.split(",")[1]);
                }
                else if (xml.list[i].value == "sourceSize") {
                    this._sourceWidth = parseInt(content.split(",")[0]);
                    this._sourceHeight = parseInt(content.split(",")[1]);
                }
                i++;
            }
        }
        this._moveX = this._offX + (this._sourceWidth - this._width) / 2;
        this._moveY = this._offY + (this._sourceHeight - this._height) / 2;
    }

    get name() {
        return this._name;
    }

    $setPlist(plist) {
        this._plist = plist;
    }

    get texture() {
        if (!this._texture) {
            this._texture = this._plist.texture.createSubTexture(this._x, this._y, this._width, this._height, this._moveX, this._moveY, this._rotation);
        }
        return this._texture;
    }

    clearTexture() {
        this._texture = null;
    }
}