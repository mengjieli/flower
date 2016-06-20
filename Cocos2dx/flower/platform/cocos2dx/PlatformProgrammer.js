class PlatformProgrammer {

    $nativeProgrammer;
    _scale9Grid;

    constructor(vsh = "", fsh = "res/shaders/Bitmap.fsh") {
        if(vsh == "") {
            if(Platform.native) {
                vsh = "res/shaders/Bitmap.vsh";
            } else {
                vsh = "res/shaders/BitmapWeb.vsh";
            }
        }
        var shader;// = Programmer.shader;
        shader = new cc.GLProgram(vsh, fsh);
        shader.retain();
        if(!Platform.native) {
            shader.addAttribute("a_position", 0);
            shader.addAttribute("a_texCoord", 1);
            shader.addAttribute("a_color", 2);
        }
        shader.link();
        shader.updateUniforms();
        if (Platform.native) {
            this.$nativeProgrammer = cc.GLProgramState.getOrCreateWithGLProgram(shader);
        } else {
            this.$nativeProgrammer = shader;
        }
    }

    set shaderFlag(type) {
        if (Platform.native) {
            this.$nativeProgrammer.setUniformInt("scale9", type & PlatformShaderType.SCALE_9_GRID);
        } else {
            this.$nativeProgrammer.setUniformLocationI32(this.$nativeProgrammer.getUniformLocationForName("scale9"), type & PlatformShaderType.SCALE_9_GRID);
        }
    }

    static programmers = [];

    static createProgrammer() {
        if (PlatformProgrammer.programmers.length) {
            return PlatformProgrammer.programmers.pop();
        }
        return new PlatformProgrammer();
    }

    static releaseProgrammer(programmer) {
        PlatformProgrammer.programmers.push(programmer);
    }

    static instance;

    static getInstance() {
        if (PlatformProgrammer.instance == null) {
            PlatformProgrammer.instance = new PlatformProgrammer(Platform.native?"res/shaders/Bitmap.vsh":"res/shaders/BitmapWeb.vsh", "res/shaders/Source.fsh");
        }
        return PlatformProgrammer.instance;
    }
}