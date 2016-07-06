class Layout {

    _fixElementSize = false;
    elements = [];
    flag = false;

    constructor() {
    }

    isElementsOutSize(startX, starY, width, height) {
        return false;
    }

    getFirstItemIndex(elementWidth, elementHeight, startX, startY) {
        return 0;
    }


    getContentSize() {
        return null;
    }

    measureSize(elementWidth, elementHeight, elementCount) {
        return null;
    }

    addElementAt(element, index) {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            if (this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.elements.splice(index, 0, element);
        this.flag = true;
    }

    setElementIndex(element, index) {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            if (this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.elements.splice(index, 0, element);
        this.flag = true;
    }

    removeElement(element) {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            if (this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.flag = true;
    }

    removeElementAt(index) {
        this.elements.splice(index, 1);
        this.flag = true;
    }

    $setFlag() {
        this.flag = true;
    }

    updateList(width, height, startIndex = 0) {
    }

    $clear() {
        this.elements = [];
        this.flag = false;
    }

    get fixElementSize() {
        return this._fixElementSize;
    }

    set fixElementSize(val) {
        if(val == "false") {
            val = false;
        }
        this._fixElementSize = !!val;
    }

    static VerticalAlign = "vertical";
    static HorizontalAlign = "horizontal";
    static NoneAlign = "";
}

exports.Layout = Layout;