class TweenPhysicMove {

    constructor() {
        if (!flower.Tween.hasPlugin("physicMove")) {
            flower.Tween.registerPlugin("physicMove", flower.TweenPhysicMove);
        }
    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        var useAttributes = [];
        useAttributes.push("physicMove");
        var target = tween.target;
        var startX = target.x;
        var startY = target.y;
        if (propertiesFrom) {
            if ("x" in propertiesFrom) {
                startX = +propertiesFrom["x"];
            }
            if ("y" in propertiesFrom) {
                startY = +propertiesFrom["y"];
            }
        }
        this.startX = startX;
        this.startY = startY;
        var endX = startX;
        var endY = startY;
        if ("x" in propertiesTo) {
            endX = +propertiesTo["x"];
            useAttributes.push("x");
        }
        if ("y" in propertiesTo) {
            endY = +propertiesTo["y"];
            useAttributes.push("y");
        }
        var vx = 0;
        var vy = 0;
        var t = tween.time;
        if ("vx" in propertiesTo) {
            vx = +propertiesTo["vx"];
            useAttributes.push("vx");
            if (!("x" in propertiesTo)) {
                endX = startX + t * vx;
            }
        }
        if ("vy" in propertiesTo) {
            vy = +propertiesTo["vy"];
            useAttributes.push("vy");
            if (!("y" in propertiesTo)) {
                endY = startY + t * vy;
            }
        }
        this.vx = vx;
        this.vy = vy;
        this.ax = (endX - startX - vx * t) * 2 / (t * t);
        this.ay = (endY - startY - vy * t) * 2 / (t * t);
        this.time = t;
        return useAttributes;
    }

    tween;
    startX;
    vx;
    ax;
    startY;
    vy;
    ay;
    time;

    update(value) {
        var target = this.tween.target;
        var t = this.time * value;
        target.x = this.startX + this.vx * t + .5 * this.ax * t * t;
        target.y = this.startY + this.vy * t + .5 * this.ay * t * t;
    }

    static freeFallTo(target, time, groundY) {
        return flower.Tween.to(target, time, {"y": groundY, "physicMove": true});
    }

    static freeFallToWithG(target, g, groundY) {
        return flower.Tween.to(target, math.sqrt(2 * (groundY - target.y) / g), {"y": groundY, "physicMove": true});
    }

    static fallTo(target, time, groundY, vX = null, vY = null) {
        return flower.Tween.to(target, time, {"y": groundY, "physicMove": true, "vx": vX, "vy": vY});
    }

    static fallToWithG(target, g, groundY, vX = null, vY = null) {
        vX = +vX;
        vY = +vY;
        return flower.Tween.to(target, math.sqrt(2 * (groundY - target.y) / g + (vY * vY / (g * g))) - vY / g, {
            "y": groundY,
            "physicMove": true,
            "vx": vX,
            "vy": vY
        });
    }

    static to(target, time, xTo, yTo, vX = 0, vY = 0) {
        return flower.Tween.to(target, time, {"x": xTo, "y": yTo, "vx": vX, "vy": vY, "physicMove": true});
    }

}

exports.TweenPhysicMove = TweenPhysicMove;