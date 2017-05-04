class GameBall extends flower.Sprite {

    /**
     * 框架中 Ball 对象的引用
     */
    ball;

    constructor() {
        super();

        //this.image = new flower.Image();
        //this.image.x = this.image.y = -25 / 2;
        //this.addChild(this.image);

        this.colorReady = false;

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
        //var rot = this.ball.rotX;
        //this.image.rotation = rot * 180 / Math.PI;
        //rot += Math.PI / 4;
        //this.image.x = -12.5 * 1.414 * Math.cos(rot);
        //this.image.y = -12.5 * 1.414 * Math.sin(rot);
        if (this.colorReady) {

            var PI2 = Math.PI / 2;
            var skinD2 = this.skinD * this.skinD / 4;
            var skinR = this.skinD / 2;
            var skinCR = this.skinD / Math.PI;
            var colors = [];
            for (var y = 0; y < this.skinD; y++) {
                colors[y] = [];
                for (var x = 0; x < this.skinD; x++) {
                    var tx = (x - skinR);
                    var ty = (y - skinR);
                    tx = 8;
                    ty = 8;
                    if (tx * tx + ty * ty > skinD2) continue;
                    var rotYX = Math.atan2(ty, tx);
                    var rotZXY = Math.sqrt(tx * tx + ty * ty) / skinCR;
                    var pz = Math.cos(rotZXY);
                    var px = Math.cos(rotYX);
                    var py = Math.sin(rotYX);

                    var rotX = Math.atan2(pz, px);
                    var rotY = Math.atan2(pz, py);
                    var rotZ = rotYX;

                    rotX += this.ball.rotX;
                    rotY += this.ball.rotY;
                    rotZ += this.ball.rotZ;

                    px = rotX * this.skinD / Math.PI + skinR;
                    py = rotY * this.skinD / Math.PI + skinR;

                    colors[y][x] = this.colors[Math.floor(py)][Math.floor(px)];
                }
            }


            var scale = this.skinD / this.size;
            var size2 = this.size * this.size / 4;
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    var tx = x - this.size / 2;
                    var ty = y - this.size / 2;
                    if (tx * tx + ty * ty > size2) continue;
                    var shape = this.shapes[y][x];
                    shape.clear();
                    shape.fillColor = colors[Math.floor(y * scale)][Math.floor(x * scale)];
                    shape.drawRect(0, 0, 1, 1);
                }
            }
        }
    }

    set source(url) {
        //this.image.source = url;
        var loader = new flower.URLLoader(url);
        loader.load();
        loader.addListener(flower.Event.COMPLETE, this.loadColorComplete, this);
    }

    loadColorComplete(e) {
        this.shapes = [];
        for (var y = 0; y < this.size; y++) {
            this.shapes[y] = [];
            for (var x = 0; x < this.size; x++) {
                var shape = new flower.Shape();
                shape.x = x - this.size / 2;
                shape.y = y - this.size / 2;
                this.addChild(shape);
                //shape.fillAlpha = 1;
                //shape.drawRect(0,0,1,1);
                this.shapes[y][x] = shape;
            }
        }

        var RGB = 255 * 255 * 255;
        var colors = e.data;
        this.skinD = colors.length;

        this.colors = [];
        for (var y = 0; y < this.skinD; y++) {
            this.colors[y] = [];
            for (var x = 0; x < this.skinD; x++) {
                var color = colors[y][x];
                var a = color / RGB & 0xFF;
                var r = color >> 16 & 0xFF;
                var g = color >> 8 & 0xFF;
                var b = color & 0xFF;
                color = r << 16 | g << 8 | b;
                this.colors[y][x] = {
                    a: a,
                    color: color
                }
                //var shape = this.shapes[y][x];
                //if(!shape || !shape.clear) {
                //    console.log("?")
                //}
                //shape.clear();
                //shape.fillColor = this.colors[y][x].color;
                ////shape.fillAlpha = a / 255;
                //shape.drawRect(0, 0, 1, 1);
            }
        }
        this.colorReady = true;
        this.update();
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