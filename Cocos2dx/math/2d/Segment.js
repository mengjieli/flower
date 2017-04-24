/**
 * 线段
 */
class Segment {

    _point1 = null;
    _point2 = null;

    constructor(x1 = 0, y1 = 0, x2 = 1, y2 = 0) {
        this._point1 = new Point(x1, y1);
        this._point2 = new Point(x2, y2);
    }

    get point1() {
        return this._point1;
    }

    get point2() {
        return this._point2;
    }

    /**
     * 判断线段所在的直线上的一点是否在线段范围内
     * @param point
     * @returns {boolean}
     */
    isPointInRange(point) {
        var vec1 = new Vector(point.x - this.point1.x, point.y - this.point1.y);
        var vec2 = new Vector(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
        return vec1.length <= vec2.length && vec1.x * vec2.x >= 0 && vec2.y * vec2.y >= 0 ? true : false;
    }
}


exports.Segment = Segment;