class GetQATestAccountTask extends TaskBase {

    constructor(user, fromClient, cmd, msg) {
        super(user, fromClient, cmd, msg);
    }

    /**
     * 开始执行任务
     * @param cmd
     * @param msg
     */
    startTask(cmd, msg) {
        if (!GetQATestAccountTask.config) {
            GetQATestAccountTask.config = JSON.parse((new File("./data/qaTest/config.json")).readContent());
        }
        if (!GetQATestAccountTask.accounts) {
            var file = new File("./data/qaTest/account.json");
            var content = file.readContent();
            GetQATestAccountTask.accounts = JSON.parse(content);
        }
        var accounts = GetQATestAccountTask.accounts;
        var index = GetQATestAccountTask.index;
        var remoteId = msg.readUIntV();
        var len = GetQATestAccountTask.config.userAccount;
        while (len >= 0) {
            var num = 100;
            if (len == 0) {
                len = -1;
                num = 0;
            } else {
                if (len > num) {
                    len -= num;
                } else {
                    num = len;
                    len = 0;
                }
            }
            var bytes = new VByteArray();
            bytes.writeUIntV(this.cmd + 1);
            bytes.writeUIntV(remoteId);
            bytes.writeUIntV(num);
            for (var i = 0; i < num; i++, index++) {
                bytes.writeUTFV(accounts[index].user);
                bytes.writeUTFV(accounts[index].password);
            }
            this.sendData(bytes);
        }
        GetQATestAccountTask.index = index;
        this.success();
    }

    static config;
    static accounts;
    static index = 0;
}