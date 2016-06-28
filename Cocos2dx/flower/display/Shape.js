class Shape extends DisplayObject {

    $Shape;

    constructor() {
        super();
        this.$nativeShow = Platform.create("Shape");
        this.$Shape = {
            0: 0xffffff, //fillColor
            1: 1,        //fillAlpha
            2: 0,        //lineWidth
            3: 0x000000, //lineColor
            4: 1,        //lineAlpha
            5: null,     //minX
            6: null,     //minY
            7: null,     //maxX
            8: null,     //maxY
            9: []       //record
        };
        this.$nativeShow.draw([{x: 0, y: 0}, {x: 1, y: 0}], 0, 0, 0, 0, 0);
    }

    drawRect(x, y, width, height) {
        this.$drawPolygon([
            {x: x, y: y},
            {x: x + width, y: y},
            {x: x + width, y: y + height},
            {x: x, y: y + height},
            {x: x, y: y}]);
    }

    clear() {
        if(!this.$nativeShow) {
            $warn(1002,this.name);
            return;
        }
        this.$nativeShow.clear();
        var p = this.$Shape;
        p[5] = p[6] = p[7] = p[8] = null;
        p[9] = [];
        this.$nativeShow.draw([{x: 0, y: 0}, {x: 1, y: 0}], 0, 0, 0, 0, 0);
    }

    $addFlags(flags) {
        if (flags == 0x0002) {
            this.$addFlags(0x0400);
        }
        super.$addFlags(flags);
    }

    $drawPolygon(points) {
        if(!this.$nativeShow) {
            $warn(1002,this.name);
            return;
        }
        var p = this.$Shape;
        for (var i = 0; i < points.length; i++) {
            if (p[5] == null) {
                p[5] = points[i].x;
                p[7] = points[i].x;
                p[6] = points[i].y;
                p[8] = points[i].y;
                continue;
            }
            if (points[i].x < p[5]) {
                p[5] = points[i].x;
            }
            if (points[i].x > p[7]) {
                p[7] = points[i].x;
            }
            if (points[i].y < p[6]) {
                p[6] = points[i].y;
            }
            if (points[i].y > p[8]) {
                p[8] = points[i].y;
            }
        }
        this.$invalidateContentBounds();
        p[9].push(
            {
                points: points,
                fillColor: p[0],
                fillAlpha: p[1],
                lineWidth: p[2],
                lineColor: p[3],
                lineAlpha: p[4]
            }
        );
        this.$nativeShow.draw(points, p[0], p[1] * this.$getConcatAlpha(), p[2], p[3], p[4] * this.$getConcatAlpha());
    }

    $measureContentBounds(rect) {
        this.$redraw();
        var p = this.$Shape;
        if (p[5] != null) {
            rect.x = p[5];
            rect.y = p[6];
            rect.width = p[7] - p[5];
            rect.height = p[8] - p[6];
        } else {
            rect.x = 0;
            rect.y = 0;
            rect.width = 0;
            rect.height = 0;
        }
    }

    $redraw() {
        if (this.$hasFlags(0x0400)) {
            var p = this.$Shape;
            var record = p[9];
            var fillColor = p[0];
            var fillAlpha = p[1];
            var lineWidth = p[2];
            var lineColor = p[3];
            var lineAlpha = p[4];
            this.clear();
            for (var i = 0; i < record.length; i++) {
                var item = record[i];
                p[0] = item.fillColor;
                p[1] = item.fillAlpha;
                p[2] = item.lineWidth;
                p[3] = item.lineColor;
                p[4] = item.lineAlpha;
                this.$drawPolygon(item.points);
            }
            p[0] = fillColor;
            p[1] = fillAlpha;
            p[2] = lineWidth;
            p[3] = lineColor;
            p[4] = lineAlpha;
            this.$removeFlags(0x0400);
        }
    }

    $setFillColor(val) {
        var p = this.$Shape;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        return true;
    }

    $setFillAlpha(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        var p = this.$Shape;
        if (p[1] == val) {
            return false;
        }
        p[1] = val;
        return true;
    }

    $setLineWidth(val) {
        var p = this.$Shape;
        if (p[2] == val) {
            return false;
        }
        p[2] = val;
        return true;
    }

    $setLineColor(val) {
        var p = this.$Shape;
        if (p[3] == val) {
            return false;
        }
        p[3] = val;
        return true;
    }

    $setLineAlpha(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        var p = this.$Shape;
        if (p[4] == val) {
            return false;
        }
        p[4] = val;
        return true;
    }

    get fillColor() {
        var p = this.$Shape;
        return p[0];
    }

    set fillColor(val) {
        this.$setFillColor(val);
    }

    get fillAlpha() {
        var p = this.$Shape;
        return p[1];
    }

    set fillAlpha(val) {
        this.$setFillAlpha(val);
    }

    get lineWidth() {
        var p = this.$Shape;
        return p[2];
    }

    set lineWidth(val) {
        this.$setLineWidth(val);
    }

    get lineColor() {
        var p = this.$Shape;
        return p[3];
    }

    set lineColor(val) {
        this.$setLineColor(val);
    }

    get lineAlpha() {
        var p = this.$Shape;
        return p[4];
    }

    set lineAlpha(val) {
        this.$setLineAlpha(val);
    }

    $onFrameEnd() {
        this.$redraw();
    }

    dispose() {
        if(!this.$nativeShow) {
            $warn(1002,this.name);
            return;
        }
        super.dispose();
        Platform.release("Shape", this.$nativeShow);
        this.$nativeShow = null;
    }
}

exports.Shape = Shape;