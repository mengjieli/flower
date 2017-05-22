class Program {

    _vsh;
    _fsh;
    _program;

    constructor(vsh, fsh) {
        this._vsh = vsh;
        this._fsh = fsh;
    }

    get $nativeProgram() {
        if (!this._program) {
            this._program = new PlatformProgram("", "res/shaders/Bitmap.fsh", this._vsh, this._fsh);
        }
        return this._program;
    }

    setUniformFloat(name, val) {
        this._program.setUniformFloat(name, val);
    }
}

exports.Program = Program;