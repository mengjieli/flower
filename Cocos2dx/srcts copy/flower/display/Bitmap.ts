module flower {
    export class Bitmap extends flower.DisplayObject {

        public static bitmapProperty:any = System.Bitmap;

        private _texture:flower.Texture2D;
        private _scale9Grid:flower.Rectangle;
        private _program:Programmer;
        private _shaderFlag:number = 0;

        public constructor(texture:flower.Texture2D = null) {
            super();
            this._show = System.getNativeShow("Bitmap");
            this.texture = texture;
            this._nativeClass = "Bitmap";
        }

        public $addShaderFlag(pos:number) {
            this._shaderFlag |= pos;
        }

        public $removeShaderFlag(pos:number) {
            this._shaderFlag &= ~pos;
        }

        public $getShaderFlag(pos:number):boolean {
            return this._shaderFlag & pos ? true : false;
        }

        public _setTexture(val:flower.Texture2D) {
            if (this._texture) {
                this._texture.$delCount();
            }
            this._texture = val;
            var p:any = flower.Bitmap.bitmapProperty.texture;
            if (val) {
                if (this._width || this._height) {
                    this.scaleX *= this._width / this.texture.width;
                    this.scaleY *= this._height / this.texture.height;
                }
                this._width = this._texture.width;
                this._height = this._texture.height;
                this._texture.$addCount();
                p.exe(this._show, this._texture.$nativeTexture, this._texture.source, this._texture.sourceRotation);
                if (System.IDE == IDE.COCOS2DX) {
                    this._show.setAnchorPoint(0, 1);
                }
                this._setX(this.x);
                this._setY(this.y);
                this.$addFlag(DisplayObjectFlag.BITMAP_SHADER_CHANGE);
                this.$addShaderFlag(ShaderFlag.TEXTURE_CHANGE);
                if(this._scale9Grid) {
                    this.$addShaderFlag(ShaderFlag.SCALE_9_GRID);
                }
            }
            else {
                this._width = 0;
                this._height = 0;
                p.exe(this._show, flower.Texture2D.blank.$nativeTexture);
            }
            this.$propagateFlagsUp(10);
        }

        public _getMouseTarget(matrix:flower.Matrix, mutiply:boolean):flower.DisplayObject {
            matrix.save();
            if (this._texture) {
                matrix.translate(-this._texture.offX, -this._texture.offY);
            }
            var target = super._getMouseTarget(matrix, mutiply);
            matrix.restore();
            return target;
        }

        public _setX(val:number, offX:number = 0) {
            super._setX(val, this._texture ? this._texture.offX : 0);
        }

        public _setY(val:number, offY:number = 0) {
            super._setY(val, this._texture ? this._texture.offY : 0);
        }

        public _setWidth(val:number) {
            if (this._texture) {
                this.scaleX = val / this._texture.width;
            } else {
                this._width = val;
            }
        }

        public _setHeight(val:number) {
            if (this._texture) {
                this.scaleY = val / this._height;
            } else {
                this._height = val;
            }
        }

        public _setScale9Grid(val:flower.Rectangle) {
            var scale9 = this._scale9Grid;
            this._scale9Grid = val;
            this.$addFlag(DisplayObjectFlag.BITMAP_SHADER_CHANGE);
            if (this._scale9Grid) {
                this.$addShaderFlag(ShaderFlag.SCALE_9_GRID);
            } else {
                this.$removeShaderFlag(ShaderFlag.SCALE_9_GRID);
            }
        }

        public $onFrameEnd() {
            if (this._texture && this.$getFlag(DisplayObjectFlag.BITMAP_SHADER_CHANGE)) {
                if (this._shaderFlag  <= 1 && this._program && this._program != Programmer.instance) {
                    this._program = Programmer.instance;
                } else if (this._shaderFlag > 1 && (!this._program || this._program == Programmer.instance)) {
                    this._program = ProgrammerManager.getInstance().createProgrammer();
                }
                if (this._program && this.$getShaderFlag(ShaderFlag.TEXTURE_CHANGE)) {
                    this._show.setGLProgramState(this._program.nativeProgrammer);
                }
                this.$removeShaderFlag(ShaderFlag.TEXTURE_CHANGE);
                if (this._shaderFlag) {
                    this._program.setShaderFlag(this._shaderFlag);
                    if (this.$getShaderFlag(ShaderFlag.SCALE_9_GRID)) {
                        this._program.setScale9GridUniforms(this._texture.width, this._texture.height, this._scale9Grid, this.scaleX * this._width, this.scaleY * this._height);
                        this.$removeShaderFlag(ShaderFlag.SCALE_9_GRID);
                    }
                }
                this.$removeFlag(DisplayObjectFlag.BITMAP_SHADER_CHANGE);
            }
        }

        public set texture(val:flower.Texture2D) {
            if (val == this._texture) {
                return;
            }
            this._setTexture(val);
        }

        public get texture():flower.Texture2D {
            return this._texture;
        }

        public get scale9Grid():flower.Rectangle {
            return this._scale9Grid;
        }

        public set scale9Grid(val:flower.Rectangle) {
            if (this._scale9Grid == val) {
                return;
            }
            this._setScale9Grid(val);
        }

        public dispose() {
            if(this._program && this._program != Programmer.instance) {
                this._show.setGLProgramState(Programmer.instance.nativeProgrammer);
            }
            var show:any = this._show;
            super.dispose();
            this.texture = null;
            System.cycleNativeShow("Bitmap", show);
        }
    }
}