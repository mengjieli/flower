class Point {

    _x = 0;
    _y = 0;

    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    set x(val) {
        this._x = +val;
    }

    get x() {
        return this._x;
    }

    set y(val) {
        this._y = +val;
    }

    get y() {
        return this._y;
    }

    getDistance(p) {
        return math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
    }

    /**
     * 加上向量位移
     * @param vec
     */
    addVector(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}

exports.Point = Point;