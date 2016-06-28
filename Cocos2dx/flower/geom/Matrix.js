class Matrix {
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
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        this.setTo(this.a * cos - this.c * sin, this.a * sin + this.c * cos,
            this.b * cos - this.d * sin, this.b * sin + this.d * cos,
            this.tx * cos - this.ty * sin, this.tx * sin + this.ty * cos);
    }

    scale(scaleX, scaleY) {
        this.a *= scaleX;
        this.d *= scaleY;
        this.tx *= scaleX;
        this.ty *= scaleY;
    }

    $updateScaleRation(scaleX, scaleY, angle) {
        var sin = 0;
        var cos = 1;
        if (angle) {
            sin = Math.sin(angle);
            cos = Math.cos(angle);
        }
        this.a = cos * scaleX;
        this.b = sin * scaleX;
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