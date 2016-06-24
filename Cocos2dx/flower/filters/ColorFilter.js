class ColorFilter extends Filter {
    __h = 0;
    __s = 0;
    __l = 0;

    constructor(h = 0, s = 0, l = 0) {
        super(1);
        this.h = h;
        this.s = s;
        this.l = l;
    }

    $getParams() {
        return [this.h, this.s, this.l];
    }

    get h() {
        return this.__h;
    }

    set h(val) {
        val += 180;
        if (val < 0) {
            val = 360 - (-val) % 360;
        } else {
            val = val % 360;
        }
        val -= 180;
        this.__h = val;
    }

    get s() {
        return this.__s;
    }

    set s(val) {
        if (val > 100) {
            val = 100;
        } else if (val < -100) {
            val = -100;
        }
        this.__s = val;
    }

    get l() {
        return this.__l;
    }

    set l(val) {
        if (val > 100) {
            val = 100;
        } else if (val < -100) {
            val = -100;
        }
        this.__l = val;
    }
}

exports.ColorFilter = ColorFilter;