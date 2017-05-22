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
        this._positionX = 23 + 58 * gridX;
        this._positionY = 23 + 58 * gridY;
        this.x = this._positionX;
        this.y = this._positionY;
        this.style = style;
    }

    //显示能移动的格子
    showCanMove() {
        this.showMoveFlag = true;
        this.showMoveImage = new flower.Image(this.style + "dot.png");
        this.showMoveImage.x = -22;
        this.showMoveImage.y = -22;
        this.addChild(this.showMoveImage);
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