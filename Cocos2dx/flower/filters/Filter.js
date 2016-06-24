class Filter {

    //滤镜类型，在 shader 中与之对应
    //1 为 ColorFilter
    __type = 0;

    constructor(type) {
        this.__type = type;
    }

    get type() {
        return this.__type;
    }

    get params() {
        return this.$getParams();
    }

    $getParams() {

    }
}

exports.Filter = Filter;