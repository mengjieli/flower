class Rectangle {
    x;
    y;
    width;
    height;

    constructor(x, y, width, height) {
        this.x = +x || 0;
        this.y = +y || 0;
        this.width = +width || 0;
        this.height = +height || 0;
    }

    get right() {
        return this.x + this.width;
    }

    set right(value) {
        this.width = value - this.x;
    }

    get bottom() {
        return this.y + this.height;
    }

    set bottom(value) {
        this.height = value - this.y;
    }

    get left() {
        return this.x;
    }

    set left(value) {
        this.width += this.x - value;
        this.x = value;
    }

    get top() {
        return this.y;
    }

    set top(value) {
        this.height += this.y - value;
        this.y = value;
    }

    copyFrom(sourceRect) {
        this.x = sourceRect.x;
        this.y = sourceRect.y;
        this.width = sourceRect.width;
        this.height = sourceRect.height;
        return this;
    }

    setTo(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    contains(x, y) {
        return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y;
    }

    intersection(toIntersect) {
        return this.clone().$intersectInPlace(toIntersect);
    }

    $intersectInPlace(clipRect) {
        var x0 = this.x;
        var y0 = this.y;
        var x1 = clipRect.x;
        var y1 = clipRect.y;
        var l = Math.max(x0, x1);
        var r = Math.min(x0 + this.width, x1 + clipRect.width);
        if (l <= r) {
            var t = Math.max(y0, y1);
            var b = Math.min(y0 + this.height, y1 + clipRect.height);
            if (t <= b) {
                this.setTo(l, t, r - l, b - t);
                return this;
            }
        }
        this.setEmpty();
        return this;
    }

    intersects(toIntersect) {
        return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right) && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
    }

    isEmpty() {
        return this.width <= 0 || this.height <= 0;
    }

    setEmpty() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    clone() {
        return new flower.Rectangle(this.x, this.y, this.width, this.height);
    }

    _getBaseWidth(angle) {
        var u = Math.abs(Math.cos(angle));
        var v = Math.abs(Math.sin(angle));
        return u * this.width + v * this.height;
    }

    _getBaseHeight(angle) {
        var u = Math.abs(Math.cos(angle));
        var v = Math.abs(Math.sin(angle));
        return v * this.width + u * this.height;
    }

    static rectanglePool = [];

    static release(rect) {
        if (!rect) {
            return;
        }
        flower.Rectangle.rectanglePool.push(rect);
    }

    static create(x, y, width, height) {
        var rect = flower.Rectangle.rectanglePool.pop();
        if (!rect) {
            rect = new flower.Rectangle(x, y, width, height);
        } else {
            rect.x = +x || 0;
            rect.y = +y || 0;
            rect.width = +width || 0;
            rect.height = +height || 0;
        }
        return rect;
    }
}

exports.Rectangle = Rectangle;