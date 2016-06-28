class PlatformProgram {

    $nativeProgrammer;
    _scale9Grid;
    __uniforms = {};

    constructor(vsh = "", fsh = "res/shaders/Bitmap.fsh") {
        if (vsh == "") {
            if (Platform.native) {
                vsh = "res/shaders/Bitmap.vsh";
            } else {
                vsh = "res/shaders/BitmapWeb.vsh";
            }
        }
        var shader;// = Programmer.shader;
        shader = new cc.GLProgram(vsh, fsh);
        shader.retain();
        if (!Platform.native) {
            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        }
        shader.link();
        shader.updateUniforms();
        if (Platform.native) {
            this.$nativeProgrammer = cc.GLProgramState.getOrCreateWithGLProgram(shader);
        } else {
            this.$nativeProgrammer = shader;
        }
        console.log("new programmer");
    }

    use() {
        if (!Platform.native) {
            this.$nativeProgrammer.use();
        }
    }

    getUniformLocationForName(name) {
        var uniforms = this.__uniforms;
        if (uniforms[name]) {
            return uniforms[name];
        }
        uniforms[name] = this.$nativeProgrammer.getUniformLocationForName(name);
        return uniforms[name];
    }

    static programmers = [];

    static create() {
        if (PlatformProgram.programmers.length) {
            return PlatformProgram.programmers.pop();
        }
        return new PlatformProgram();
    }

    static release(programmer) {
        PlatformProgram.programmers.push(programmer);
    }

    static instance;

    static getInstance() {
        if (PlatformProgram.instance == null) {
            PlatformProgram.instance = new PlatformProgram(Platform.native ? "res/shaders/Bitmap.vsh" : "res/shaders/BitmapWeb.vsh", "res/shaders/Source.fsh");
        }
        return PlatformProgram.instance;
    }
}