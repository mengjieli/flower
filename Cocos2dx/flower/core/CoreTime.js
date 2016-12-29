class CoreTime {

    static currentTime = 0;
    static lastTimeGap;
    static $playEnterFrame = true;

    static $run(gap) {
        CoreTime.lastTimeGap = gap;
        CoreTime.currentTime += gap;
        EnterFrame.$update(CoreTime.currentTime, gap);
        var st = (new Date()).getTime();
        if (CoreTime.$playEnterFrame) {
            Stage.$onFrameEnd();
        }
        var et = (new Date()).getTime();
        flower.debugInfo.onFrameEnd += et - st;
        TextureManager.getInstance().$check();
    }

    static getTime() {
        return CoreTime.currentTime;
    }
}

exports.CoreTime = CoreTime;