class BallGame extends flower.Group {

    /**
     * 框架中 Game 对象的引用
     */
    game;

    /**
     * 游戏中的球
     */
    balls;

    /**
     * 是否能够射击
     * @type {boolean}
     */
    canShoot = false;

    /**
     * 能否摆放白球位置
     * @type {boolean}
     */
    canSetWhite = true;

    /**
     * 是否开始拖动白球
     * @type {boolean}
     */
    dragFlag = false;

    constructor() {
        super();

        flower.Stage.getInstance().addChild(this);

        this.init();
    }

    init() {
        this.fps = new flower.TextField();
        this.addChild(this.fps);

        var size = 22;

        //var sides = [
        //    [50, 25, 57, 35],
        //    [57, 35, 368, 35],
        //    [368, 35, 374, 25],
        //
        //    [414, 25, 420, 35],
        //    [420, 35, 731, 35],
        //    [731, 35, 742, 25],
        //
        //    [766, 50, 752, 60],
        //    [752, 60, 752, 367],
        //    [752, 367, 766, 376],
        //
        //    [742, 402, 731, 392],
        //    [731, 392, 420, 392],
        //    [420, 392, 414, 402],
        //
        //    [374, 402, 368, 392],
        //    [368, 392, 57, 392],
        //    [57, 392, 50, 402],
        //
        //    [25, 380, 38, 367],
        //    [38, 367, 38, 60],
        //    [38, 60, 25, 50]
        //];

        var sides = [
            [53, 30, 65, 35],
            [65, 35, 363, 35],
            [365, 35, 375, 25],

            [416, 30, 420, 35],
            [420, 35, 731, 35],
            [731, 35, 735, 30],

            [761, 55, 752, 60],
            [752, 60, 752, 367],
            [752, 367, 761, 371],

            [735, 397, 731, 392],
            [731, 392, 420, 392],
            [420, 392, 416, 397],

            [372, 397, 368, 392],
            [368, 392, 57, 392],
            [57, 392, 52, 397],

            [30, 375, 38, 367],
            [38, 367, 38, 60],
            [38, 60, 30, 55]
        ];

        //40 36 713 358
        this.game = new Game(sides,
            []);


        flower.EnterFrame.add(this.update, this);

        this.container = new flower.Sprite();
        this.addChild(this.container);
        this.bg = new flower.Image("res/bg.png");
        this.container.addChild(this.bg);

        for (var i = 0; i < sides.length; i++) {
            var shape = new flower.Shape();
            shape.lineWidth = 1;
            shape.lineColor = 0xaa0000;
            shape.drawLine(sides[i][0], sides[i][1], sides[i][2], sides[i][3]);
            this.addChild(shape);
        }

        this.control = new Control();
        this.addChild(this.control);
        this.control.y = 450;


        for (var i = 0; i < 0; i++) {
            var a = [1, 3, 6, 10, 15];
            for (var m = 0; m < a.length; m++) {
                if ((i + 1) <= a[m]) {
                    break;
                }
            }
            var ball = new GameBall();
            ball.source = "res/8.json";
            size+=3;
            ball.x = 572 + 0 + m * (size / 2) * Math.sqrt(3);
            ball.y = 214 + 0 + m * (size / 2) - (a[m] - i - 1) * size;
            size-=3;
            ball.size = size;
            this.addBall(ball);
            ball.ball.id = 1;
        }


        var ball = new GameBall();
        ball.source = "res/8.json";
        ball.size = size;
        ball.x = 200;
        ball.y = 200;
        this.addBall(ball);
        this.whiteBall = ball;

        //瞄准用的假球
        var virtualWhiteBall = new GameBall();
        virtualWhiteBall.source = "res/8.json";
        virtualWhiteBall.size = size;
        virtualWhiteBall.alpha = 0.3;
        virtualWhiteBall.visible = false;
        virtualWhiteBall.touchEnabeld = false;
        this.container.addChild(virtualWhiteBall);
        this.virtualWhiteBall = virtualWhiteBall;

        //瞄准线
        this.drawLine = new flower.Shape();
        this.drawLine.lineWidth = 1;
        this.drawLine.lineColor = 0xffffff;
        this.drawLine.lineAlpha = 0.5;
        this.drawLine.touchEnabled = false;
        this.container.addChild(this.drawLine);

        this.container.addListener(flower.MouseEvent.MOUSE_MOVE, this.onMove, this);
        this.container.addListener(flower.TouchEvent.TOUCH_BEGIN, this.startShoot, this);
        this.container.addListener(flower.TouchEvent.TOUCH_END, this.click, this);
    }

    /**
     * 准备蓄力射击
     * @param e
     */
    startShoot(e) {
        if (this.canShoot) {
            this.control.startF();
        }
    }

    /**
     * 点击桌台
     * @param e
     */
    click(e) {
        if (this.canShoot) { //射击
            //this.whiteBall.shoot(0.2, 180 * Math.atan2(e.touchY - this.whiteBall.y, e.touchX - this.whiteBall.x) / Math.PI, 0.5, 0.5);
            //var rot = 45;
            //var spinRot = 50;
            //var dis = 0.2; // max = 0.38;
            //this.whiteBall.shoot(1, 0, 0.5 + dis * Math.cos(rot * Math.PI / 180), 0.5 - dis * Math.sin(rot * Math.PI / 180), spinRot);
            this.control.endF();
            this.whiteBall.shoot(this.control.f, 180 * Math.atan2(e.touchY - this.whiteBall.y, e.touchX - this.whiteBall.x) / Math.PI, this.control.pointAnchorX, this.control.pointAnchorY, this.control.spinRot);

            this.canShoot = false;
            this.drawLine.clear();
            this.virtualWhiteBall.visible = false;
        }
        if (this.canSetWhite) { //移动瞄准线
            this.whiteBall.x = e.touchX;
            this.whiteBall.y = e.touchY;
            this.whiteBall.ball._holeIndex = -1;
            this.canSetWhite = false;
            this.canShoot = true;
        }
    }

    /**
     * 移动瞄准线
     * @param e
     */
    onMove(e) {
        if (this.canSetWhite) {
            if (!this.dragFlag) {
                this.whiteBall.x = e.mouseX;
                this.whiteBall.y = e.mouseY;
                this.whiteBall.startDrag();
            }
        }
        if (this.canShoot) {
            this.drawLine.clear();
            this.virtualWhiteBall.visible = true;
            this.virtualWhiteBall.x = e.mouseX;
            this.virtualWhiteBall.y = e.mouseY;
            this.drawLine.drawLine(this.whiteBall.x, this.whiteBall.y, e.mouseX, e.mouseY);
        }
    }

    /**
     * 游戏核心循环运行
     * @param now
     * @param dt
     */
    update(now, dt) {
        //游戏核心运行必须要循环调用这个函数
        this.game.update(dt);
        if (!this.canSetWhite && !this.canShoot) {
            if (this.game.isAllStop()) {
                if (this.whiteBall.ball.holeIndex >= 0) {
                    this.canSetWhite = true;
                } else {
                    this.canShoot = true;
                }
            }
        }
    }

    /**
     * 添加球
     * @param ball
     */
    addBall(ball) {
        if (this.game.add(ball.ball)) { //判断球是否重复添加
            this.container.addChild(ball);
        }
    }
}