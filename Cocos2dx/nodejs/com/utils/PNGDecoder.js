var zlib = require("zlib");

var PNGDecoder = (function (_super) {
    __extends(PNGDecoder, _super);

    /**
     * @param bytes 数组
     * @constructor
     */
    function PNGDecoder() {
        _super.call(this);
    }

    var d = __define, c = PNGDecoder;
    var p = c.prototype;

    /**
     *
     * @param bytes 可以为 Array 或者 Buffer 只要存在 length 和 bytes[0] bytes[1] 这样的属性即可
     * @return data
     * { width: 2,
          height: 2,
          depth: 8,
          colorType: 6,
          compress: 0,
          filter: 0,
          interlace: 0,
          format: 'rgba',
          colorWidth: 4,
          pixelWidth: 4,
          colors: [ [ 4294967295, 4278190080 ], [ 4286611584, 0 ] ] }
     */
    p.decode = function (bytes) {
        this.initArray(bytes);
        var data = {};
        this.readHead();
        this.readContent(data);
        return data;
    }

    /**
     * 读取 png 的开头，开头总是 0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A
     */
    p.readHead = function () {
        var head = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        for (var i = 0; i < head.length; i++) {
            if (this.readByte() != head[i]) {
                this.error("head error");
                return;
            }
        }
    }

    /**
     * 读取数据块内容
     */
    p.readContent = function (data) {
        var i = 0;
        while (true) {
            var len = this.readInt();
            var type = this.readUTFBytes(4);
            var position = this.position;
            //console.log("type = ", type, len);
            if (this["decode" + type]) {
                this["decode" + type](len, data);
            }
            if (type == "IEND") break;
            this.position = position + len + 4;
            i++;
            if (i > 10) break;
        }
    }

    p.findBlockHead = function () {
        var a = "a".charCodeAt(0);
        var z = "z".charCodeAt(0);
        var A = "A".charCodeAt(0);
        var Z = "Z".charCodeAt(0);
        while (this.position < this.length) {
            var find = true;
            var position = this.position;
            for (var i = 0; i < 4; i++) {
                if (this.position >= this.length - 1) {
                    return;
                }
                var byte = this.readByte();
                if (byte >= a && byte <= z || byte >= A && byte <= Z) {
                    continue;
                } else {
                    find = false;
                    break;
                }
            }
            if (find) {
                this.position = position - 4;
                break;
            }
        }
    }

    p.decodeIHDR = function (len, data) {
        data.width = this.readInt();  //图像宽
        data.height = this.readInt(); //图像高
        data.depth = this.readByte(); //颜色深度
        data.colorType = this.readByte(); //颜色类型
        data.compress = this.readByte();//压缩方法
        data.filter = this.readByte(); //滤波器方法
        data.interlace = this.readByte(); //隔行扫描
        data.format = 0;
        //计算每个颜色占用多少位
        switch (data.colorType) {
            case 0: //灰度
                data.colorWidth = 1;
                data.format = "gray";
                break;
            case 2:
                data.colorWidth = 3;
                data.format = "rgb";
                break;
            case 3:
                data.colorWidth = 1;
                data.format = "index";
                break;
            case 4:
                data.colorWidth = 2;
                data.format = "graya"
                break;
            case 6:
                data.colorWidth = 4;
                data.format = 'rgba';
                break;
            default:
                this.error("decode png,error color type :" + data.colorType);
        }
        //console.log("format", data.format);
        data.pixelWidth = (data.depth * data.colorWidth) >> 3 || 1; //每个像素有多少位，最少占用一位
    }

    p.decodePLTE = function (len, data) {
        var list = this.getData();
        //console.log(new Buffer(list.slice(this.position, this.position + len)));
        var i = 0;
        data.plte = [];
        while (i + 3 < len) {
            var color = (255 * 256 * 256 * 256) + (this.readByte() * 256 * 256 + this.readByte() * 256 + this.readByte());
            data.plte.push(color);
            //console.log(NumberDo.to16(color));
            i += 3;
        }
    }

    p.decodetRNS = function (len, data) {
        var list = this.getData();
        //console.log(new Buffer(list.slice(this.position, this.position + len)));
        switch (data.colorType) {
            case 3:
                for (var i = 0; i < len; i++) {
                    var val = this.readByte();
                    var color = data.plte[i];
                    color = color & 0xFFFFFF;
                    color = val * 256 * 256 * 256 + color;
                    data.plte[i] = color;
                }
                break;
        }
    }

    p.decodeIDAT = function (len, data) {
        var list = this.getData();
        //console.log(new Buffer(list.slice(this.position, this.position + len)));
        var lineLength = data.pixelWidth * data.width; //每行图像占用多少位
        var lines = [];
        var prev = null;
        var b = data.pixelWidth; //每个像素位宽
        var list = this.getData();
        //获取 IDAT 内容，并用 lz77 解压缩
        var buffer = new Buffer(list.slice(this.position, this.position + len));
        //console.log(buffer);
        buffer = zlib.unzipSync(buffer);
        //console.log(buffer);
        var bytes = new ByteArray(buffer);
        //开始逐行读取，这里没有考虑隔行扫描的情况
        var off = 0;
        data.colors = [];
        while (bytes.bytesAvailable) {
            var pixelType = bytes.readByte(); //取每行第一个字符
            var scanline = [];
            switch (pixelType) {
                case 0: // PNG_FILTER_NONE
                    for (var off = 0; off < lineLength; off++) {
                        scanline[off] = bytes.readByte();
                    }
                    break;
                case 1: // PNG_FILTER_SUB
                    for (var off = 0; off < lineLength; off++) {
                        scanline[off] = ((off < b ? 0 : scanline[off - b]) + bytes.readByte()) & 0xff;
                    }
                    break;
                case 2: // PNG_FILTER_UP
                    for (var off = 0; off < lineLength; off++) {
                        scanline[off] = (prev[off] + bytes.readByte()) & 0xff;
                    }
                    break;
                case 3: //PNG_FILTER_AVG
                    for (var off = 0; off < lineLength; off++) {
                        scanline[off] = ((((off < b ? 0 : scanline[off - b]) + prev[off]) >>> 1) + bytes.readByte()) & 0xff;
                    }
                    break;
                case 4: // PNG_FILTER_PAETH
                    for (var off = 0; off < lineLength; off++) {
                        var left = off < b ? 0 : scanline[off - b];
                        var upper = prev[off];
                        var upperLeft = off < b ? 0 : prev[off - b];
                        var p = upper - upperLeft;
                        var pc = left - upperLeft;
                        var pa = Math.abs(p);
                        var pb = Math.abs(pc);
                        pc = Math.abs(pc + p);
                        if (pb < pa) {
                            pa = pb;
                            left = upper;
                        }
                        if (pc < pa)
                            left = upperLeft;
                        scanline[off] = (bytes.readByte() + left) & 0xff;
                    }
                    break;
                default:
                    this.error("decode png,error line color type :" + pixelType);
            }
            //console.log(scanline);
            prev = scanline;
            var lineColors = [];
            switch (data.colorType) {
                case 0: //灰度图像每个像素只有一位，表示图像的灰度
                    for (var i = 0, length = scanline.length; i < length; i++) {
                        var gray = scanline[i];
                        var color = (255 * 256 * 256 * 256) + (gray * 256 * 256 + gray * 256 + gray);
                        lineColors.push(color);
                    }
                    break;
                case 2: //rgb 颜色 每个像素有三位，分别代表 rgb
                    for (var i = 0, length = scanline.length; i < length;) {
                        var color = (255 * 256 * 256 * 256) + (scanline[i] * 256 * 256 + scanline[i + 1] * 256 + scanline[i + 2]);
                        lineColors.push(color);
                        i += 3;
                    }
                    break;
                case 3: //索引颜色每个像素只有一位，对应 颜色索引表 的索引
                    for (var i = 0, length = scanline.length; i < length; i++) {
                        var colorIndex = scanline[i];
                        var color = data.plte[colorIndex];
                        lineColors.push(color);
                    }
                    break;
                case 4: //灰度图像每个像素有两位，第一位表示图像的灰度，第二位表示颜色的透明度
                    for (var i = 0, length = scanline.length; i < length;) {
                        var gray = scanline[i];
                        var alpha = scanline[i + 1];
                        var color = (alpha * 256 * 256 * 256) + (gray * 256 * 256 + gray * 256 + gray);
                        lineColors.push(color);
                        i += 2;
                    }
                    break;
                case 6: //rgb 颜色 每个像素有四位，分别代表 rgba
                    for (var i = 0, length = scanline.length; i < length;) {
                        var color = (scanline[i + 3] * 256 * 256 * 256) + (scanline[i] * 256 * 256 + scanline[i + 1] * 256 + scanline[i + 2]);
                        lineColors.push(color);
                        i += 4;
                    }
                    break;
            }
            data.colors.push(lineColors);
        }
        //console.log(data.colors);
    }

    p.error = function (tip) {
        throw "[PNGDecoder Error]" + tip;
    }

    return PNGDecoder;

})(ByteArray);

global.PNGDecoder = PNGDecoder;