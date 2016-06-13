var zlib = require("zlib");

var PNGEncoder = (function (_super) {
    __extends(PNGEncoder, _super);

    /**
     * @param bytes 数组
     * @constructor
     */
    function PNGEncoder() {
        _super.call(this);
        this.initializeCRCTable();
        this.data = {};
    }

    var d = __define, c = PNGEncoder;
    var p = c.prototype;

    /**
     * 生成 PNG
     * @param colors 颜色矩阵
     * @param colorType 颜色类型:
     * 0 灰度，灰度模式对应的 IDAT 中每个像素为1个字节 (0~256)
     * 2 RGB，IDAT 中每个像素为3个字节，分别为 R、G、B 的颜色值
     * 3 索引色，IDAT 中每个像素为1个字节，对应调色板（PLTE）中的颜色索引
     * 4 带透明的灰度，IDAT 中每个像素为2个字节，分别为 灰度、透明度
     * 6 RGBA，IDAT 中每个像素位4个字节，分别为 R、G、B、A 的值
     */
    p.encode = function (colors, colorType) {
        this.position = 0;
        this.length = 0;
        this.writeHead();
        this.writeContent({
            "colors": colors,
            "width": colors[0].length,
            "height": colors.length,
            "colorType": colorType
        });
    }

    /**
     * 读取 png 的开头，开头总是 0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A
     */
    p.writeHead = function () {
        var head = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        for (var i = 0; i < head.length; i++) {
            this.writeByte(head[i]);
        }
    }

    /**
     * 读取数据块内容
     */
    p.writeContent = function (data) {
        var i = 0;
        this.writeTrunk("IHDR", this.getIHDR(data));
        if (data.colorType == 3) {
            var indexColor = this.translateRGBToIndexColor(data.colors);
            data.plte = indexColor.plte;
            data.trns = indexColor.trns;
            data.colors = indexColor.colors;
            this.writeTrunk("PLTE", this.getPLTE(data));
            this.writeTrunk("tRNS", this.gettRNS(data));
        }
        this.writeTrunk("IDAT", this.getIDAT(data));
        this.writeTrunk("IEND");
    }

    p.initializeCRCTable = function () {
        this.crcTable = [];

        for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 0; k < 8; k++) {
                if (c & 1)
                    c = ((0xedb88320) ^ (c >>> 1));
                else
                    c = (c >>> 1);
            }
            if (c < 0) {
                c = Math.pow(2, 32) + c;
            }
            this.crcTable[n] = c;
        }
    }

    p.writeTrunk = function (name, data) {
        //写入长度
        var len = 0;
        if (data) {
            len = data.length;
        }
        this.writeUnsignedInt(len);

        //写入类型
        var typePos = this.position;
        this.writeUTFBytes(name);

        //写入data
        if (data) {
            this.writeArray(data);
        }

        var crcPos = this.position;
        this.position = typePos;
        var crc = 0xFFFFFFFF;
        for (var i = typePos; i < crcPos; i++) {
            var val1 = crc ^ this.readByte();
            if (val1 < 0) {
                val1 = Math.pow(2, 32) + val1;
            }
            val1 = this.crcTable[val1 % 256];
            var val2 = Math.floor(crc / 256);
            crc = val1 ^ val2;
            if (crc < 0) {
                crc = Math.pow(2, 32) + crc;
            }
        }
        crc = crc ^ 0xFFFFFFFF;
        if (crc < 0) {
            crc = Math.pow(2, 32) + crc;
        }
        this.position = crcPos;
        this.writeUnsignedInt(crc);
    }

    p.getIHDR = function (data) {
        var bytes = new ByteArray();
        bytes.writeInt(data.width);
        bytes.writeInt(data.height);
        bytes.writeByte(8); // bit depth per channel
        bytes.writeByte(data.colorType); // color type: RGBA
        bytes.writeByte(0); // compression method
        bytes.writeByte(0); // filter method
        bytes.writeByte(0); // interlace method
        return bytes.getData();
    }

    /**
     * 把 rgba 色转为 索引色
     * @param colors
     * @returns {{plte: Array, trns: Array, colors: Array}}
     */
    p.translateRGBToIndexColor = function (colors) {
        var plte = [];
        var trns = [];
        var datas = [];
        var h = colors.length;
        var w = colors[0].length;
        var RGB = 256 * 256 * 256;
        var cubicList = [];
        var deviceCount = 16;
        var deviceLevel = 4;
        for (var r = 0; r < 256;) {
            for (var g = 0; g < 256;) {
                for (var b = 0; b < 256;) {
                    var cubic = {
                        r: r,
                        g: g,
                        b: b,
                        list: []
                    }
                    cubicList.push(cubic);
                    b += deviceCount;
                }
                g += deviceCount;
            }
            r += deviceCount;
        }
        var all = w * h;
        var num = (255 >> deviceLevel) + (255 > (255 >> deviceLevel) * deviceCount ? 1 : 0);
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var color = colors[y][x];
                var a = color / RGB & 0xFF;
                var r = color >> 16 & 0xFF;
                var g = color >> 8 & 0xFF;
                var b = color & 0xFF;
                colors[y][x] = {a: a, r: r, g: g, b: b};
                if (a == 0) {
                    all--;
                    continue;
                }
                var rIndex = r >> deviceLevel;
                var gIndex = g >> deviceLevel;
                var bIndex = b >> deviceLevel;
                var cubic = cubicList[rIndex * num * num + gIndex * num + bIndex];
                cubic.list.push({a: a, r: r, g: g, b: b});
            }
        }
        for (var i = 0; i < cubicList.length; i++) {
            var cubic = cubicList[i];
            if (cubic.list.length == 0) {
                cubicList.splice(i, 1);
                i--;
            }
        }
        cubicList.sort(function (a, b) {
            return a.list.length < b.list.length ? 1 : -1;
        });
        plte.push(0x000000);
        trns.push(0);
        var allCount = 255; //剩余可分配的像素点个数
        //只要格子的像素个数大于11个就分配一个像素点
        for (var i = 0; i < cubicList.length; i++) {
            var cubic = cubicList[i];
            cubic.count = 0;
            if (cubic.list.length > 16 && i < 32 && allCount) {
                cubic.count = 1;
                allCount--;
            }
        }
        for (var i = 0; i < cubicList.length; i++) {
            var cubic = cubicList[i];
            //按照比例计算每个立方块应该分配的像素个数
            cubic.percent = cubic.list.length / all;
        }

        var useColor = {};
        /**
         * 计算立方体中的像素分配情况
         * @param cubic
         */
        var doCubic = function (moreCount) {
            if (cubicList.length == 0) {
                return;
            }
            var cubic = cubicList.shift();
            var cubicCount = Math.round(allCount * cubic.percent);
            if (allCount && !cubicCount) {
                cubicCount = 1;
            }
            cubic.count += cubicCount;
            cubic.count += moreCount;
            //已经没有可以分配的调色板颜色，则结束
            if (cubic.count == 0 && allCount == 0) {
                return;
            }
            if (cubic.count > cubic.list.length) { //如果可分配的颜色数量大于实际颜色数
                for (var i = 0; i < cubic.list.length; i++) {
                    var color = cubic.list[i];
                    if (useColor[color.a + "." + color.r + "." + color.g + "." + color.b]) continue;
                    plte.push(color.r << 16 | color.g << 8 | color.b);
                    trns.push(color.a);
                    cubic.count--;
                    allCount--;
                    useColor[color.a + "." + color.r + "." + color.g + "." + color.b] = true;
                }
            } else {
                //以分配了5个像素为例 ： lenCount 为 3，len 为 10， more 为 32 - (3 - 2)*10
                var lenCount = Math.ceil(Math.pow(cubic.count, 1 / 3));
                var len = Math.floor(deviceCount / lenCount);
                var smallCubicList = [];
                var more = deviceCount - lenCount * len;
                more = deviceCount - (lenCount - more) * len;
                for (var r = cubic.r; r < cubic.r + deviceCount;) {
                    for (var g = cubic.g; g < cubic.g + deviceCount;) {
                        for (var b = cubic.b; b < cubic.b + deviceCount;) {
                            smallCubicList.push({r: r, g: g, b: b, list: [], count: 0});
                            b += len;
                            if (b < cubic.b + more) {
                                b += 1;
                            }
                        }
                        g += len;
                        if (g < cubic.g + more) {
                            g += 1;
                        }
                    }
                    r += len;
                    if (r < cubic.r + more) {
                        r += 1;
                    }
                }
                //把立方体中所有颜色放入小格子中
                var cubicColors = cubic.list;
                for (var i = 0; i < cubicColors.length; i++) {
                    var cubicColor = cubicColors[i];
                    var index = -1;
                    var dis = 256 * 3;
                    for (var f = 0; f < smallCubicList.length; f++) {
                        var smallCubicColor = smallCubicList[f];
                        if (cubicColor.r >= smallCubicColor.r &&
                            cubicColor.g >= smallCubicColor.g &&
                            cubicColor.b >= smallCubicColor.b) {
                            var diff =
                                Math.abs(cubicColor.r - smallCubicColor.r) +
                                Math.abs(cubicColor.g - smallCubicColor.g) +
                                Math.abs(cubicColor.b - smallCubicColor.b);
                            if (diff < dis) {
                                dis = diff;
                                index = f;
                            }
                        }
                    }
                    var smallCubicColor = smallCubicList[index];
                    smallCubicColor.list.push(cubicColor);
                }
                smallCubicList.sort(function (a, b) {
                    return a.list.length < b.list.length ? 1 : -1;
                });
                var smallCount = cubic.count;
                for (var i = 0; i < smallCubicList.length; i++) {
                    var smallCubic = smallCubicList[i];
                    if (smallCubic.list.length * Math.pow(lenCount, 3) > cubic.list.length && smallCount) {
                        smallCubic.count = 1;
                        smallCount--;
                    }
                }
                var smallAllCount = cubic.list.length;
                for (var i = 0; i < smallCubicList.length; i++) {
                    var smallCubic = smallCubicList[i];
                    if (smallCount == 0) {
                        break;
                    }
                    var addCount = Math.round(smallCubic.list.length * smallCount / smallAllCount);
                    if (addCount > smallCount) {
                        addCount = smallCount;
                    }
                    if (smallCount && addCount == 0) {
                        addCount = 1;
                    }
                    smallAllCount -= smallCubic.list.length;
                    smallCubic.count += addCount;
                    smallCount -= addCount;
                }
                var doSmallCubic = function (moreCount) {
                    if (smallCubicList.length == 0) {
                        return;
                    }
                    var smallCubic = smallCubicList.shift();
                    smallCubic.count += moreCount;
                    if (smallCubic.count == 0) {
                        return;
                    }
                    var smallColorListObject = {};
                    var smallColorList = [];
                    var alphaListObject = [];
                    var alphaList = [];
                    for (var i = 0; i < smallCubic.list.length; i++) {
                        var color = smallCubic.list[i];
                        if (smallColorListObject[color.a + "." + color.r + "." + color.g + "." + color.b]) {
                            continue;
                        }
                        smallColorListObject[color.a + "." + color.r + "." + color.g + "." + color.b] = true;
                        smallColorList.push(color);
                        if (alphaListObject[color.a]) {
                            continue;
                        }
                        alphaListObject[color.a] = true;
                        alphaList.push(color.a);
                    }
                    //如果小立方体内分配到的像素个数大于等于立方体内的像素个数
                    if (smallCubic.count >= smallColorList.length) {
                        for (var i = 0; i < smallColorList.length; i++) {
                            var color = smallColorList[i];
                            if (useColor[color.a + "." + color.r + "." + color.g + "." + color.b]) continue;
                            plte.push(color.r << 16 | color.g << 8 | color.b);
                            trns.push(color.a);
                            smallCubic.count--;
                            cubic.count--;
                            allCount--;
                            useColor[color.a + "." + color.r + "." + color.g + "." + color.b] = true;
                        }
                    } else {
                        var smallCubicColor = {r: 0, g: 0, b: 0};
                        for (var i = 0; i < smallCubic.list.length; i++) {
                            var color = smallCubic.list[i];
                            smallCubicColor.r += color.r;
                            smallCubicColor.g += color.g;
                            smallCubicColor.b += color.b;
                        }
                        smallCubicColor.r = Math.floor(smallCubicColor.r / smallCubic.list.length);
                        smallCubicColor.g = Math.floor(smallCubicColor.g / smallCubic.list.length);
                        smallCubicColor.b = Math.floor(smallCubicColor.b / smallCubic.list.length);
                        if (smallCubic.count >= alphaList.length) {
                            for (var i = 0; i < alphaList.length; i++) {
                                if (useColor[alphaList[i] + "." + smallCubicColor.r + "." + smallCubicColor.g + "." + smallCubicColor.b]) continue;
                                plte.push(smallCubicColor.r << 16 | smallCubicColor.g << 8 | smallCubicColor.b);
                                trns.push(alphaList[i]);
                                smallCubic.count--;
                                cubic.count--;
                                allCount--;
                                useColor[alphaList[i] + "." + smallCubicColor.r + "." + smallCubicColor.g + "." + smallCubicColor.b] = true;
                            }
                        } else {
                            var smallLenCount = Math.ceil(Math.sqrt(smallCubic.count));
                            var smallLen = 256 / smallLenCount;
                            alphaList = [];
                            for (var i = 0; i < smallLenCount; i++) {
                                alphaList[i] = {
                                    a: 0,
                                    count: 0
                                }
                            }
                            for (var i = 0; i < smallCubic.list.length; i++) {
                                var color = smallCubic.list[i];
                                var colorIndex = Math.floor(color.a / smallLen);
                                alphaList[colorIndex].a += color.a;
                                alphaList[colorIndex].count++;
                            }
                            alphaList.sort(function (a, b) {
                                return a.count < b.count ? 1 : -1;
                            });
                            for (var i = 0; i < alphaList.length; i++) {
                                if (!smallCubic.count) {
                                    continue;
                                }
                                if (useColor[alphaList[i].a + "." + smallCubicColor.r + "." + smallCubicColor.g + "." + smallCubicColor.b]) continue;
                                plte.push(smallCubicColor.r << 16 | smallCubicColor.g << 8 | smallCubicColor.b);
                                trns.push(alphaList[i].a);
                                smallCubic.count--;
                                cubic.count--;
                                allCount--;
                                useColor[alphaList[i].a + "." + smallCubicColor.r + "." + smallCubicColor.g + "." + smallCubicColor.b] = true;
                            }
                        }
                    }
                    doSmallCubic(smallCubic.count);
                };
                doSmallCubic(0);
            }
            doCubic(cubic.count);
        }
        doCubic(0);
        var plte2 = [];
        for (var i = 0; i < plte.length; i++) {
            var color = plte[i];
            var a = trns[i];
            var r = color >> 16 & 0xFF;
            var g = color >> 8 & 0xFF;
            var b = color & 0xFF;
            plte2.push({a: a, r: r, g: g, b: b});
        }
        var per = 0;
        for (var y = 0; y < h; y++) {
            datas[y] = [];
            for (var x = 0; x < w; x++) {
                var color = colors[y][x];
                if (color.a == 0) {
                    datas[y][x] = 0;
                } else {
                    var index = -1;
                    var dis = 256 * 4;
                    for (var i = 0; i < plte2.length; i++) {
                        var diff = Math.abs(plte2[i].a - color.a) +
                            Math.abs(plte2[i].r - color.r) +
                            Math.abs(plte2[i].g - color.g) +
                            Math.abs(plte2[i].b - color.b);
                        if (diff < dis) {
                            dis = diff;
                            index = i;
                            if (dis == 0) {
                                break;
                            }
                        }
                    }
                    var compareIndexs = [
                            [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
                            [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
                            [-2, 0], [-1, 0], [1, 0], [2, 0],
                            [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
                            [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]];
                    var different = false;
                    for (var i = 0; i < compareIndexs.length; i++) {
                        var cx = compareIndexs[i][0] + x;
                        var cy = compareIndexs[i][1] + y;
                        if (cx < 0 || cy < 0 || cx >= w || cy >= h) {
                            continue;
                        }
                        var compareColor = colors[cy][cx];
                        if (Math.abs(compareColor.a - color.a) > 1 ||
                            Math.abs(compareColor.r - color.r) > 1 ||
                            Math.abs(compareColor.g - color.g) > 1 ||
                            Math.abs(compareColor.b - color.b) > 1) {
                            different = true;
                            break;
                        }
                    }
                    if (different) {
                        var index2 = -1;
                        var dis2 = 256 * 4;
                        for (var i = 0; i < plte2.length; i++) {
                            var diff = Math.abs(plte2[i].a - color.a) +
                                Math.abs(plte2[i].r - color.r) +
                                Math.abs(plte2[i].g - color.g) +
                                Math.abs(plte2[i].b - color.b);
                            if (diff < dis2 && diff != dis) {
                                dis2 = diff;
                                index2 = i;
                            }
                        }
                        if (dis && Math.abs(dis - dis2) < 10) {
                            datas[y][x] = [index, index2][Math.floor(Math.random() * 2)];
                        } else {
                            datas[y][x] = index;
                        }
                    } else {
                        datas[y][x] = index;
                    }
                }
            }
            if (Math.floor(y * 100 / h) != per) {
                per = Math.floor(y * 100 / h);
                //console.log(per + "%");
            }
        }
        //console.log(plte.length, trns.length);
        return {
            plte: plte, //调色板数组
            trns: trns, //调色板透明度数组
            colors: datas //转换后的颜色
        };
    }

    p.getPLTE = function (data) {
        var plte = data.plte;
        var bytes = new ByteArray();
        for (var i = 0; i < 256; i++) {
            if (i < plte.length) {
                var color = plte[i];
                bytes.writeByte(color >> 16);
                bytes.writeByte(color >> 8 & 0xFF);
                bytes.writeByte(color & 0xFF);
            } else {
                bytes.writeByte(0);
                bytes.writeByte(0);
                bytes.writeByte(0);
            }
        }
        return bytes.getData();
    }

    p.gettRNS = function (data) {
        var bytes = new ByteArray();
        var trns = data.trns;
        switch (data.colorType) {
            case 3:
                for (var i = 0; i < trns.length; i++) {
                    bytes.writeByte(trns[i]);
                }
                break;
        }
        return bytes.getData();
    }

    p.getIDAT = function (data) {
        //console.log("data", data);
        var IDAT = new ByteArray();
        var width = data.width;
        var height = data.height;
        var transparent = data.transparent;
        for (var y = 0; y < height; y++) {
            IDAT.writeByte(0); //no filter
            var x;
            var pixel;
            switch (data.colorType) {
                case 0:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        var gray = Math.floor(r * 0.3086 + g * 0.6094 + b * 0.082);
                        IDAT.writeByte(gray);
                    }
                    break;
                case 2:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        IDAT.writeByte(r);
                        IDAT.writeByte(g);
                        IDAT.writeByte(b);
                    }
                    break;
                case 3: //索引颜色模式，写入索引值
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        IDAT.writeByte(pixel);
                    }
                    break;
                case 4:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var a = pixel >> 24;
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        var gray = Math.floor(r * 0.3086 + g * 0.6094 + b * 0.082);
                        IDAT.writeByte(gray);
                        IDAT.writeByte(a);
                    }
                    break;
                case 6:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var a = pixel >> 24;
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        IDAT.writeByte(r);
                        IDAT.writeByte(g);
                        IDAT.writeByte(b);
                        IDAT.writeByte(a);
                    }
                    break;
            }
        }
        var buffer = new Buffer(IDAT.getData());
        buffer = zlib.deflateSync(buffer);
        //console.log(buffer);
        var array = [];
        for (var i = 0; i < buffer.length; i++) {
            array[i] = buffer[i];
        }
        return array;
    }

    p.error = function (tip) {
        throw "[PNGEncoder Error]" + tip;
    }

    return PNGEncoder;
})
(ByteArray);

global.PNGEncoder = PNGEncoder;