class TweenCenter {
    constructor() {
    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        var target = tween.target;
        this.centerX = target.width / 2;
        this.centerY = target.height / 2;
        this.centerLength = math.sqrt(target.width * target.width + target.height * target.height) * .5;
        this.rotationStart = math.atan2(target.height, target.width) * 180 / math.PI;
        if (target.rotation) {
            this.lastMoveX = this.centerX - this.centerLength * math.cos((target.rotation + this.rotationStart) * math.PI / 180);
            this.lastMoveY = this.centerY - this.centerLength * math.sin((target.rotation + this.rotationStart) * math.PI / 180);
        } else {
            this.lastMoveX = 0;
            this.lastMoveY = 0;
        }
        var useAttributes = [];
        useAttributes.push("center");
        if ("scaleX" in propertiesTo) {
            this.scaleXTo = +propertiesTo["scaleX"];
            useAttributes.push("scaleX");
            if (propertiesFrom && "scaleX" in propertiesFrom) {
                this.scaleXFrom = +propertiesFrom["scaleX"];
            }
            else {
                this.scaleXFrom = target["scaleX"];
            }
        }
        if ("scaleY" in propertiesTo) {
            this.scaleYTo = +propertiesTo["scaleY"];
            useAttributes.push("scaleY");
            if (propertiesFrom && "scaleY" in propertiesFrom) {
                this.scaleYFrom = +propertiesFrom["scaleY"];
            }
            else {
                this.scaleYFrom = target["scaleY"];
            }
        }
        if ("rotation" in propertiesTo) {
            this.rotationTo = +propertiesTo["rotation"];
            useAttributes.push("rotation");
            if (propertiesFrom && "rotation" in propertiesFrom) {
                this.rotationFrom = +propertiesFrom["rotation"];
            }
            else {
                this.rotationFrom = target["rotation"];
            }
        }
        return useAttributes;
    }

    tween;
    scaleXFrom;
    scaleYFrom;
    scaleXTo;
    scaleYTo;
    rotationFrom;
    rotationStart;
    rotationTo;
    centerX;
    centerY;
    centerLength;
    lastMoveX;
    lastMoveY;

    update(value) {
        var target = this.tween.target;
        var moveX = 0;
        var moveY = 0;
        if (this.scaleXTo) {
            target.scaleX = this.scaleXFrom + (this.scaleXTo - this.scaleXFrom) * value;
            target.x = this.centerX - target.width / 2;
        }
        if (this.scaleYTo) {
            target.scaleY = this.scaleYFrom + (this.scaleYTo - this.scaleYFrom) * value;
            target.y = this.centerY - target.height / 2;
        }
        if (this.rotationTo) {
            target.rotation = this.rotationFrom + (this.rotationTo - this.rotationFrom) * value;
            moveX += this.centerX - this.centerLength * math.cos((target.rotation + this.rotationStart) * math.PI / 180);
            moveY += this.centerY - this.centerLength * math.sin((target.rotation + this.rotationStart) * math.PI / 180);
            target.x += moveX - this.lastMoveX;
            target.y += moveY - this.lastMoveY;
        }
        this.lastMoveX = moveX;
        this.lastMoveY = moveY;
    }

    static scaleTo(target, time, scaleTo, scaleFrom = null, ease = "None") {
        return flower.Tween.to(target, time, {
            "center": true,
            "scaleX": scaleTo,
            "scaleY": scaleTo
        }, ease, scaleFrom == null ? null : {"scaleX": scaleFrom, "scaleY": scaleFrom});
    }

    static rotationTo(target, time, rotationTo, rotationFrom = null, ease = "None") {
        return flower.Tween.to(target, time, {
            "center": true,
            "rotation": rotationTo
        }, ease, rotationFrom == null ? null : {"rotation": rotationFrom});
    }
}

exports.TweenCenter = TweenCenter;