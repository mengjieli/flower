require("./../../nodejs/com/requirecom");


//var file = new File("./2.png");
//var decoder = new PNGDecoder();
//var buffer = file.readContent("binary", "Buffer");
//var data = decoder.decode(buffer);
////console.log(data.width,data.height);
//
//var x = 0;
//var y = 0;
//console.log(data.colors[y][x])
//var encoder = new PNGEncoder();
//encoder.encode(data.colors,3);
//var pixelBuffer = encoder.getData();
//(new File("./out/" + x + "_" + y + ".png")).save(pixelBuffer,"binary");
//
////for (var y = 0; y < data.height; y++) {
////    for (var x = 0; x < data.width; x++) {
////        var encoder = new PNGEncoder();
////        var pixelBuffer = encoder.encode([[data.colors[y][x]]],data.colorType);
////        (new File("./out/" + x + "_" + y + ".png")).save(pixelBuffer);
////    }
////}


var png = new File("source.png");
var decoder = new PNGDecoder();
var buffer = png.readContent("binary", "Buffer");
var data = decoder.decode(buffer);
var encoder = new PNGEncoder();
var width = data.width;
var height = data.height;
var RGB = 256 * 256 * 256;
//var content = [];
//console.log(width,height)
//for (var y = 0; y < height; y++) {
//    content[y] = [];
//    for (var x = 0; x < width; x++) {
//        //encoder.encode(
//        //    [[data.colors[y][x]]],
//        //    3
//        //);
//        //encoder.encode(
//        //    [[0xFFFFFFFF, 0XFF000000],
//        //        [0xFF808080, 0x000000]],
//        //    3
//        //);
//        //
//        //var buffer = new Buffer(encoder.getData());
//        //file = new File("out/" + x + "_" + y + ".png");
//        //file.save(buffer, "binary");
//
//
//        //encoder.encode(
//        //    [[data.colors[y][x]]],
//        //    3
//        //);
//        //var buffer = new Buffer(encoder.getData());
//        //file = new File("out/" + x + "_" + y + ".png");
//        //file.save(buffer, "binary");
//        //console.log(x,y,width,height);
//
//        //var color = data.colors[y][x];
//        //var a = color / RGB & 0xFF;
//        //var r = color >> 16 & 0xFF;
//        //var g = color >> 8 & 0xFF;
//        //var b = color & 0xFF;
//        content[y][x] = color;
//    }
//}
(new File("out.json")).save(JSON.stringify(data.colors));

