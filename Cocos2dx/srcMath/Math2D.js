var math2d = {};
(function(math){
//////////////////////////File:math/2d/Math.js///////////////////////////
class Math {

    constructor() {

    }

    /**
     * 获取点到线段的垂足
     * @param point
     * @param segment
     */
    static getSegmentFootPoint(point, segment) {
        var vec1 = new Vector(point.x - segment.point1.x, point.y - segment.point1.y);
        var vec2 = new Vector(segment.point2.x - segment.point1.x, segment.point2.y - segment.point1.y);
        var vec3 = vec2.getUnitVector();
        vec3.length = vec1.dotProduct(vec2) / vec2.length;
        var vec4 = vec3.remove(vec1);
        return point.clone().addVector(vec4);
    }
}

math2d.getSegmentFootPoint = Math.getSegmentFootPoint;
//////////////////////////End File:math/2d/Math.js///////////////////////////



//////////////////////////File:math/2d/Point.js///////////////////////////
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

math2d.Point = Point;
//////////////////////////End File:math/2d/Point.js///////////////////////////



//////////////////////////File:math/2d/Segment.js///////////////////////////
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


math2d.Segment = Segment;
//////////////////////////End File:math/2d/Segment.js///////////////////////////



//////////////////////////File:math/2d/Vector.js///////////////////////////
/**
 * 向量
 * 为了避免计算斜率，通常用向量来解决相关计算问题
 */
class Vector {

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

    set length(val) {
        val = +val;
        var len = this.length;
        this.x *= val / len;
        this.y *= val / len;
    }

    /**
     * 向量长度
     * @returns {number|*}
     */
    get length() {
        return math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 获取向量的弧度
     * @returns {number|*}
     */
    get radian() {
        return math.atan2(this.y, thisx);
    }

    /**
     * 向量点积 |a||b|cosθ
     * @param vec
     * @returns {*}
     */
    dotProduct(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    /**
     * 向量叉积 |a||b|sinθ
     * @param vec
     */
    crossProduct(vec) {
        return this.x * vec.y - vec.x * this.y;
    }

    /**
     * 获取一个方向相同的单位向量
     */
    getUnitVector() {
        var len = this.length;
        return new Vector(this.x / len, this.y / len);
    }

    /**
     * 向量相加
     * @param vec
     */
    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    /**
     * 减去另外一个向量
     * @param vec
     */
    remove(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }

    /**
     * 反向
     */
    reverse() {
        this.x = -this.x;
        this.y = -this.y;
    }
}

math2d.Vector = Vector;
//////////////////////////End File:math/2d/Vector.js///////////////////////////



})(Math);
