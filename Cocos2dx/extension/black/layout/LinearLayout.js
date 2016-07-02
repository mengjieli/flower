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

    updateList(width, height, startIndex = 0) {
        flower.trace("update layout",flower.EnterFrame.frame);
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
                var eh = list[0].height;
                for (i = 0; i < len; i++) {
                    list[i].y = (i + startIndex) * (eh + this._gap);
                }
                this._maxY = (len + startIndex) * (eh + this._gap);
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
                var ew = list[0].width;
                for (i = 0; i < len; i++) {
                    list[i].x = (i + startIndex) * (ew + this._gap);
                }
                this._maxX = (len + startIndex) * (ew + this._gap);
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