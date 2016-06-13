module flower {
    export class Programmer {

        protected _nativeProgrammer:any;

        public constructor(vsh:string = "res/shaders/Bitmap.vsh", fsh:string = "res/shaders/Bitmap.fsh") {
            var shader;// = Programmer.shader;
            if (fsh != "res/shaders/Bitmap.fsh") {
                shader = new cc.GLProgram(vsh, fsh);
                shader.retain();
                shader.link();
                shader.updateUniforms();
            }
            if (!shader) {
                //shader = Programmer.shader = new cc.GLProgram(vsh, fsh);
                shader = new cc.GLProgram(vsh, fsh);
                shader.retain();
                shader.link();
                shader.updateUniforms();
            }
            this._nativeProgrammer = cc.GLProgramState.getOrCreateWithGLProgram(shader);
        }

        public setShaderFlag(type:number) {
            this._nativeProgrammer.setUniformInt("scale9", type & ShaderFlag.SCALE_9_GRID);
        }

        public setScale9GridUniforms(width:number, height:number, scale9Grid:flower.Rectangle, setWidth:number, setHeight:number) {
            var scaleX = setWidth / width;
            var scaleY = setHeight / height;
            var left = scale9Grid.x / width;
            var top = scale9Grid.y / height;
            var right = (scale9Grid.x + scale9Grid.width) / width;
            var bottom = (scale9Grid.y + scale9Grid.height) / height;
            var tleft = left / scaleX;
            var ttop = top / scaleY;
            var tright = 1.0 - (1.0 - right) / scaleX;
            var tbottom = 1.0 - (1.0 - top) / scaleY;
            var scaleGapX = (right - left) / (tright - tleft);
            var scaleGapY = (bottom - top) / (tbottom - ttop);
            var programmer = this._nativeProgrammer;
            programmer.setUniformFloat("left", left);
            programmer.setUniformFloat("top", top);
            programmer.setUniformFloat("tleft", tleft);
            programmer.setUniformFloat("ttop", ttop);
            programmer.setUniformFloat("tright", tright);
            programmer.setUniformFloat("tbottom", tbottom);
            programmer.setUniformFloat("scaleGapX", scaleGapX);
            programmer.setUniformFloat("scaleGapY", scaleGapY);
            programmer.setUniformFloat("scaleX", scaleX);
            programmer.setUniformFloat("scaleY", scaleY);
        }

        public get nativeProgrammer():any {
            return this._nativeProgrammer;
        }

        //private static shader:any;

        public static instance:Programmer = new Programmer("res/shaders/Bitmap.vsh", "res/shaders/Source.fsh");
    }
}