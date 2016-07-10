var TaskSample = (function (_super) {

    __extends(TaskSample, _super);

    function TaskSample(user, fromClient, cmd, msg) {
        _super.call(this, user, fromClient, cmd, msg);
    }

    var d = __define, c = TaskSample;
    var p = c.prototype;

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    p.startTask = function (cmd, msg) {

    }

    return TaskSample;

})(TaskBase);

global.TaskSample = TaskSample;