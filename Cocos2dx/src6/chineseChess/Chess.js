class Chess extends flower.Sprite {

    //阵营
    _camp;
    _gridX;
    _gridY;
    _grids;
    _grid;
    _type; //类型 1.车  2.马  3.象  4.士  5.将  6.炮  7.卒

    constructor(grids, camp, type, source, gridX, gridY) {
        super();
        this._grids = grids;

        this._camp = camp;
        this._type = type;

        this.setGrid(gridX, gridY);

        this.img = new flower.Image(source);
        this.addChild(this.img);
        //调整图片到中心
        this.img.x = -30;
        this.img.y = -30;
    }

    selected() {
        this.alpha = 0.7;
    }

    unselected() {
        this.alpha = 1;
    }

    getNextGrids() {
        var list = [];
        var grids = this._grids;
        if (this.type == 1) {
            for (var i = this.gridX + 1, len = grids[this.gridY].length; i < len; i++) {
                if (grids[this.gridY][i].chess == null) {
                    list.push(grids[this.gridY][i]);
                } else {
                    break;
                }
            }
            for (var i = this.gridX - 1; i >= 0; i--) {
                if (grids[this.gridY][i].chess == null) {
                    list.push(grids[this.gridY][i]);
                } else {
                    break;
                }
            }
            for (var i = this.gridY + 1, len = grids.length; i < len; i++) {
                if (grids[i][this.gridX].chess == null) {
                    list.push(grids[i][this.gridX]);
                } else {
                    break;
                }
            }
            for (var i = this.gridY - 1; i >= 0; i--) {
                if (grids[i][this.gridX].chess == null) {
                    list.push(grids[i][this.gridX]);
                } else {
                    break;
                }
            }
        }
        return list;
    }

    get camp() {
        return this._camp;
    }

    setGrid(gridX, gridY) {
        this._gridX = gridX;
        this._gridY = gridY;
        this._grid = this._grids[this._gridY][this._gridX];
        this._grid.chess = this;
        this.x = this._grid.positionX;
        this.y = this._grid.positionY;
    }

    get gridX() {
        return this._gridX;
    }

    get gridY() {
        return this._gridY;
    }

    get type() {
        return this._type;
    }
}