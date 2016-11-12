var gallabf;
(function (gallabf) {
    var Rect = (function () {

        function Rect(id, w, h, x, y, rot) {
            x = x || 0;
            y = y || 0;
            rot = rot || false;
            this.id = id;
            this.w = w;
            this.h = h;
            this.x = x;
            this.y = y;
            this.rot = rot;
        }

        var d = __define, c = Rect;
        p = c.prototype;

        p.clone = function () {
            return gallabf.Buffer.getRect(this.id, this.w, this.h, this.x, this.y, this.rot);
        }

        return Rect;
    })();
    gallabf.Rect = Rect;
})(gallabf || (gallabf = {}));