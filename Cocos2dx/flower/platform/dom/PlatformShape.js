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
            //var div = document.createElement("div");
            //div.style.position = "absolute";
            //div.style.left = points[0].x + "px";
            //div.style.top = points[0].y + "px";
            //div.style.backgroundColor = "#" + this.toColor16(lineColor.r) + this.toColor16(lineColor.g) + this.toColor16(lineColor.b);
            //this.show.appendChild(div);
        } else if (points.length == 5) {
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.left = points[0].x + "px";
            div.style.top = points[0].y + "px";
            div.style.width = points[1].x - points[0].x + "px";
            div.style.height = points[2].y - points[0].y + "px";
            var color = "#" + this.toColor16(fillColor >> 16) + this.toColor16(fillColor >> 8 & 0xFF) + this.toColor16(fillColor & 0xFF);
            div.style.backgroundColor = color;
            this.show.appendChild(div);
            this.elements.push(div);
        }
        //var shape = this.show;
        //for (var i = 0; i < points.length; i++) {
        //    points[i].y = points[i].y;
        //}
        //shape.drawPoly(points, {
        //    r: fillColor >> 16,
        //    g: fillColor >> 8 & 0xFF,
        //    b: fillColor & 0xFF,
        //    a: fillAlpha * 255
        //}, lineWidth, {
        //    r: lineColor >> 16,
        //    g: lineColor >> 8 & 0xFF,
        //    b: lineColor & 0xFF,
        //    a: lineAlpha * 255
        //});
        //for (var i = 0; i < points.length; i++) {
        //    points[i].y = -points[i].y;
        //}
    }

    clear() {
        while(this.elements.length) {
            this.show.removeChild(this.elements.pop());
        }
        //this.show.clear();
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