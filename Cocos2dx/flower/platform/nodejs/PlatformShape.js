class PlatformShape extends PlatformDisplayObject {
    constructor(id) {
        super(id);

        this.elements = [];

        var msg = new flower.VByteArray();
        msg.writeUInt(6);
        msg.writeUInt(this.id);
        msg.writeUTF("Shape");
        Platform.sendToClient(msg);
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
        var msg = new flower.VByteArray();
        msg.writeUInt(41);
        msg.writeUInt(this.id);
        msg.writeUInt(points.length);
        for (var i = 0; i < points.length; i++) {
            msg.writeUTF(points[i].x + "");
            msg.writeUTF(points[i].y + "");
        }
        msg.writeUInt(fillColor);
        msg.writeUTF(fillAlpha + "");
        msg.writeUInt(lineWidth);
        msg.writeUInt(lineColor);
        msg.writeUTF(lineAlpha + "");
        Platform.sendToClient(msg);
    }

    clear() {
        var msg = new flower.VByteArray();
        msg.writeUInt(40);
        msg.writeUInt(this.id);
        Platform.sendToClient(msg);
    }


    setFilters(filters) {

    }

    release() {
        this.clear();
        super.release();
    }
}