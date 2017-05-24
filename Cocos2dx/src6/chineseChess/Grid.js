class Grid extends flower.Sprite {

    _gridX = 0;
    _gridY = 0;
    _positionX;
    _positionY;
    chess;

    constructor(gridX, gridY, style) {
        super();
        this._gridX = gridX;
        this._gridY = gridY;
        this._positionX = 23 + 57 * gridX;
        this._positionY = 25 + 57 * gridY;
        this.x = this._positionX;
        this.y = this._positionY;
        this.style = style;

        var rect = new flower.Rect();
        rect.fillColor = 0xff0000;
        rect.width = 50;
        rect.height = 50;
        rect.x = -25;
        rect.y = -25;
        rect.alpha = 0;
        this.addChild(rect);
    }

    //显示能移动的格子
    showCanMove() {
        if (!this.showMoveFlag) {
            this.showMoveFlag = true;
            this.showMoveImage = new flower.Image(this.style + "dot.png");
            this.showMoveImage.x = -22 + 7;
            this.showMoveImage.y = -22 + 6;
            this.showMoveImage.touchEnabeld = false;
            this.addChild(this.showMoveImage);
        }
    }

    showNotMove() {
        if (this.showMoveFlag) {
            this.showMoveFlag = false;
            this.showMoveImage.dispose();
        }
    }

    showMoveBox(color) {
        if (!this.moveImage) {
            this.moveImage = new flower.Image(this.style + color + "_box.png");
            this.addChild(this.moveImage);
            this.moveImage.x = -26;
            this.moveImage.y = -26;
            this.moveImage.touchEnabeld = false;
        }
    }

    hideMoveBox() {
        if (this.moveImage) {
            this.moveImage.dispose();
            this.moveImage = null;
        }
    }

    get gridX() {
        return this._gridX;
    }

    get gridY() {
        return this._gridY;
    }

    get positionX() {
        return this._positionX;
    }

    get positionY() {
        return this._positionY;
    }
}