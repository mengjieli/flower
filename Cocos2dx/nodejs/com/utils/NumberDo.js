function NumberDo() {

}

NumberDo.ox16 = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "A",
    11: "B",
    12: "C",
    13: "D",
    14: "E",
    15: "F"
}

NumberDo.to16 = function (val, len) {
    val = +val;
    var len = len || 0;
    var res = "";
    var trans = NumberDo.ox16;
    while (val) {
        var more = val % 16;
        res = trans[more] + res;
        val = (val - more) / 16;
    }
    while (res.length < len) {
        res = "0" + res;
    }
    if(res == "") {
        res = "0";
    }
    return res;
}

global.NumberDo = NumberDo;