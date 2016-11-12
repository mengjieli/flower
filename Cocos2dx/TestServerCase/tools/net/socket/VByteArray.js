/**
 *
 * @author
 *
 */
var VByteArray = (function () {
    function VByteArray(big) {
        if (big === void 0) {
            big = true;
        }
        //if (!VByteArray.bytesTmp) {
        //    VByteArray.bytesTmp = new egret.ByteArray();
        //}
        this.bytes = [];
        this.big = big;
        this.position = 0;
        this.length = 0;
    }

    var d = __define, c = VByteArray;
    p = c.prototype;
    /**
     * 从原生字节流中读取数据
     */
    p.readFromByteArray = function (bytes) {
        this.bytes.length = 0;
        this.position = 0;
        this.length = 0;
        while (bytes.bytesAvailable) {
            this.bytes.push(bytes.readByte());
            this.length++;
        }
    };


    p.readFromArray = function (bytes) {
        this.bytes.length = 0;
        this.position = 0;
        this.length = 0;
        this.bytes = bytes;
        this.length = this.bytes.length;
    };
    /**
     * 把数据写到原生字节流中
     */
    p.writeToByteArray = function (bytes) {
        for (var i = 0; i < this.bytes.length; i++) {
            bytes.writeByte(this.bytes[i]);
        }
    };
    p.writeIntV = function (val) {
        if (val >= 0) {
            val *= 2;
        }
        else {
            val = ~val;
            val *= 2;
            val++;
        }
        this.writeUIntV(val);
    };
    p.writeUIntV = function (val) {
        var flag = false;
        val = val < 0 ? -val : val;
        var val2 = 0;
        if (val >= 0x10000000) {
            val2 = val / 0x10000000;
            val = val & 0xFFFFFFF;
            flag = true;
        }
        if (flag || val >> 7) {
            this.bytes.splice(this.position, 0, 0x80 | val & 0x7F);
            this.position++;
            this.length++;
        }
        else {
            this.bytes.splice(this.position, 0, val & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 14) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 7) {
            this.bytes.splice(this.position, 0, (val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 21) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 14) {
            this.bytes.splice(this.position, 0, (val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 28) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 21) {
            this.bytes.splice(this.position, 0, (val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag) {
            this.writeUIntV(Math.floor(val2));
        }
        ;
    };
    p.writeByte = function (val) {
        this.bytes.splice(this.position, 0, val);
        this.length += 1;
        this.position += 1;
    };
    p.writeBoolean = function (val) {
        this.bytes.splice(this.position, 0, val == true ? 1 : 0);
        this.length += 1;
        this.position += 1;
    };
    p.writeUTFV = function (val) {
        var arr = VByteArray.stringToBytes(val);
        this.writeUIntV(arr.length);
        for (var i = 0; i < arr.length; i++) {
            this.bytes.splice(this.position, 0, arr[i]);
            this.position++;
        }
        this.length += arr.length;
    };
    p.writeUTFBytes = function (val, len) {
        var arr = VByteArray.stringToBytes(val);
        for (var i = 0; i < len; i++) {
            if (i < arr.length)
                this.bytes.splice(this.position, 0, arr[i]);
            else
                this.bytes.splice(this.position, 0, 0);
            this.position++;
        }
        this.length += len;
    };
    p.writeBytes = function (b, start, len) {
        if (start === void 0) {
            start = 0;
        }
        if (len === void 0) {
            len = 0;
        }
        var copy = b.getData();
        for (var i = start; i < copy.length && i < start + len; i++) {
            this.bytes.splice(this.position, 0, copy[i]);
            this.position++;
        }
        this.length += len;
    };
    p.writeByteArray = function(byteArray) {
        this.bytes = this.bytes.concat(byteArray);
        this.length += byteArray.length;
    };
    p.readBoolean = function () {
        var val = this.bytes[this.position] == 0 ? false : true;
        this.position += 1;
        return val;
    };
    p.readIntV = function () {
        var val = this.readUIntV();
        if (val % 2 == 1) {
            val = Math.floor(val / 2);
            val = ~val;
        }
        else {
            val = Math.floor(val / 2);
        }
        return val;
    };
    p.readUIntV = function () {
        var val = 0;
        val += this.bytes[this.position] & 0x7F;
        if (this.bytes[this.position] >> 7) {
            this.position++;
            val += (this.bytes[this.position] & 0x7F) << 7;
            if (this.bytes[this.position] >> 7) {
                this.position++;
                val += (this.bytes[this.position] & 0x7F) << 14;
                if (this.bytes[this.position] >> 7) {
                    this.position++;
                    val += (this.bytes[this.position] & 0x7F) << 21;
                    if (this.bytes[this.position] >> 7) {
                        this.position++;
                        val += ((this.bytes[this.position] & 0x7F) << 24) * 16;
                        if (this.bytes[this.position] >> 7) {
                            this.position++;
                            val += ((this.bytes[this.position] & 0x7F) << 24) * 0x800;
                            if (this.bytes[this.position] >> 7) {
                                this.position++;
                                val += (this.bytes[this.position] << 24) * 0x40000;
                            }
                        }
                    }
                }
            }
        }
        this.position++;
        return val;
    };
    p.readByte = function () {
        var val = this.bytes[this.position];
        this.position += 1;
        return val;
    };
    p.readShort = function () {
        var val;
        var bytes = this.bytes;
        if (this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8;
        }
        else {
            val = bytes[this.position] << 8 | bytes[this.position + 1];
        }
        if (val > (1 << 15))
            val = val - (1 << 16);
        this.position += 2;
        return val;
    };
    p.readUTFV = function () {
        var len = this.readUIntV();
        var val = VByteArray.bytesToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    };
    p.readUTFBytes = function (len) {
        var val = VByteArray.bytesToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    };
    p.bytesAvailable = function () {
        return this.length - this.position;
    };
    p.getData = function() {
        return this.bytes;
    }
    p.toString = function () {
        var str = "";
        for (var i = 0; i < this.bytes.length; i++) {
            str += this.bytes[i] + (i < this.bytes.length - 1 ? "," : "");
        }
        return str;
    };

    global.__define(p, "data",
        function () {
            return this.bytes;
        },
        function (val) {
        }
    );

    VByteArray.stringToBytes = function (val) {
        return UTFChange.stringToBytes(val);
    };
    VByteArray.bytesToString = function (bytes) {
        return UTFChange.numberToString(bytes);
    };
    return VByteArray;
})();

global.VByteArray = VByteArray;
