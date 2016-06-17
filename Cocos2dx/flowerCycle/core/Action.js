class Action extends EventDispatcher {

    /**
     * 行为名称
     * @type {string}
     */
    name = "";

    /**
     * 描述，用自然语言描述行为
     * @type {string}
     */
    desc;

    /**
     * 当前行为的状态，用自然语言描述
     * @type {string}
     */
    state;

    /**
     * 行为执行的时间
     */
    time;

    /**
     * 行为的总时长
     */
    life;

    /**
     * 行为执行到第几次
     */
    currentCount;

    /**
     * 行为执行的总次数
     */
    count;


    /**
     * 宿主属性
     * @type {null}
     */
    data = null;

    /**
     * 宿主
     */
    $owner;

    constructor(owner) {
        super();
        this.$owner = val;
        this.data = this.$owner.data;
    }

    /**
     * 继续当前行为
     */
    play() {

    }

    /**
     * 暂停行为
     */
    pause() {

    }

    /**
     * 停止当前行为，停止后会重置属性，比如进度，持续时间都归零
     */
    stop() {

    }

    get owner() {
        return this.$owner;
    }

    /**
     * 执行行为
     */
    execute() {

    }

    /**
     * 行为完成
     */
    complete() {
        this.dispatchWidth(Event.COMPLETE);
    }
}