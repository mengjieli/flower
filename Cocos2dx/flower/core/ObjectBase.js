class ObjectBase {

    /**
     * 行为队列
     * @type {Array}
     */
    actions = [];
    /**
     * 每个对象都可以有数据
     * @type {null}
     */
    data = null;

    constructor(data) {
        this.data = data;
    }

    /**
     * 执行特定的行为
     * @param name 行为名称
     * @param args 行为参数
     */
    executeAction(name, ...args) {
        var action;
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].name == action.name) {
                action = actions[i];
                break;
            }
        }
        if (action) {
            action.execute.apply(action, args);
        }
    }

    getAction(name) {
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].name == action.name) {
                return actions[i];
            }
        }
        return null;
    }

    /**
     * 添加行为，如果之前已有相同名称的行为，会被顶替
     * @param action
     */
    addAction(action) {
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].name == action.name) {
                actions.splice(i, 1);
                break;
            }
        }
        this.actions.push(action);
    }

    /**
     * 移除行为
     * @param name 要移除的行为名称
     * @returns {*}
     */
    removeAction(name) {
        var actions = this.actions;
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            if (action.name == name) {
                return actions.splice(i, 1)[0];
            }
        }
        return null;
    }
}