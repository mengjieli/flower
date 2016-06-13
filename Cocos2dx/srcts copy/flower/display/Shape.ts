module flower {
    export class Shape extends flower.DisplayObject {

        public static shapeProperty:any;

        private _fillColor:number = 0xffffff;
        private _fillAlpha:number = 1;
        private _lineWidth:number = 0;
        private _lineColor:number = 0x000000;
        private _lineAlpha:number = 1;
        private _minX:number;
        private _minY:number;
        private _maxX:number;
        private _maxY:number;
        private _record = [];

        public constructor() {
            super();
            this._show = System.getNativeShow("Shape");
            this._nativeClass = "Shape";
        }

        protected _setFillColor(val:number) {
            this._fillColor = val;
        }

        public get fillColor():number {
            return this._fillColor;
        }

        public set fillColor(val:number) {
            val = +val || 0;
            if (val == this._fillColor) {
                return;
            }
            this._setFillColor(val);
        }

        public get fillAlpha():number {
            return this._fillAlpha;
        }

        public set fillAlpha(val:number) {
            val = +val || 0;
            if (val < 0) {
                val = 0;
            }
            if (val > 1) {
                val = 1;
            }
            if (val == this._fillAlpha) {
                return;
            }
            this._fillAlpha = val;
        }

        public get lineWidth():number {
            return this._lineWidth;
        }

        public set lineWidth(val:number) {
            val = +val || 0;
            if (val == this._lineWidth) {
                return;
            }
            this._lineWidth = val;
        }

        public get lineColor():number {
            return this._lineColor;
        }

        public set lineColor(val:number) {
            val = +val || 0;
            if (val == this._lineColor) {
                return;
            }
            this._lineColor = val;
        }

        public get lineAlpha():number {
            return this._lineAlpha;
        }

        public set lineAlpha(val:number) {
            val = +val || 0;
            if (val < 0) {
                val = 0;
            }
            if (val > 1) {
                val = 1;
            }
            if (val == this._lineAlpha) {
                return;
            }
            this._lineAlpha = val;
        }

        public drawRect(x:number, y:number, width:number, height:number) {
            this.drawPolygn([
                {x: x, y: y},
                {x: x + width, y: y},
                {x: x + width, y: y + height},
                {x: x, y: y + height},
                {x: x, y: y}]);
        }

        public _alphaChange() {
            if (!this._record.length) {
                return;
            }
            this.$addFlag(0x100);
        }

        public $onFrameEnd() {
            if(this.$getFlag(0x100)) {
                var record = this._record;
                var fillColor = this._fillColor;
                var fillAlpha = this._fillAlpha;
                var lineWidth = this._lineWidth;
                var lineColor = this._lineColor;
                var lineAlpha = this._lineAlpha;
                this.clear();
                for (var i = 0; i < record.length; i++) {
                    var item = record[i];
                    this._fillColor = item.fillColor;
                    this._fillAlpha = item.fillAlpha;
                    this._lineWidth = item.lineWidth;
                    this._lineColor = item.lineColor;
                    this._lineAlpha = item.lineAlpha;
                    this.drawPolygn(item.points);
                }
                this._fillColor = fillColor;
                this._fillAlpha = fillAlpha;
                this._lineWidth = lineWidth;
                this._lineColor = lineColor;
                this._lineAlpha = lineAlpha;
                this.$removeFlag(0x100);
            }
        }

        public drawPolygn(points) {
            for (var i = 0; i < points.length; i++) {
                if (this._minX == null) {
                    this._minX = points[i].x;
                    this._maxX = points[i].x;
                    this._minY = points[i].y;
                    this._maxY = points[i].y;
                    continue;
                }
                if (points[i].x < this._minX) {
                    this._minX = points[i].x;
                }
                if (points[i].x > this._maxX) {
                    this._maxX = points[i].x;
                }
                if (points[i].y < this._minY) {
                    this._minY = points[i].y;
                }
                if (points[i].y > this._maxY) {
                    this._maxY = points[i].y;
                }
            }
            this._width = this._maxX - this._minX;
            this._height = this._maxY - this._minY;
            var p = flower.Shape.shapeProperty;
            this._record.push(
                {
                    points: points,
                    fillColor: this._fillColor,
                    fillAlpha: this._fillAlpha,
                    lineWidth: this._lineWidth,
                    lineColor: this._lineColor,
                    lineAlpha: this._lineAlpha
                }
            );
            p.draw(this._show, points, this._fillColor, this._fillAlpha * this._alpha * this._parentAlpha, this._lineWidth, this._lineColor, this._lineAlpha * this._alpha * this._parentAlpha);
        }

        public clear():void {
            var p = flower.Shape.shapeProperty;
            p.clear(this._show);
            this._minX = null;
            this._maxX = null;
            this._minY = null;
            this._maxY = null;
            this._width = 0;
            this._height = 0;
            this._record = [];
        }

        public dispose():void {
            this.clear();
            var show:any = this._show;
            super.dispose();
            System.cycleNativeShow("Shape", show);
        }
    }
}


flower.Shape.shapeProperty = System.Shape;
