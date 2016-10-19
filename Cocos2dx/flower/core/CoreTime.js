class CoreTime {

    static currentTime = 0;
    static lastTimeGap;
    static $playEnterFrame = true;

    static $run(gap) {
        CoreTime.lastTimeGap = gap;
        CoreTime.currentTime += gap;
        EnterFrame.$update(CoreTime.currentTime, gap);
        if(CoreTime.$playEnterFrame) {
            Stage.$onFrameEnd();
        }
        TextureManager.getInstance().$check();
    }

    static getTime() {
        return CoreTime.currentTime;
    }
}

exports.CoreTime = CoreTime;