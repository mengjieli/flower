class Action {

    /**
     * 行为名称
     * @type {string}
     */
    name = "";
    /**
     * 宿主数据
     * @type {null}
     */
    data = null;

    constructor() {
    }

    $owner;

    /**
     * 设置行为宿主
     * @param val
     */
    setOwner(val) {
        if (val) {
            this.$owner = val;
            this.data = this.$owner.data;
        } else {
            this.$owner = null;
            this.data = null;
        }
    }

    get owner() {
        return this.$owner;
    }

    /**
     * 执行行为
     */
    execute() {

    }
}