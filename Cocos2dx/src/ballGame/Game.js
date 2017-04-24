"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 台球游戏入口
 */

var Game = function () {

    /**
     * 墙壁
     * @type {Array}
     * @private
     */

    function Game(walls, holes) {
        _classCallCheck(this, Game);

        this._balls = [];
        this._walls = [];
        this._holes = [];

        this._walls = walls;
        this._holes = holes;
    }

    /**
     * 添加一个球，重复添加一个球无效
     * @param ball
     * @returns {*} 如果重复添加返回 null ，否则返回 ball
     */


    /**
     * 球洞
     * @type {Array}
     * @private
     */


    /**
     * 所有的球
     */


    _createClass(Game, [{
        key: "add",
        value: function add(ball) {
            for (var i = 0; i < this._balls.length; i++) {
                if (this._balls[i] == ball) {
                    return null;
                }
            }
            this._balls.push(ball);
            ball.$balls = this._balls;
            ball.$walls = this._walls;
            ball.$holes = this._holes;
            return ball;
        }

        /**
         * 删除球
         * @param ball
         * @returns {*} 如果未找到 ball 则返回 null ，否则返回 ball
         */

    }, {
        key: "remove",
        value: function remove(ball) {
            for (var i = 0; i < this._balls.length; i++) {
                if (this._balls[i] == ball) {
                    this._balls.splice(i, 1);
                    return ball;
                }
            }
            return null;
        }

        /**
         * 移除所有的球
         */

    }, {
        key: "removeAll",
        value: function removeAll() {
            this._balls = [];
        }

        /**
         * 更新，计算球的运动
         * @param dt 单位毫秒
         */

    }, {
        key: "update",
        value: function update(dt) {
            var balls = this._balls.concat();
            //var v = 0;
            for (var i = 0; i < balls.length; i++) {
                var ball = balls[i];
                if (this._hasBall(ball)) {
                    ball.update(dt);
                }
                //if (ball.holeIndex >= 0) {
                //    this.remove(ball);
                //}
                //i--;
                //v += Math.sqrt(ball._vx * ball._vx + ball._vy * ball._vy);
            }
            //console.log(v);
        }
    }, {
        key: "_hasBall",
        value: function _hasBall(ball) {
            for (var i = 0; i < this._balls.length; i++) {
                if (this._balls[i] == ball) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "isAllStop",
        value: function isAllStop() {
            for (var i = 0; i < this._balls.length; i++) {
                if (this._balls[i].isMove) {
                    return false;
                }
            }
            return true;
        }
    }]);

    return Game;
}();