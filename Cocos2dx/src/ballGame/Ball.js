"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 球
 */

var Ball = function () {
    //是否正在运动

    //0.97;

    //z方向的滚动摩擦系数
    //摩擦系数
    //半径
    //质量 125g

    function Ball() {
        _classCallCheck(this, Ball);

        this._m = 0.125;
        this._p = 1.0;
        this._r = 1;
        this._x = 0;
        this._y = 0;
        this._g = 10;
        this._u = 0.2;
        this._u2 = 0.015;
        this._uz = 0.002;
        this._size = 12.5;
        this._rotX = 0;
        this._rotY = 0;
        this._rotZ = 0;
        this._collisionBall = 1;
        this._vx = 0;
        this._vy = 0;
        this._vxt = 0;
        this._vyt = 0;
        this._wx = 0;
        this._wy = 0;
        this._wz = 0;
        this._isMove = false;
        this._holeIndex = -1;

        this.allT = 0;
    }

    /**
     * 射击球
     * @param f 力度，默认为 1 ，范围从 0 ~ 1
     * @param rot 角度，数学坐标，右上角为第一象限，默认为 0
     * @param pointX 击球点 x ，范围 0 ~ 1 ，默认为 0.5 ，左下角为 0
     * @param pointY 击球点 y ，范围 0 ~ 1 ，默认为 0.5 ，左下角为 0
     * @param spinRot 旋转角度（扎杆）角度，默认为 0 ，范围为 0 ~ 90
     */
    //水平方向的角速度
    //水平滑动结束时间
    //水平滑动的速度


    //球的碰撞系数
    //碰撞像素半径
    //滚动摩擦系数
    //重力加速度
    //
    //力度系数


    _createClass(Ball, [{
        key: "shoot",
        value: function shoot() {
            var f = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
            var rot = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var pointX = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];
            var pointY = arguments.length <= 3 || arguments[3] === undefined ? 0.5 : arguments[3];
            var spinRot = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

            rot = rot * Math.PI / 180;
            if (spinRot < 0) {
                spinRot = 0;
            }
            if (spinRot > 90) {
                spinRot = 90;
            }
            spinRot = spinRot * Math.PI / 180;
            if (f < 0) {
                f = 0;
            }
            if (f > 1) {
                f = 1;
            }
            if (pointX < 0) {
                pointX = 0;
            }
            if (pointX > 1) {
                pointX = 1;
            }
            if (pointY < 0) {
                pointY = 0;
            }
            if (pointY > 1) {
                pointY = 1;
            }
            this._vx = f * this._p / this._m * Math.cos(rot) * Math.cos(spinRot);
            this._vy = f * this._p / this._m * Math.sin(rot) * Math.cos(spinRot);
            this._wx = 2.5 * (pointY - 0.5) / (this._r * this._r) * f * this._p / this._m * Math.cos(rot) * Math.cos(spinRot);
            this._wy = 2.5 * (pointY - 0.5) / (this._r * this._r) * f * this._p / this._m * Math.sin(rot) * Math.cos(spinRot);
            if (spinRot) {
                var dis = Math.sqrt((pointX - 0.5) * (pointX - 0.5) + (pointY - 0.5) * (pointY - 0.5));
                var spinVRot = Math.atan2(pointX - 0.5, pointY - 0.5);

                //this._vx += dis * f * this._p * Math.cos(spinVRot) / this._m * Math.cos(spinRot);
                //this._vy += dis * f * this._p * Math.sin(spinVRot) / this._m * Math.cos(spinRot);

                this._wx += 2.5 * dis / (this._r * this._r) * f * this._p * Math.cos(spinVRot) / this._m * Math.sin(spinRot);
                this._wy += 2.5 * dis / (this._r * this._r) * f * this._p * Math.sin(spinVRot) / this._m * Math.sin(spinRot);
            }
            this._wz += 2.5 * 2 * (pointX - 0.5) / (this._r * this._m) * f;
            this.moveT = 0;
            this.oldX = this.x;
        }

        /**
         * 更新
         * @param dt 单位毫秒
         */

    }, {
        key: "update",
        value: function update(dt) {
            if (this._holeIndex >= 0) {
                this._isMove = false;
                return;
            }
            //dt = 1;
            //this.allT += dt;
            if (this.allT % 4) return;
            if (this.stop) return;
            dt = +dt & ~0;
            while (dt) {
                var t = 1;
                if (dt < t) {
                    t = dt;
                    dt = 0;
                } else {
                    dt -= t;
                }
                t /= 1000;
                if (this._vx || this._vy || this._wx || this._wy) {
                    this.moveT += t;
                    this.moveT = Math.round(this.moveT * 1000) / 1000;

                    var oldX = this._x;
                    var oldY = this._y;
                    //位移
                    this._x += this._vx * t * 200;
                    this._y += this._vy * t * 200;

                    //判断碰撞
                    t = this.checkCollision(t, oldX, oldY);

                    //旋转
                    this._rotX += this._wx * t * 20;
                    this._rotY += this._wy * t * 20;

                    if (this._vx == this._wx * this._r && this._vy == this._wy * this._r) {
                        //无滑动
                        var rot = Math.atan2(-this._vy, -this._vx);
                        var uv = this._u2 * this._g * t;
                        var tvx = this._vx + uv * Math.cos(rot);
                        var tvy = this._vy + uv * Math.sin(rot);
                        var twx = this._wx + uv / this._r * Math.cos(rot);
                        var twy = this._wy + uv / this._r * Math.sin(rot);
                        tvx = Math.round(tvx * 1000000) / 1000000;
                        tvy = Math.round(tvy * 1000000) / 1000000;
                        twx = Math.round(twx * 1000000) / 1000000;
                        twy = Math.round(twy * 1000000) / 1000000;
                        if (this._vx * tvx <= 0) {
                            tvx = 0;
                        }
                        if (this._vy * tvy <= 0) {
                            tvy = 0;
                        }
                        if (this._wx * twx <= 0) {
                            twx = 0;
                        }
                        if (this._wy * twy <= 0) {
                            twy = 0;
                        }
                    } else {
                        //有滑动
                        var vx = this._vx - this._wx * this._r;
                        var vy = this._vy - this._wy * this._r;
                        var rot = Math.atan2(-vy, -vx);
                        var uv = this._u * this._g * t;
                        var uvw = -2.5 * this._u * this._g * t / this._r;
                        var tvx = this._vx + uv * Math.cos(rot);
                        var tvy = this._vy + uv * Math.sin(rot);
                        var twx = this._wx + uvw * Math.cos(rot);
                        var twy = this._wy + uvw * Math.sin(rot);
                        tvx = Math.round(tvx * 1000000) / 1000000;
                        tvy = Math.round(tvy * 1000000) / 1000000;
                        twx = Math.round(twx * 1000000) / 1000000;
                        twy = Math.round(twy * 1000000) / 1000000;
                        var rot1 = Math.atan2(this._vy, this._vx);
                        var rot2 = Math.atan2(this._wy, this._wx);
                        var nrot1 = Math.atan2(tvy, tvx);
                        var nrot2 = Math.atan2(twy, twx);
                        if (Math.round(rot1 * 1000) / 1000 == Math.round(rot2 * 1000) / 1000 || (rot1 - rot2) * (nrot1 - nrot2) <= 0) {
                            //判断是否还有滑动
                            var v1 = this._vx * this._vx + this._vy * this._vy;
                            var w1 = (this._wx * this._wx + this._wy * this._wy) * this._r * this._r;
                            var v2 = tvx * tvx + tvy * tvy;
                            var w2 = (twx * twx + twy * twy) * this._r * this._r;
                            if ((v1 - w1) * (v2 - w2) <= 0) {
                                twx = tvx / this._r;
                                twy = tvy / this._r;
                            }
                        }
                    }
                    this._vx = tvx;
                    this._vy = tvy;
                    this._wx = twx;
                    this._wy = twy;
                    this._isMove = true;
                    //if (this.id == 1)
                    //    console.log(this._vx, this._vy);
                    //console.log(Math.sqrt(this._vx*this._vx + this._vy*this._vy))
                } else {
                        this._isMove = false;
                    }
                if (this._wz) {
                    this._rotZ += this._wz * t;
                    var otwz = this._wz;
                    var twz = this._wz + (this._wz > 0 ? -1 : 1) * this._uz * t;
                    if (twz * otwz <= 0) {
                        twz = 0;
                    }
                    this._wz = twz;
                }
            }
        }

        /**
         * 检测碰撞
         */

    }, {
        key: "checkCollision",
        value: function checkCollision(t, oldX, oldY) {
            //1.判断与球的碰撞
            var balls = this.$balls;
            for (var i = 0; i < balls.length; i++) {
                if (balls[i] != this) {
                    var checkBall = balls[i];
                    var ballDis = Math.sqrt((checkBall.x - this.x) * (checkBall.x - this.x) + (checkBall.y - this.y) * (checkBall.y - this.y));
                    if (ballDis < this.size) {
                        //var otx = this._vx;
                        //var oty = this._vy;
                        //var btx = checkBall._vx;
                        //var bty = checkBall._vy;

                        var dis = Math.sqrt(this._vx * t * 200 * this._vx * t * 200 + this._vy * t * 200 * this._vy * t * 200);
                        var ta = (this.size - ballDis) / dis;
                        ta = 1;
                        //反向移动到正好碰撞的点
                        this._x -= this._vx * t * ta * 200;
                        this._y -= this._vy * t * ta * 200;
                        t = t * (1 - ta);
                        //以下全部计算碰撞后的速度
                        var ballRot = Math.atan2(checkBall.y - this.y, checkBall.x - this.x);
                        //把速度转换到两球心连接的坐标系
                        var tvx = this._vx * Math.cos(ballRot) + this._vy * Math.sin(ballRot);
                        var tvy = this._vy * Math.cos(ballRot) - this._vx * Math.sin(ballRot);
                        var bvx = checkBall._vx * Math.cos(ballRot) + checkBall._vy * Math.sin(ballRot);
                        var bvy = checkBall._vy * Math.cos(ballRot) - checkBall._vx * Math.sin(ballRot);
                        //碰撞后的速度
                        var a = tvx;
                        tvx = this._collisionBall * bvx;
                        bvx = this._collisionBall * a;
                        //速度转换成正常的坐标系
                        this._vx = tvx * Math.cos(-ballRot) + tvy * Math.sin(-ballRot);
                        this._vy = tvy * Math.cos(-ballRot) - tvx * Math.sin(-ballRot);
                        checkBall._vx = bvx * Math.cos(-ballRot) + bvy * Math.sin(-ballRot);
                        checkBall._vy = bvy * Math.cos(-ballRot) - bvx * Math.sin(-ballRot);

                        //if (Math.sqrt(this._vx * this._vx + this._vy * this._vy) + Math.sqrt(checkBall._vx * checkBall._vx + checkBall._vy * checkBall._vy) > Math.sqrt(otx * otx + oty * oty) + Math.sqrt(btx * btx + bty * bty)) {
                        //    this._vx = otx;
                        //    this._vy = oty;
                        //    checkBall._vx = btx;
                        //    checkBall._vy = bty;
                        //
                        //    var dis = Math.sqrt(this._vx * t * 200 * this._vx * t * 200 + this._vy * t * 200 * this._vy * t * 200);
                        //    var ta = (this.size - ballDis) / dis;
                        //    //反向移动到正好碰撞的点
                        //    this._x -= this._vx * t * ta * 200;
                        //    this._y -= this._vy * t * ta * 200;
                        //    t = t * (1 - ta);
                        //    //碰撞后的速度
                        //    var ballRot = Math.atan2(checkBall.y - this.y, checkBall.x - this.x);
                        //    //把速度转换到两球心连接的坐标系
                        //    var tvx = this._vx * Math.cos(ballRot) + this._vy * Math.sin(ballRot);
                        //    var tvy = this._vy * Math.cos(ballRot) - this._vx * Math.sin(ballRot);
                        //    var bvx = checkBall._vx * Math.cos(ballRot) + checkBall._vy * Math.sin(ballRot);
                        //    var bvy = checkBall._vy * Math.cos(ballRot) - checkBall._vx * Math.sin(ballRot);
                        //    //碰撞后的速度
                        //    var a = tvx;
                        //    tvx = this._collisionBall * bvx;
                        //    bvx = this._collisionBall * a;
                        //    //速度转换成正常的坐标系
                        //    this._vx = tvx * Math.cos(-ballRot) + tvy * Math.sin(-ballRot);
                        //    this._vy = tvy * Math.cos(-ballRot) - tvx * Math.sin(-ballRot);
                        //    checkBall._vx = bvx * Math.cos(-ballRot) + bvy * Math.sin(-ballRot);
                        //    checkBall._vy = bvy * Math.cos(-ballRot) - bvx * Math.sin(-ballRot);
                        //
                        //    //console.log("!!!!",Math.sqrt(this._vx*this._vx + this._vy*this._vy) + Math.sqrt(checkBall._vx*checkBall._vx + checkBall._vy*checkBall._vy) - (Math.sqrt(otx*otx + oty*oty) + Math.sqrt(btx*btx+bty*bty)))
                        //}
                    }
                }
            }

            //2.判断与边的碰撞
            var walls = this.$walls;
            for (var i = 0; i < walls.length; i++) {
                var wall = walls[i];
                var center = new math2d.Point(this.x, this.y);
                var segement = new math2d.Segment(wall[0], wall[1], wall[2], wall[3]);
                var footPoint = math2d.getSegmentFootPoint(center, segement);
                //判断球是否与边相交
                if (footPoint.getDistance(center) < this.size * 0.5 && segement.isPointInRange(footPoint) || center.getDistance(segement.point1) < this.size * 0.5 || center.getDistance(segement.point2) < this.size * 0.5) {
                    //第一种相交，球与线段相切
                    //console.log("碰到边", this.x, this.y, wall[0], wall[1], wall[2], wall[3])
                    var dis = Math.sqrt(this._vx * t * 200 * this._vx * t * 200 + this._vy * t * 200 * this._vy * t * 200);
                    var backDis = this.size * 0.5 - footPoint.getDistance(center);
                    var ta = backDis / dis;
                    //if (ta > 1) {
                    //    ta = 1;
                    //}
                    ta = 1;
                    this._x -= this._vx * t * ta * 200;
                    this._y -= this._vy * t * ta * 200;
                    t = (1 - ta) * t;
                    //console.log(this.x, this.y)

                    //把球的速度转换成墙坐标系的速度
                    var wallRot = Math.atan2(segement.point2.y - segement.point1.y, segement.point2.x - segement.point1.x);
                    var tvx = this._vx * Math.cos(wallRot) + this._vy * Math.sin(wallRot);
                    var tvy = this._vy * Math.cos(wallRot) - this._vx * Math.sin(wallRot);
                    //垂直于墙面的速度反向
                    tvy = -tvy * 0.9;
                    tvx *= 0.8;
                    //平行于墙面的速度被吸收一部分

                    //墙面吸收了垂直于墙面的转动
                    var twx = this._wx * Math.cos(wallRot) + this._wy * Math.sin(wallRot);
                    var twy = this._wy * Math.cos(wallRot) - this._wx * Math.sin(wallRot);
                    twy = -twy;
                    //平行于墙面的转速一部分转换成速度
                    var wa = 0.1 + (10 - (Math.abs(tvy) > 10 ? 10 : Math.abs(tvy))) * 0.04;
                    tvx += this._wz * this._r * wa / 5;
                    this._wz *= wa;

                    //速度转换成正常的坐标系
                    this._vx = tvx * Math.cos(-wallRot) + tvy * Math.sin(-wallRot);
                    this._vy = tvy * Math.cos(-wallRot) - tvx * Math.sin(-wallRot);
                    //转速转换成正常的坐标系
                    this._wx = twx * Math.cos(-wallRot) + twy * Math.sin(-wallRot);
                    this._wy = twy * Math.cos(-wallRot) - twx * Math.sin(-wallRot);
                }
            }

            //判断球是否进洞
            //var holes = this.$holes;
            //for (var i = 0; i < holes.length; i++) {
            //    var hole = holes[i];
            //
            //}
            if (this.y < 30 || this.x < 30 || this.x > 761 || this.y > 397) {
                this._holeIndex = 0;
                this._x = -100;
                this._y = -100;
                this._vx = this._vy = this._wx = this._wy = this._wz = 0;
            } else {
                this._holeIndex = -1;
            }

            return t;
        }

        /**
         * 设置碰撞半径
         * @param val 默认为1
         */

    }, {
        key: "size",
        set: function set(val) {
            this._size = +val;
        },
        get: function get() {
            return this._size;
        }

        /**
         * 设置球的位置 x
         * @param val
         */

    }, {
        key: "x",
        set: function set(val) {
            this._x = +val;
        },
        get: function get() {
            return this._x;
        }

        /**
         * 设置球的位置 y
         * @param val
         */

    }, {
        key: "y",
        set: function set(val) {
            this._y = +val;
        },
        get: function get() {
            return this._y;
        }

        /**
         * 设置球的 x 方向角度
         * @param val
         */

    }, {
        key: "rotX",
        set: function set(val) {
            this._rotX = +val;
        },
        get: function get() {
            return this._rotX;
        }

        /**
         * 设置球的 y 方向角度
         * @param val
         */

    }, {
        key: "rotY",
        set: function set(val) {
            this._rotY = +val;
        },
        get: function get() {
            return this._rotY;
        }

        /**
         * 设置球的 z 方向角度
         * @param val
         */

    }, {
        key: "rotZ",
        set: function set(val) {
            this._rotZ = +val;
        },
        get: function get() {
            return this._rotZ;
        }

        /**
         * 设置标识，方便外界区别，框架内部不对 id 作任何读写操作
         * @param val
         */

    }, {
        key: "id",
        set: function set(val) {
            this._id = val;
        },
        get: function get() {
            return this._id;
        }

        /**
         * 是否正在运动
         * @returns {boolean}
         */

    }, {
        key: "isMove",
        get: function get() {
            return this._isMove;
        }

        /**
         * 在几号洞中，如果没有进洞为 -1
         */

    }, {
        key: "holeIndex",
        get: function get() {
            return this._holeIndex;
        }
    }]);

    return Ball;
}();