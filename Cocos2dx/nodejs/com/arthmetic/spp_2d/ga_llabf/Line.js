var gallabf;
(function (gallabf) {
    var Line = (function () {

        /**
         * 染色体
         *
         * 个体适应度 = 1/pacH
         *
         **/
        function Line(x, y, w) {
            this.x = x;
            this.y = y;
            this.w = w;
        }

        var d = __define, c = Line;
        p = c.prototype;

        return Line;
    })();
    gallabf.Line = Line;
})(gallabf || (gallabf = {}));