class GameBall extends flower.Sprite {

    /**
     * 框架中 Ball 对象的引用
     */
    ball;

    constructor() {
        super();

        this.bg = new flower.Image("res/ball.png");
        this.bg.x = this.bg.y = -25 / 2;
        this.addChild(this.bg);


        this.shapes = [];
        for (var y = 0; y < 25; y++) {
            this.shapes[y] = [];
            for (var x = 0; x < 25; x++) {
                var shape = new flower.Shape();
                shape.x = x - 12;
                shape.y = y - 12;
                this.addChild(shape);
                shape.fillAlpha = 1;
                shape.drawRect(0,0,1,1);
                this.shapes[y][x] = shape;
            }
        }
        this.colorReady = false;

        this.ball = new Ball();
        flower.EnterFrame.add(this.update, this);


        this.update();

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

        var rotX = -this.ball.rotX % Math.PI;
        var rotY = -this.ball.rotY % Math.PI;
        if (rotX < 0) {
            rotX += Math.PI;
        }
        if (rotY < 0) {
            rotY += Math.PI;
        }

        //this.icon.x = rotX

        //var rot = this.ball.rotX;
        //this.bg.rotation = rot * 180 / Math.PI;
        //rot += Math.PI / 4;
        //this.bg.x = -12.5 * 1.414 * Math.cos(rot);
        //this.bg.y = -12.5 * 1.414 * Math.sin(rot);
    }

    set source(url) {
        //this.bg.source = url;
        //for (var y = 0; y < 25; y++) {
        //    for (var x = 0; x < 25; x++) {
        //        this.shape.fillColor = 0;
        //        this.shape.drawRect(0, 0, 1, 1);
        //    }
        //}
        var loader = new flower.URLLoader(url);
        loader.load();
        loader.addListener(flower.Event.COMPLETE, this.loadColorComplete, this);
    }

    loadColorComplete(e) {
        return;
        var RGB = 255 * 255 * 255;
        var colors = e.data;
        for (var y = 0; y < colors.length; y++) {
            for (var x = 0; x < colors[y].length; x++) {
                var color = colors[y][x];
                var a = color / RGB & 0xFF;
                var r = color >> 16 & 0xFF;
                var g = color >> 8 & 0xFF;
                var b = color & 0xFF;
                color = r << 16 | g << 8 | b;
                colors[y][x] = {
                    a: a,
                    color: color
                }
                var shape = this.shapes[y][x];
                shape.clear();
                shape.fillColor = color;
                //shape.fillAlpha = a / 255;
                shape.drawRect(0, 0, 1, 1);
            }
        }
        this.colorReady = true;
        this.update();
    }

    set
    iconSource(url) {
        //this.icon1.source = url;
        //this.icon2.source = url;
        //this.icon3.source = url;
        //this.icon4.source = url;
    }

    set
    x(val) {
        this.ball.x = val;
        super.x = this.ball.x;
    }

    get
    x() {
        return this.ball.x;
    }

    set
    y(val) {
        this.ball.y = val;
        super.y = this.ball.y;
    }

    get
    y() {
        return this.ball.y;
    }

    set
    size(val) {
        this.ball.size = val;
    }

    get
    size() {
        return this.ball.size;
    }
}