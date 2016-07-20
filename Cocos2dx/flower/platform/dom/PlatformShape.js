class PlatformShape extends PlatformDisplayObject {
    constructor() {
        super();
        var shape = document.createElement("div");
        shape.style.position = "absolute";
        shape.style.left = "0px";
        shape.style.top = "0px";
        this.show = shape;
    }

    draw(points, fillColor, fillAlpha, lineWidth, lineColor, lineAlpha) {
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