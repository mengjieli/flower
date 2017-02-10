var UTFChange = (function () {
    function UTFChange() {
    }

    var d = __define, c = UTFChange;
    p = c.prototype;

    UTFChange.numberToString = function (arr) {
        //arr = arr.reverse();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < 0) arr[i] += 256;
        }
        var res = [];
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == 0) continue;
            if ((arr[i] & 128) == 0) res.push(arr[i]);				//1位
            else if ((arr[i] & 64) == 0) res.push(arr[i] % 128);		//1位
            else if ((arr[i] & 32) == 0)	//2位
            {
                res.push((arr[i] % 32) * 64 + (arr[i + 1] % 64));
                i++;
            }
            else if ((arr[i] & 16) == 0)	//3位
            {
                res.push((arr[i] % 16) * 64 * 64 + (arr[i + 1] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
            }
            else if ((arr[i] & 8) == 0)	//4位
            {
                res.push((arr[i] % 8) * 64 * 64 * 64 + (arr[i + 1] % 64) * 64 * 64 + (arr[i + 2] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
                i++;
            } else {
                console.log("?!!!!!!!!!!!!!!!!!!!",arr[i]);
            }
        }
        var str = "";
        for (i = 0; i < res.length; i++) {
            str += String.fromCharCode(res[i]);
        }
        return str;
    }

    UTFChange.stringToBytes = function (str) {
        var res = [];
        var num;
        for (var i = 0; i < str.length; i++) {
            num = str.charCodeAt(i);
            if (num < 128) {
                res.push(num);
            }
            else if (num < 2048) {
                res.push(parseInt(num / 64) + 128 + 64);
                res.push((num % 64) + 128);
            }
            else if (num < 65536) {
                res.push(parseInt(num / 4096) + 128 + 64 + 32);
                res.push(parseInt((num % 4096) / 64) + 128);
                res.push((num % 64) + 128);
            }
            else {
                res.push(parseInt(num / 262144) + 128 + 64 + 32 + 16);
                res.push(parseInt((num % 262144) / 4096) + 128);
                res.push(parseInt((num % 4096) / 64) + 128);
                res.push((num % 64) + 128);
            }
        }
        return res;
    }

    return UTFChange;
})();

global.UTFChange = UTFChange;
