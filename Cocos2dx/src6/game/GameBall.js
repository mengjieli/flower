class GameBall extends flower.Sprite {

    /**
     * 框架中 Ball 对象的引用
     */
    ball;

    constructor() {
        super();

        this.image = new flower.Image();
        //this.image.x = this.image.y = -25;
        this.addChild(this.image);

        this.ball = new Ball();
        flower.EnterFrame.add(this.update, this);
    }

    /**
     * 射击球
     * @param f 力度，默认为 1 ，范围从 0 ~ 1
     * @param rot 角度，默认为 0
     * @param pointX 击球点 x ，范围 0 ~ 1 ，默认为 0.5 ，左下角为 0
     * @param pointY 击球点 y ，范围 0 ~ 1 ，默认为 0.5 ，左下角为 0
     * @param spinRot 旋转角度（扎杆）角度，默认为 0
     */
    shoot(f = 1, rot = 0, pointX = 0.5, pointY = 0.5, spinRot = 0) {
        this.ball.shoot(f, rot, pointX, pointY, spinRot);
    }

    update() {
        //if (this.parent && (super.x != this.ball.x || super.y != this.ball.y)) {
        //    var rect = new flower.Rect();
        //    rect.width = 2;
        //    rect.height = 2;
        //    rect.fillColor = 0;
        //    this.parent.addChild(rect);
        //    rect.x = super.x;
        //    rect.y = super.y;
        //}
        super.x = this.ball.x;
        super.y = this.ball.y;
        var rot = this.ball.rotX;
        this.image.rotation = rot * 180 / Math.PI;
        rot += Math.PI / 4;
        this.image.x = -12.5 * 1.414 * Math.cos(rot);
        this.image.y = -12.5 * 1.414 * Math.sin(rot);
    }

    set source(url) {
        this.image.source = url;
    }

    set x(val) {
        this.ball.x = val;
        super.x = this.ball.x;
    }

    get x() {
        return this.ball.x;
    }

    set y(val) {
        this.ball.y = val;
        super.y = this.ball.y;
    }

    get y() {
        return this.ball.y;
    }

    set size(val) {
        this.ball.size = val;
    }

    get size() {
        return this.ball.size;
    }
}