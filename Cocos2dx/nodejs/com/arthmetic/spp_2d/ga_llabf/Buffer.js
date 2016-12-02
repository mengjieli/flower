var gallabf;
(function (gallabf) {
    var Buffer = (function () {

        function Buffer() {

        }

        var d = __define, c = Buffer;
        p = c.prototype;

        Buffer.rects = [];
        Buffer.getRect = function (id, w, h, x, y, rot) {
            x = x || 0;
            y = y || 9;
            rot = rot || false;
            if (Buffer.rects.length) {
                var rect = Buffer.rects.pop();
                rect.id = id;
                rect.x = x;
                rect.y = y;
                rect.w = w;
                rect.h = h;
                rect.rot = rot;
                return rect;
            }
            return new gallabf.Rect(id, w, h, x, y, rot);
        }

        Buffer.disposeRect = function (rect) {
            Buffer.rects.push(rect);
        }

        Buffer.lines = [];

        Buffer.getLine = function (x, y, w) {
            if (Buffer.lines.length) {
                var line = Buffer.lines.pop();
                line.x = x;
                line.y = y;
                line.w = w;
                return line;
            }
            return new gallabf.Line(x, y, w);
        }

        Buffer.disposeLine = function (line) {
            Buffer.lines.push(line);
        }

        return Buffer;
    })();
    gallabf.Buffer = Buffer;
})(gallabf || (gallabf = {}));