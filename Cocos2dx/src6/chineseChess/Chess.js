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
        this.img.x = -26;
        this.img.y = -26;
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
                if (grids[this.gridY][i].chess == null || grids[this.gridY][i].chess.camp != this.camp) {
                    list.push(grids[this.gridY][i]);
                    if (grids[this.gridY][i].chess) {
                        break;
                    }
                } else {
                    break;
                }
            }
            for (var i = this.gridX - 1; i >= 0; i--) {
                if (grids[this.gridY][i].chess == null || grids[this.gridY][i].chess.camp != this.camp) {
                    list.push(grids[this.gridY][i]);
                    if (grids[this.gridY][i].chess) {
                        break;
                    }
                } else {
                    break;
                }
            }
            for (var i = this.gridY + 1, len = grids.length; i < len; i++) {
                if (grids[i][this.gridX].chess == null || grids[i][this.gridX].chess.camp != this.camp) {
                    list.push(grids[i][this.gridX]);
                    if (grids[i][this.gridX].chess) {
                        break;
                    }
                } else {
                    break;
                }
            }
            for (var i = this.gridY - 1; i >= 0; i--) {
                if (grids[i][this.gridX].chess == null || grids[i][this.gridX].chess.camp != this.camp) {
                    list.push(grids[i][this.gridX]);
                    if (grids[i][this.gridX].chess) {
                        break;
                    }
                } else {
                    break;
                }
            }
        } else if (this.type == 2) {
            var poses = [[-1, 2, 0, 1], [1, 2, 0, 1], [-1, -2, 0, -1], [1, -2, 0, -1], [2, 1, 1, 0], [2, -1, 1, 0], [-2, 1, -1, 0], [-2, -1, -1, 0]];
            for (var i = 0; i < poses.length; i++) {
                var x = this.gridX + poses[i][0];
                var y = this.gridY + poses[i][1];
                var x2 = this.gridX + poses[i][2];
                var y2 = this.gridY + poses[i][3];
                if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp) && grids[y2][x2].chess == null) {
                    list.push(grids[y][x]);
                }
            }
        } else if (this.type == 3) {
            var poses = [[2, 2, 1, 1], [-2, 2, -1, 1], [2, -2, 1, -1], [-2, -2, 1, -1]];
            for (var i = 0; i < poses.length; i++) {
                var x = this.gridX + poses[i][0];
                var y = this.gridY + poses[i][1];
                if (y <= 4 != this.gridY <= 4) {
                    continue;
                }
                var x2 = this.gridX + poses[i][2];
                var y2 = this.gridY + poses[i][3];
                if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp) && grids[y2][x2].chess == null) {
                    list.push(grids[y][x]);
                }
            }
        } else if (this.type == 4) {
            var poses = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
            for (var i = 0; i < poses.length; i++) {
                var x = this.gridX + poses[i][0];
                var y = this.gridY + poses[i][1];
                if (x < 3 || x > 5 || this.gridY <= 2 && y > 2 || this.gridY >= 7 && y < 7) {
                    continue;
                }
                if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp)) {
                    list.push(grids[y][x]);
                }
            }
        } else if (this.type == 5) {
            var poses = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (var i = 0; i < poses.length; i++) {
                var x = this.gridX + poses[i][0];
                var y = this.gridY + poses[i][1];
                if (x < 3 || x > 5 || this.gridY <= 2 && y > 2 || this.gridY >= 7 && y < 7) {
                    continue;
                }
                if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp)) {
                    list.push(grids[y][x]);
                }
            }

        } else if (this.type == 6) {
            var findChess = false;
            for (var i = this.gridX + 1, len = grids[this.gridY].length; i < len; i++) {
                if (!findChess && grids[this.gridY][i].chess == null) {
                    list.push(grids[this.gridY][i]);
                    if (grids[this.gridY][i].chess) {
                        break;
                    }
                } else {
                    if (!findChess) {
                        findChess = true;
                    } else {
                        if (grids[this.gridY][i].chess) {
                            if (grids[this.gridY][i].chess.camp != this.camp) {
                                list.push(grids[this.gridY][i]);
                            }
                            break;
                        }
                    }
                }
            }
            findChess = false;
            for (var i = this.gridX - 1; i >= 0; i--) {
                if (!findChess && grids[this.gridY][i].chess == null) {
                    list.push(grids[this.gridY][i]);
                    if (grids[this.gridY][i].chess) {
                        break;
                    }
                } else {
                    if (!findChess) {
                        findChess = true;
                    } else {
                        if (grids[this.gridY][i].chess) {
                            if (findChess) {
                                if (grids[this.gridY][i].chess.camp != this.camp) {
                                    list.push(grids[this.gridY][i]);
                                }
                            }
                            break;
                        }
                    }
                }
            }
            findChess = false;
            for (var i = this.gridY + 1, len = grids.length; i < len; i++) {
                if (!findChess && grids[i][this.gridX].chess == null) {
                    list.push(grids[i][this.gridX]);
                    if (grids[i][this.gridX].chess) {
                        break;
                    }
                } else {
                    if (!findChess) {
                        findChess = true;
                    } else {
                        if (grids[i][this.gridX].chess) {
                            if (findChess) {
                                if (grids[i][this.gridX].chess.camp != this.camp) {
                                    list.push(grids[i][this.gridX]);
                                }
                            }
                            break;
                        }
                    }
                }
            }
            findChess = false;
            for (var i = this.gridY - 1; i >= 0; i--) {
                if (!findChess && grids[i][this.gridX].chess == null) {
                    list.push(grids[i][this.gridX]);
                    if (grids[i][this.gridX].chess) {
                        break;
                    }
                } else {
                    if (!findChess) {
                        findChess = true;
                    } else {
                        if (grids[i][this.gridX].chess) {
                            if (findChess) {
                                if (grids[i][this.gridX].chess.camp != this.camp) {
                                    list.push(grids[i][this.gridX]);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        } else if (this.type == 7) {
            var poses = [];
            if (this.camp == 1) {
                poses.push([0, 1]);
                if (this.gridY > 4) {
                    poses.push([-1, 0]);
                    poses.push([1, 0]);
                }
            } else {
                poses.push([0, -1]);
                if (this.gridY <= 4) {
                    poses.push([-1, 0]);
                    poses.push([1, 0]);
                }
            }
            for (var i = 0; i < poses.length; i++) {
                var x = this.gridX + poses[i][0];
                var y = this.gridY + poses[i][1];
                if (x >= 0 && x <= 8 && y >= 0 && y <= 9 && (grids[y][x].chess == null || grids[y][x].chess.camp != this.camp)) {
                    list.push(grids[y][x]);
                }
            }
        }
        return list;
    }

    get camp() {
        return this._camp;
    }

    setGrid(gridX, gridY) {
        if (this._grid) {
            this._grid.chess = null;
        }
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

    get grid() {
        return this._grid;
    }

    dispose() {
        if (this._grid) {
            this._grid.chess = null;
        }
        super.dispose();
    }
}