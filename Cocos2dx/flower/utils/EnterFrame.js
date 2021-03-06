class EnterFrame {
    static enterFrames = [];
    static waitAdd = [];

    static add(call, owner) {
        for (var i = 0; i < flower.EnterFrame.enterFrames.length; i++) {
            if (flower.EnterFrame.enterFrames[i].call == call && flower.EnterFrame.enterFrames[i].owner == owner) {
                return;
            }
        }
        for (i = 0; i < flower.EnterFrame.waitAdd.length; i++) {
            if (flower.EnterFrame.waitAdd[i].call == call && flower.EnterFrame.waitAdd[i].owner == owner) {
                return;
            }
        }
        flower.EnterFrame.waitAdd.push({"call": call, "owner": owner});
    }

    static remove(call, owner) {
        for (var i = 0; i < flower.EnterFrame.enterFrames.length; i++) {
            if (flower.EnterFrame.enterFrames[i].call == call && flower.EnterFrame.enterFrames[i].owner == owner) {
                flower.EnterFrame.enterFrames.splice(i, 1);
                return;
            }
        }
        for (i = 0; i < flower.EnterFrame.waitAdd.length; i++) {
            if (flower.EnterFrame.waitAdd[i].call == call && flower.EnterFrame.waitAdd[i].owner == owner) {
                flower.EnterFrame.waitAdd.splice(i, 1);
                return;
            }
        }
    }

    static frame = 0;
    static updateFactor = 1;
    static __lastFPSTime = 0;
    static __lastFPSFrame = 0;

    static $update(now, gap) {
        flower.EnterFrame.frame++;
        var st = (new Date()).getTime();
        var et;
        flower.CallLater.$run();
        et = (new Date()).getTime();
        DebugInfo.cpu.callLater += et - st;
        st = et;
        flower.DelayCall.$run();
        et = (new Date()).getTime();
        DebugInfo.cpu.delayCall += et - st;
        st = et;
        if (flower.EnterFrame.waitAdd.length) {
            flower.EnterFrame.enterFrames = flower.EnterFrame.enterFrames.concat(flower.EnterFrame.waitAdd);
            flower.EnterFrame.waitAdd = [];
        }
        var copy = flower.EnterFrame.enterFrames;
        for (var i = 0; i < copy.length; i++) {
            copy[i].call.apply(copy[i].owner, [now, gap]);
        }
        et = (new Date()).getTime();
        DebugInfo.cpu.enterFrame += et - st;
        if (now - EnterFrame.__lastFPSTime > 500) {
            DebugInfo.cpu.fps = ~~((EnterFrame.frame - EnterFrame.__lastFPSFrame) * 500 / (now - EnterFrame.__lastFPSTime));
            EnterFrame.__lastFPSTime = now;
            EnterFrame.__lastFPSFrame = EnterFrame.frame;
        }
    }

    static $dispose() {
        EnterFrame.enterFrames = [];
        EnterFrame.waitAdd = [];
    }
}

exports.EnterFrame = EnterFrame;