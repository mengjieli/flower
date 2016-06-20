class PlatformProgrammer {

    _nativeProgrammer;
    _scale9Grid;

    constructor(vsh = "res/shaders/Bitmap.vsh", fsh = "res/shaders/Bitmap.fsh") {
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

    set shaderFlag(type) {
        this._nativeProgrammer.setUniformInt("scale9", type & PlatformShaderType.SCALE_9_GRID);
    }

    get nativeProgrammer() {
        return this._nativeProgrammer;
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
            PlatformProgrammer.instance = new PlatformProgrammer("res/shaders/Bitmap.vsh", "res/shaders/Source.fsh");
        }
        return PlatformProgrammer.instance;
    }
}