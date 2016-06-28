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

    transformPoint(pointX, pointY, resultPoint) {
        var x = this.a * pointX + this.c * pointY + this.tx;
        var y = this.b * pointX + this.d * pointY + this.ty;
        if (resultPoint) {
            resultPoint.setTo(x, y);
            return resultPoint;
        }
        return new Point(x, y);
    }

    $updateSR(scaleX, scaleY, rotation) {
        var sin = 0;
        var cos = 1;
        if (rotation) {
            sin = Math.sin(rotation);
            cos = Math.cos(rotation);
        }
        this.a = cos * scaleX;
        this.b = sin * scaleY;
        this.c = -sin * scaleX;
        this.d = cos * scaleY;
    }

    $updateRST(rotation, scaleX, scaleY, tx, ty) {
        var sin = 0;
        var cos = 1;
        if (rotation) {
            sin = Math.sin(rotation);
            cos = Math.cos(rotation);
        }
        this.a = cos * scaleX;
        this.b = sin * scaleX;
        this.c = -sin * scaleY;
        this.d = cos * scaleY;
        this.tx = cos * scaleX * tx - sin * scaleY * ty;
        this.ty = sin * scaleX * tx + cos * scaleY * ty;
    }

    $transformRectangle(rect) {
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var tx = this.tx;
        var ty = this.ty;
        var x = rect.x;
        var y = rect.y;
        var xMax = x + rect.width;
        var yMax = y + rect.height;
        var x0 = a * x + c * y + tx;
        var y0 = b * x + d * y + ty;
        var x1 = a * xMax + c * y + tx;
        var y1 = b * xMax + d * y + ty;
        var x2 = a * xMax + c * yMax + tx;
        var y2 = b * xMax + d * yMax + ty;
        var x3 = a * x + c * yMax + tx;
        var y3 = b * x + d * yMax + ty;
        var tmp = 0;
        if (x0 > x1) {
            tmp = x0;
            x0 = x1;
            x1 = tmp;
        }
        if (x2 > x3) {
            tmp = x2;
            x2 = x3;
            x3 = tmp;
        }
        rect.x = Math.floor(x0 < x2 ? x0 : x2);
        rect.width = Math.ceil((x1 > x3 ? x1 : x3) - rect.x);
        if (y0 > y1) {
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }
        if (y2 > y3) {
            tmp = y2;
            y2 = y3;
            y3 = tmp;
        }
        rect.y = Math.floor(y0 < y2 ? y0 : y2);
        rect.height = Math.ceil((y1 > y3 ? y1 : y3) - rect.y);
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