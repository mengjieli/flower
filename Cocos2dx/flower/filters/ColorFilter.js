class ColorFilter {
    __h = 0;
    __s = 0;
    __l = 0;

    constructor(h = 0, s = 0, l = 0) {
        this.__h = h;
        this.__s = s;
        this.__l = l;
    }

    get h() {
        return this.__h;
    }

    set h(val) {
        if (val > 180) {
            val = 180;
        }
        if (val < -180) {
            val = -180;
        }
        this._h = val;
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