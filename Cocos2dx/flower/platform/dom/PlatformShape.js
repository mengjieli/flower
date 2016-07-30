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
        var num = Math.floor(color / 16);
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
        if (points.length == 2) {
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.left = points[0].x + "px";
            div.style.top = points[0].y + "px";
            var rotation = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
            var len = Math.sqrt((points[1].y - points[0].y) * (points[1].y - points[0].y) + (points[1].x - points[0].x) * (points[1].x - points[0].x));
            div.style.width = len + "px";
            div.style.height = "0px";
            div.style["-webkit-transform"] = "rotate(" + (rotation * 180 / Math.PI) + "deg)";
            if (lineAlpha && lineWidth) {
                color = "#" + this.toColor16(lineColor >> 16) + this.toColor16(lineColor >> 8 & 0xFF) + this.toColor16(lineColor & 0xFF);
                div.style.border = lineWidth + "px solid " + color;
            }
            this.show.appendChild(div);
            this.elements.push(div);
        } else if (points.length == 5) {
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.left = points[0].x + "px";
            div.style.top = points[0].y + "px";
            div.style.width = points[1].x - points[0].x + "px";
            div.style.height = points[2].y - points[0].y + "px";
            var color = "#" + this.toColor16(fillColor >> 16) + this.toColor16(fillColor >> 8 & 0xFF) + this.toColor16(fillColor & 0xFF);
            div.style.backgroundColor = color;
            div.style.opacity = fillAlpha;
            if (lineAlpha && lineWidth) {
                color = "#" + this.toColor16(lineColor >> 16) + this.toColor16(lineColor >> 8 & 0xFF) + this.toColor16(lineColor & 0xFF);
                div.style.border = lineWidth + "px solid " + color;
                //div.style.borderWidth = lineWidth + "px";
            }
            this.show.appendChild(div);
            this.elements.push(div);
        }
    }

    clear() {
        while (this.elements.length) {
            this.show.removeChild(this.elements.pop());
        }
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