class PlatformShape extends PlatformDisplayObject {
    constructor() {
        super();
        var shape = document.createElement("div");
        shape.style.position = "absolute";
        shape.style.left = "0px";
        shape.style.top = "0px";
        this.show = shape;
        this.elements = [];
    }

    toColor16(color) {
        var abc;
        var num = math.floor(color / 16);
        abc = num + "";
        if (num == 15) {
            abc = "f";
        }
        if (num == 14) {
            abc = "e";
        }
        if (num == 13) {
            abc = "d";
        }
        if (num == 12) {
            abc = "c";
        }
        if (num == 11) {
            abc = "b";
        }
        if (num == 10) {
            abc = "a";
        }
        var str = abc + "";
        num = color % 16;
        abc = num + "";
        if (num == 15) {
            abc = "f";
        }
        if (num == 14) {
            abc = "e";
        }
        if (num == 13) {
            abc = "d";
        }
        if (num == 12) {
            abc = "c";
        }
        if (num == 11) {
            abc = "b";
        }
        if (num == 10) {
            abc = "a";
        }
        str += abc;
        return str;
    }

    draw(points, fillColor, fillAlpha, lineWidth, lineColor, lineAlpha) {
        if (points.length == 0) {
            this.show.innerHTML = "";
            return;
        }
        var pointStr = "";
        var minX = 100000000;
        var minY = 100000000;
        var maxX = -100000000;
        var maxY = -100000000;
        for (var i = 0; i < points.length; i++) {
            if (points[i].x < minX) {
                minX = points[i].x;
            }
            if (points[i].x > maxX) {
                maxX = points[i].x;
            }
            if (points[i].y < minY) {
                minY = points[i].y;
            }
            if (points[i].y > maxY) {
                maxY = points[i].y;
            }
        }
        minX -= lineWidth;
        minY -= lineWidth;
        for (var i = 0; i < points.length; i++) {
            pointStr += (points[i].x - minX) + "," + (points[i].y - minY) + (i < points.length - 1 ? "," : "");
        }
        this.show.innerHTML = '<div style="position:absolute;left:' + minX + 'px;top:' + minY + 'px;"><svg style="position:absolute;left:0px;top:0px;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + (maxX - minX + 2 + lineWidth) + '" height="' + (maxY - minY + 2 + lineWidth) + '">'
            + '<polygon points="' + pointStr
            + '" style="fill:#' + this.toColor16(fillColor >> 16) + this.toColor16(fillColor >> 8 & 0xFF) + this.toColor16(fillColor & 0xFF) + ";"
            + 'stroke:#' + this.toColor16(lineColor >> 16) + this.toColor16(lineColor >> 8 & 0xFF) + this.toColor16(lineColor & 0xFF) + ";"
            + 'fill-opacity:' + fillAlpha + ';'
            + 'stroke-opacity:' + lineAlpha + ';'
            + 'stroke-width:' + lineWidth + ';"/>' + '</svg></div>';
    }

    clear() {
        this.show.innerHTML = "";
    }

    setAlpha(val) {
    }


    setFilters(filters) {

    }

    release() {
        this.clear();
        super.release();
    }
}