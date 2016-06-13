var spawn = require('child_process').spawn;

/**
 * 调用 shell 脚本
 * @param cmd 命令名字 比如 svnadmin
 * @param params 参数数组
 * @param exitBack 执行完毕回调
 * @param exitThisObj
 * @param stdoutBack 输出回调
 * @param stdoutThisObj
 * @constructor
 */
var ShellCommand = function (cmd, params, exitBack, exitThisObj, stdoutBack, stdoutThisObj, stderrBack, stderrThisObj) {
    free = spawn(cmd, params);

    // 捕获标准输出并将其打印到控制台
    free.stdout.on('data', function (data) {
        if (stdoutBack) {
            stdoutBack.apply(stdoutThisObj, [data.toString()]);
        }
        //console.log('shell: ' + data);
    });

    // 捕获标准错误输出并将其打印到控制台
    free.stderr.on('data', function (data) {
        if (stderrBack) {
            stderrBack.apply(stderrThisObj, [data.toString()]);
        }
    });

    // 注册子进程关闭事件
    free.on('exit', function (code, signal) {
        if (exitBack) {
            exitBack.apply(exitThisObj, [code, free]);
        }
        //console.log('shell eixt ,exit: ' + code);
    });
    return free;
}

global.ShellCommand = ShellCommand;