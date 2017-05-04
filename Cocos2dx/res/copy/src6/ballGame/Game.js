/**
 * 台球游戏入口
 */
class Game {

    /**
     * 所有的球
     */
    _balls = [];

    /**
     * 墙壁
     * @type {Array}
     * @private
     */
    _walls = [];

    /**
     * 球洞
     * @type {Array}
     * @private
     */
    _holes = [];

    constructor(walls, holes) {
        this._walls = walls;
        this._holes = holes;
    }

    /**
     * 添加一个球，重复添加一个球无效
     * @param ball
     * @returns {*} 如果重复添加返回 null ，否则返回 ball
     */
    add(ball) {
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
    remove(ball) {
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
    removeAll() {
        this._balls = [];
    }

    /**
     * 更新，计算球的运动
     * @param dt 单位毫秒
     */
    update(dt) {
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

    _hasBall(ball) {
        for (var i = 0; i < this._balls.length; i++) {
            if (this._balls[i] == ball) {
                return true;
            }
        }
        return false;
    }

    isAllStop() {
        for (var i = 0; i < this._balls.length; i++) {
            if (this._balls[i].isMove) {
                return false;
            }
        }
        return true;
    }
}
