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

    static del(call, owner) {
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

    static $update(now, gap) {
        flower.EnterFrame.frame++;
        flower.CallLater.$run();
        if (flower.EnterFrame.waitAdd.length) {
            flower.EnterFrame.enterFrames = flower.EnterFrame.enterFrames.concat(flower.EnterFrame.waitAdd);
            flower.EnterFrame.waitAdd = [];
        }
        var copy = flower.EnterFrame.enterFrames;
        for (var i = 0; i < copy.length; i++) {
            copy[i].call.apply(copy[i].owner, [now, gap]);
        }
    }
}

exports.EnterFrame = EnterFrame;