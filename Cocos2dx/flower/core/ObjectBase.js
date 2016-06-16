/**
 * 一个对象的三大关键要素:
 * 1. 属性
 *    1）直观属性 比如眼睛颜色，身长，体重
 *    2) 非直观属性 比如物种，年龄，饥饿，moeny，基因
 *    直观属性都可以用非直观属性来决定
 * 2. 行为 比如吃饭，睡觉，玩，几乎没有逻辑判断
 *    Tween 是行为
 * 3. 逻辑 比如饿了就要吃饭，困了就要睡觉，带有逻辑判断在里面
 */
class ObjectBase {

    /**
     * 拥有的行为
     * @type
     */
    $actions = {};

    /**
     * 每个对象都可以有属性
     * @type {null}
     */
    $data = null;

    /**
     * 正在执行的行为
     * @type {null}
     */
    $currentAction = null;

    $actionList = [];

    constructor(data) {
        this.data = data;
    }

    /**
     * 执行特定的行为
     * @param name 行为名称
     * @param args 行为参数
     */
    executeAction(name, ...args) {
        if (this.$currentAction) {
            this.$currentAction.stop();
            this.$currentAction = null;
        }
        var action = this.$actions[name];
        if (action) {
            this.$currentAction = action;
            action.addListener(Event.COMPLETE, this.onActionComplete, this);
            action.execute.apply(action, args);
        }
    }

    /**
     * 执行 Action 队列
     * @param name
     * @param args
     */
    executeActionList(name, ...args) {
        args = [name].concat(args);
        if (!this.$currentAction) {
            this.executeAction.apply(this, args);
        } else {
            this.$actionList.push(args);
        }
    }

    /**
     * 行为完成
     * @private
     * @param e
     */
    onActionComplete(e) {
        this.$currentAction = null;
        if (this.$actionList) {
            this.executeAction(this.$actionList.shift());
        }
    }

    /**
     * 当前正在执行的行为，没有行为也是一种行为，即静止，保持当前状态
     */
    get currentAction() {
        return this.$currentAction;
    }

    /**
     * 获取某种行为
     * @param name
     * @returns {null}
     */
    getAction(name) {
        return this.$actions[name];
    }

    /**
     * 添加行为，如果之前已有相同名称的行为，会被顶替
     * @param actionClass Action类
     */
    addAction(action) {
        var action = new actionClass(this);
        this.$actions[action.name] = action;
    }

    /**
     * 移除行为
     * @param name 要移除的行为名称
     * @returns {*}
     */
    removeAction(name) {
        delete this.$actions[name];
    }
}