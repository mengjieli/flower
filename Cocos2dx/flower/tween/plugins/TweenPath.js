class TweenPath {

    constructor() {
    }

    init(tween, propertiesTo, propertiesFrom) {
        this.tween = tween;
        var useAttributes = [];
        useAttributes.push("path");
        var path = propertiesTo["path"];
        var target = tween.target;
        var start = flower.Point.create(target.x, target.y);
        path.splice(0, 0, start);
        if (propertiesFrom) {
            if ("x" in propertiesFrom) {
                start.x = +propertiesFrom["x"];
            }
            if ("y" in propertiesFrom) {
                start.y = +propertiesFrom["y"];
            }
        }
        if ("x" in propertiesTo && "y" in propertiesTo) {
            useAttributes.push("x");
            useAttributes.push("y");
            path.push(flower.Point.create(+propertiesTo["x"], +propertiesTo["y"]));
        }
        this.path = path;
        this.pathSum = [];
        this.pathSum.push(0);
        for (var i = 1, len = path.length; i < len; i++) {
            this.pathSum[i] = this.pathSum[i - 1] + math.sqrt((path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y));
        }
        var sum = this.pathSum[len - 1];
        for (i = 1; i < len; i++) {
            this.pathSum[i] = this.pathSum[i] / sum;
        }
        return useAttributes;
    }

    tween;
    pathSum;
    path;

    update(value) {
        var path = this.path;
        var target = this.tween.target;
        var pathSum = this.pathSum;
        var i, len = pathSum.length;
        for (i = 1; i < len; i++) {
            if (value > pathSum[i - 1] && value <= pathSum[i]) {
                break;
            }
        }
        if (value <= 0) {
            i = 1;
        }
        else if (value >= 1) {
            i = len - 1;
        }
        value = (value - pathSum[i - 1]) / (pathSum[i] - pathSum[i - 1]);
        target.x = value * (path[i].x - path[i - 1].x) + path[i - 1].x;
        target.y = value * (path[i].y - path[i - 1].y) + path[i - 1].y;
    }

    static to(target, time, path, ease = "None") {
        return flower.Tween.to(target, time, {"path": path}, ease);
    }

    static vto(target, v, path, ease = "None") {
        var sum = 0;
        for (var i = 1, len = path.length; i < len; i++) {
            sum += math.sqrt((path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y));
        }
        var time = sum / v;
        return flower.Tween.to(target, time, {"path": path}, ease);
    }

}

exports.TweenPath = TweenPath;