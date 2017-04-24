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

exports.Vector = Vector;