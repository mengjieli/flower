class Control extends flower.Sprite {

    pointX = 390;
    pointY = 48;
    rangePoint = 26;
    maxPoint = 32;

    fDirection = true;

    /**
     * 控制条
     */
    constructor() {
        super();

        this.bg = new flower.Image("res/control.png");
        this.bg.x = 318;
        this.addChild(this.bg);

        this.point = new flower.Image("res/point.png");
        this.point.x = this.pointX;
        this.point.y = this.pointY;
        this.addChild(this.point);
        this.point.addListener(flower.TouchEvent.TOUCH_BEGIN, this.touchPoint, this);
        this.point.addListener(flower.TouchEvent.TOUCH_MOVE, this.touchPoint, this);

        this.spin = new flower.Shape();
        this.spin.lineWidth = 1;
        this.spin.lineColor = 0xff0000;
        this.spin.drawLine(0, 0, 46, 0);
        this.spin.x = 442;
        this.spin.y = 57 + 30;
        this.addChild(this.spin);
        this.spinTouch = new flower.Shape();
        this.spinTouch.alpha = 0;
        this.spinTouch.drawRect(0, 0, 50, 50);
        this.spinTouch.x = 442;
        this.spinTouch.y = 57 + 30 - 50;
        this.addChild(this.spinTouch);
        this.spinTouch.addListener(flower.TouchEvent.TOUCH_MOVE, this.touchSpin, this);
        this.spinTxt = new flower.Label("0°");
        this.spinTxt.x = 442 + 30;
        this.spinTxt.y = 57 + 30 - 50;
        this.spinTxt.fontColor = 0xaa0000;
        this.addChild(this.spinTxt);

        this.fprogressBg = new flower.Shape();
        this.fprogressBg.lineWidth = 1;
        this.fprogressBg.lineColor = 0;
        this.fprogressBg.fillColor = 0x938f8f;
        this.fprogressBg.drawRect(0, 0, 100, 20);
        this.fprogressBg.x = 150;
        this.addChild(this.fprogressBg);
        this.fTxt = new flower.Label();
        this.fTxt.x = 150;
        this.fTxt.y = 25;
        this.fTxt.text = "100";
        this.addChild(this.fTxt);
        this.fprogress = new flower.Shape();
        this.fprogress.fillColor = 0xa00000;
        this.fprogress.x = 150;
        this.fprogress.drawRect(0, 0, 100, 20);
        this.addChild(this.fprogress);
    }

    touchPoint(e) {
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                this.stageDragX = e.stageX;
                this.stageDragY = e.stageY;
                this.pointDragX = this.point.x;
                this.pointDragY = this.point.y;
                break;
            case flower.TouchEvent.TOUCH_MOVE:
                this.point.x = e.stageX - this.stageDragX + this.pointDragX;
                this.point.y = e.stageY - this.stageDragY + this.pointDragY;
                var dis = Math.sqrt((this.point.x - this.pointX) * (this.point.x - this.pointX) + (this.point.y - this.pointY) * (this.point.y - this.pointY));
                if (dis > this.rangePoint) {
                    dis = this.rangePoint;
                }
                var rot = Math.atan2(this.point.y - this.pointY, this.point.x - this.pointX);
                this.point.x = dis * Math.cos(rot) + this.pointX;
                this.point.y = dis * Math.sin(rot) + this.pointY;
                break;

        }
    }

    touchSpin(e) {
        this.spin.rotation = Math.atan2(e.touchY - 50, e.touchX) * 180 / Math.PI;
        if (this.spin.rotation >= 85 && this.spin.rotation < 275) {
            this.spin.rotation = 275;
        }
        if (this.spin.rotation < 85) {
            this.spin.rotation = 0;
        }
        this.spinTxt.text = this.spinRot + "°";
    }

    startF() {
        this.fprogress.scaleX = 1;
        this.fTime = flower.CoreTime.currentTime;
        flower.EnterFrame.add(this.fGo, this);
        this.fTxt.text = ~~(this.f * 100);
    }

    endF() {
        flower.EnterFrame.remove(this.fGo, this);
    }

    fGo() {
        var now = flower.CoreTime.currentTime;
        if (now - this.fTime > 500) {
            if (this.fDirection) {
                this.fprogress.scaleX += flower.CoreTime.lastTimeGap / 1000;
                if (this.fprogress.scaleX >= 1) {
                    this.fprogress.scaleX = 1;
                    this.fDirection = false;
                }
            } else {
                this.fprogress.scaleX -= flower.CoreTime.lastTimeGap / 1000;
                if (this.fprogress.scaleX <= 0) {
                    this.fprogress.scaleX = 0;
                    this.fDirection = true;
                }
            }
        }
        this.fTxt.text = ~~(this.f * 100);
    }

    get spinRot() {
        return this.spin.rotation == 0 ? 0 : ~~(360 - this.spin.rotation);
    }

    get pointAnchorX() {
        return (this.point.x + this.maxPoint - this.pointX) / (this.maxPoint * 2);
    }

    get pointAnchorY() {
        return 1 - (this.point.y + this.maxPoint - this.pointY) / (this.maxPoint * 2);
    }

    get f() {
        return (Math.round(this.fprogress.scaleX * 100 ))/100;
    }
}