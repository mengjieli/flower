class VByteArray {
    bytes;
    big;
    _position;
    length;

    constructor(big = true) {
        this.bytes = [];
        this.big = big;
        this.position = 0;
        this.length = 0;
    }

    readFromArray(bytes) {
        this.bytes.length = 0;
        this.position = 0;
        this.length = 0;
        this.bytes = bytes;
        this.length = this.bytes.length;
    }

    writeInt(val) {
        val = +val & ~0;
        if (val >= 0) {
            val *= 2;
        }
        else {
            val = ~val;
            val *= 2;
            val++;
        }
        this.writeUInt(val);
    }

    writeUInt(val) {
        val = val < 0 ? 0 : val;
        val = +val & ~0;
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
            this.writeUInt(math.floor(val2));
        }
    }

    get position() {
        return this._position;
    }

    set position(val) {
        this._position = val;
    }

    writeByte(val) {
        val = +val & ~0;
        this.bytes.splice(this.position, 0, val);
        this.length += 1;
        this.position += 1;
    }

    writeBoolean(val) {
        val = !!val;
        this.bytes.splice(this.position, 0, val == true ? 1 : 0);
        this.length += 1;
        this.position += 1;
    }

    writeUTF(val) {
        val = "" + val;
        var arr = StringDo.stringToBytes(val);
        this.writeUInt(arr.length);
        for (var i = 0; i < arr.length; i++) {
            this.bytes.splice(this.position, 0, arr[i]);
            this.position++;
        }
        this.length += arr.length;
    }

    writeUTFBytes(val, len) {
        val = "" + val;
        var arr = StringDo.stringToBytes(val);
        for (var i = 0; i < len; i++) {
            if (i < arr.length)
                this.bytes.splice(this.position, 0, arr[i]);
            else
                this.bytes.splice(this.position, 0, 0);
            this.position++;
        }
        this.length += len;
    }

    writeBytes(b, start = null, len = null) {
        start = +start & ~0;
        len = +len & ~0;
        var copy = b.data;
        for (var i = start; i < copy.length && i < start + len; i++) {
            this.bytes.splice(this.position, 0, copy[i]);
            this.position++;
        }
        this.length += len;
    }

    writeByteArray(byteArray) {
        this.bytes = this.bytes.concat(byteArray);
        this.length += byteArray.length;
    }

    readBoolean() {
        var val = this.bytes[this.position] == 0 ? false : true;
        this.position += 1;
        return val;
    }

    readInt() {
        var val = this.readUInt();
        if (val % 2 == 1) {
            val = math.floor(val / 2);
            val = ~val;
        }
        else {
            val = math.floor(val / 2);
        }
        return val;
    }

    readUInt() {
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
    }

    readByte() {
        var val = this.bytes[this.position];
        this.position += 1;
        return val;
    }

    readShort() {
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
    }

    readUTF() {
        var len = this.readUInt();
        var val = StringDo.numberToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    }

    readUTFBytes(len) {
        len = +len & ~0;
        var val = StringDo.numberToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    }

    get bytesAvailable() {
        return this.length - this.position;
    }

    get data() {
        return this.bytes;
    }

    toString() {
        var str = "";
        for (var i = 0; i < this.bytes.length; i++) {
            str += this.bytes[i] + (i < this.bytes.length - 1 ? "," : "");
        }
        return str;
    }
}

exports.VByteArray = VByteArray;