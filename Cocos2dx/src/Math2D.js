"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var math2d = {};
(function (math) {
    //////////////////////////File:math/2d/Math.js///////////////////////////

    var Math = function () {
        function Math() {
            _classCallCheck(this, Math);
        }

        /**
         * 获取点到线段的垂足
         * @param point
         * @param segment
         */


        _createClass(Math, null, [{
            key: "getSegmentFootPoint",
            value: function getSegmentFootPoint(point, segment) {
                var vec1 = new Vector(point.x - segment.point1.x, point.y - segment.point1.y);
                var vec2 = new Vector(segment.point2.x - segment.point1.x, segment.point2.y - segment.point1.y);
                var vec3 = vec2.getUnitVector();
                vec3.length = vec1.dotProduct(vec2) / vec2.length;
                var vec4 = vec3.remove(vec1);
                return point.clone().addVector(vec4);
            }
        }]);

        return Math;
    }();

    math2d.getSegmentFootPoint = Math.getSegmentFootPoint;
    //////////////////////////End File:math/2d/Math.js///////////////////////////

    //////////////////////////File:math/2d/Point.js///////////////////////////

    var Point = function () {
        function Point() {
            var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            _classCallCheck(this, Point);

            this._x = 0;
            this._y = 0;

            this._x = x;
            this._y = y;
        }

        _createClass(Point, [{
            key: "getDistance",
            value: function getDistance(p) {
                return math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
            }

            /**
             * 加上向量位移
             * @param vec
             */

        }, {
            key: "addVector",
            value: function addVector(vec) {
                this.x += vec.x;
                this.y += vec.y;
                return this;
            }
        }, {
            key: "clone",
            value: function clone() {
                return new Point(this.x, this.y);
            }
        }, {
            key: "x",
            set: function set(val) {
                this._x = +val;
            },
            get: function get() {
                return this._x;
            }
        }, {
            key: "y",
            set: function set(val) {
                this._y = +val;
            },
            get: function get() {
                return this._y;
            }
        }]);

        return Point;
    }();

    math2d.Point = Point;
    //////////////////////////End File:math/2d/Point.js///////////////////////////

    //////////////////////////File:math/2d/Segment.js///////////////////////////
    /**
     * 线段
     */

    var Segment = function () {
        function Segment() {
            var x1 = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var y1 = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var x2 = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
            var y2 = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            _classCallCheck(this, Segment);

            this._point1 = null;
            this._point2 = null;

            this._point1 = new Point(x1, y1);
            this._point2 = new Point(x2, y2);
        }

        _createClass(Segment, [{
            key: "isPointInRange",


            /**
             * 判断线段所在的直线上的一点是否在线段范围内
             * @param point
             * @returns {boolean}
             */
            value: function isPointInRange(point) {
                var vec1 = new Vector(point.x - this.point1.x, point.y - this.point1.y);
                var vec2 = new Vector(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
                return vec1.length <= vec2.length && vec1.x * vec2.x >= 0 && vec2.y * vec2.y >= 0 ? true : false;
            }
        }, {
            key: "point1",
            get: function get() {
                return this._point1;
            }
        }, {
            key: "point2",
            get: function get() {
                return this._point2;
            }
        }]);

        return Segment;
    }();

    math2d.Segment = Segment;
    //////////////////////////End File:math/2d/Segment.js///////////////////////////

    //////////////////////////File:math/2d/Vector.js///////////////////////////
    /**
     * 向量
     * 为了避免计算斜率，通常用向量来解决相关计算问题
     */

    var Vector = function () {
        function Vector() {
            var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            _classCallCheck(this, Vector);

            this._x = 0;
            this._y = 0;

            this._x = x;
            this._y = y;
        }

        _createClass(Vector, [{
            key: "dotProduct",


            /**
             * 向量点积 |a||b|cosθ
             * @param vec
             * @returns {*}
             */
            value: function dotProduct(vec) {
                return this.x * vec.x + this.y * vec.y;
            }

            /**
             * 向量叉积 |a||b|sinθ
             * @param vec
             */

        }, {
            key: "crossProduct",
            value: function crossProduct(vec) {
                return this.x * vec.y - vec.x * this.y;
            }

            /**
             * 获取一个方向相同的单位向量
             */

        }, {
            key: "getUnitVector",
            value: function getUnitVector() {
                var len = this.length;
                return new Vector(this.x / len, this.y / len);
            }

            /**
             * 向量相加
             * @param vec
             */

        }, {
            key: "add",
            value: function add(vec) {
                return new Vector(this.x + vec.x, this.y + vec.y);
            }

            /**
             * 减去另外一个向量
             * @param vec
             */

        }, {
            key: "remove",
            value: function remove(vec) {
                return new Vector(this.x - vec.x, this.y - vec.y);
            }

            /**
             * 反向
             */

        }, {
            key: "reverse",
            value: function reverse() {
                this.x = -this.x;
                this.y = -this.y;
            }
        }, {
            key: "x",
            set: function set(val) {
                this._x = +val;
            },
            get: function get() {
                return this._x;
            }
        }, {
            key: "y",
            set: function set(val) {
                this._y = +val;
            },
            get: function get() {
                return this._y;
            }
        }, {
            key: "length",
            set: function set(val) {
                val = +val;
                var len = this.length;
                this.x *= val / len;
                this.y *= val / len;
            }

            /**
             * 向量长度
             * @returns {number|*}
             */
            ,
            get: function get() {
                return math.sqrt(this.x * this.x + this.y * this.y);
            }

            /**
             * 获取向量的弧度
             * @returns {number|*}
             */

        }, {
            key: "radian",
            get: function get() {
                return math.atan2(this.y, thisx);
            }
        }]);

        return Vector;
    }();

    math2d.Vector = Vector;
    //////////////////////////End File:math/2d/Vector.js///////////////////////////
})(Math);