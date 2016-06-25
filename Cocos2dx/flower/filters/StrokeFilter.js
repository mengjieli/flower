class StrokeFilter extends Filter {

    __size = 0;
    __r = 0;
    __g = 0;
    __b = 0;

    /**
     * 描边滤镜
     * @param size 描边大小
     * @param color 描边颜色
     */
    constructor(size = 1, color = 0x000000) {
        super(2);
        this.size = size;
        this.color = color;
    }

    set size(val) {
        this.__size = val;
    }

    get size() {
        return this.__size;
    }

    set color(val) {
        val = +val || 0;
        this.__r = val >> 16 & 0xFF;
        this.__g = val >> 8 & 0xFF;
        this.__b = val & 0xFF;
    }

    get color() {
        return this.__r << 16 | this.__g << 8 | this.__b;
    }

    $getParams() {
        return [this.__size, this.__r/255, this.__g/255, this.__b/255];
    }
}

exports.StrokeFilter = StrokeFilter;