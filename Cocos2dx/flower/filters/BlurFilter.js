class BlurFilter extends Filter {

    __blurX = 0;
    __blurY = 0;

    constructor(blurX = 4, blurY = 4) {
        super(100);
        this.blurX = blurX;
        this.blurY = blurY;
    }

    get blurX() {
        return this.__blurX;
    }

    set blurX(val) {
        val = +val||0;
        if(val < 1) {
            val = 0;
        }
        this.__blurX = val;
    }

    get blurY() {
        return this.__blurY;
    }

    set blurY(val) {
        val = +val||0;
        if(val < 1) {
            val = 0;
        }
        this.__blurY = val;
    }

    $getParams() {
        return [this.__blurX, this.__blurY];
    }
}

exports.BlurFilter = BlurFilter;