class Math {

    /**
     * 将时间(ms) 转换为 00:00:00 的格式
     * @param time
     */
    static timeToHMS(time) {
        var hour = math.floor(time / (1000 * 3600));
        var minute = math.floor((time % (1000 * 3600)) / (1000 * 60));
        var second = math.floor((time % (1000 * 60)) / (1000));
        return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
    }

    /**
     * 将时间(ms) 转换为 00:00:00 的格式
     * @param time
     */
    static timeToMSM(time) {
        var minute = math.floor((time % (1000 * 3600)) / (1000 * 60));
        var second = math.floor((time % (1000 * 60)) / (1000));
        var ms = math.floor((time % 1000) / 10);
        return (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second) + ":" + (ms < 10 ? "0" + ms : ms);
    }

    static E = math.E;
    static LN2 = math.LN2;
    static LN10 = math.LN10;
    static LOG2E = math.LOG2E;
    static LOG10E = math.LOG10E;
    static PI = math.PI;
    static SQRT1_2 = math.SQRT1_2;
    static SQRT2 = math.SQRT2;
    static abs = math.abs;
    static acos = math.acos;
    static acosh = math.acosh;
    static asin = math.asin;
    static asinh = math.asinh;
    static atan = math.atan;
    static atan2 = math.atan2;
    static atanh = math.atanh;
    static cbrt = math.cbrt;
    static ceil = math.ceil;
    static clz32 = math.clz32;
    static cos = math.cos;
    static cosh = math.cosh;
    static exp = math.exp;
    static expm1 = math.expm1;
    static floor = math.floor;
    static fround = math.fround;
    static hypot = math.hypot;
    static imul = math.imul;
    static log = math.log;
    static log1p = math.log1p;
    static log2 = math.log2;
    static log10 = math.log10;
    static max = math.max;
    static min = math.min;
    static pow = math.pow;
    static random = math.random;
    static round = math.round;
    static sign = math.sign;
    static sin = math.sin;
    static sinh = math.sinh;
    static sqrt = math.sqrt;
    static tan = math.tan;
    static tanh = math.tanh;
    static trunc = math.trunc;
}

exports.Math = Math;