/**
 * 收集原有的 r,g,b 计算和，再根据 r,g,b 的比值重新分配 r,g,b
 */
class DyeingFilter extends Filter {
    __r = 0;
    __g = 0;
    __b = 0;

    constructor(r = 0.0, g = 0.0, b = 0.0) {
        super(3);
        this.r = r;
        this.g = g;
        this.b = b;
    }

    $getParams() {
        var sum = this.__r + this.__g + this.__b;
        return [this.__r / sum, this.__g / sum, this.__b / sum];
    }

    get r() {
        return this.__r;
    }

    set r(val) {
        this.__r = +val || 0;
    }

    get g() {
        return this.__g;
    }

    set g(val) {
        this.__g = +val || 0;
    }

    get b() {
        return this.__b;
    }

    set b(val) {
        this.__b = +val || 0;
    }
}

exports.DyeingFilter = DyeingFilter;