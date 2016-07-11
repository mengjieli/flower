class ExcuteTask extends TaskBase {

    constructor(user, fromClient, cmd, msg) {
        super(user, fromClient, cmd, msg);
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    startTask(cmd, msg) {
        var taskId = msg.readUIntV();
        //console.log("excute task back",taskId);
        if (this.user) {
            this.user.excuteTask(taskId, msg);
        } else {
            var list = User.list;
            for (var i = 0; i < list.length; i++) {
                var user = list[i];
                if (user.excuteTask(taskId, msg) == true) {
                    break;
                }
            }
        }
        this.success();
    }
}