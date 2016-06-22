class Matrix {
    static sin;
    static cos;
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    tx = 0;
    ty = 0;
    _storeList = [];

    constructor() {
    }

    identity() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    }

    setTo(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    translate(x, y) {
        this.tx += x;
        this.ty += y;
    }

    rotate(angle) {
        flower.Matrix.sin = Math.sin(angle);
        flower.Matrix.cos = Math.cos(angle);
        this.setTo(this.a * flower.Matrix.cos - this.c * flower.Matrix.sin, this.a * flower.Matrix.sin + this.c * flower.Matrix.cos, this.b * flower.Matrix.cos - this.d * flower.Matrix.sin, this.b * flower.Matrix.sin + this.d * flower.Matrix.cos, this.tx * flower.Matrix.cos - this.ty * flower.Matrix.sin, this.tx * flower.Matrix.sin + this.ty * flower.Matrix.cos);
    }

    scale(scaleX, scaleY) {
        this.a = scaleX;
        this.d = scaleY;
        this.tx *= this.a;
        this.ty *= this.d;
    }

    prependMatrix(prep) {
        this.setTo(this.a * prep.a + this.c * prep.b, this.b * prep.a + this.d * prep.b, this.a * prep.c + this.c * prep.d, this.b * prep.c + this.d * prep.d, this.tx + this.a * prep.tx + this.c * prep.ty, this.ty + this.b * prep.tx + this.d * prep.ty);
    }

    prependTranslation(tx, ty) {
        this.tx += this.a * tx + this.c * ty;
        this.ty += this.b * tx + this.d * ty;
    }

    prependScale(sx, sy) {
        this.setTo(this.a * sx, this.b * sx, this.c * sy, this.d * sy, this.tx, this.ty);
    }

    prependRotation(angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        this.setTo(this.a * cos + this.c * sin, this.b * cos + this.d * sin, this.c * cos - this.a * sin, this.d * cos - this.b * sin, this.tx, this.ty);
    }

    prependSkew(skewX, skewY) {
        var sinX = Math.sin(skewX);
        var cosX = Math.cos(skewX);
        var sinY = Math.sin(skewY);
        var cosY = Math.cos(skewY);
        this.setTo(this.a * cosY + this.c * sinY, this.b * cosY + this.d * sinY, this.c * cosX - this.a * sinX, this.d * cosX - this.b * sinX, this.tx, this.ty);
    }

    get deformation() {
        if (this.a != 1 || this.b != 0 || this.c != 0 || this.d != 1)
            return true;
        return false;
    }

    save() {
        var matrix = flower.Matrix.create();
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;
        this._storeList.push(matrix);
    }

    restore() {
        var matrix = this._storeList.pop();
        this.setTo(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        flower.Matrix.release(matrix);
    }

    static $matrix = new Matrix();
    static matrixPool = [];

    static release(matrix) {
        if (!matrix) {
            return;
        }
        matrix._storeList.length = 0;
        flower.Matrix.matrixPool.push(matrix);
    }

    /**
     * 创建出来的矩阵可能不是规范矩阵
     * @returns {flower.Matrix}
     */
    static create() {
        var matrix = flower.Matrix.matrixPool.pop();
        if (!matrix) {
            matrix = new flower.Matrix();
        }
        return matrix;
    }

}

exports.Matrix = Matrix;