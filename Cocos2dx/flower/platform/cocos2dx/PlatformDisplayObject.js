class PlatformDisplayObject {

    show;
    __x = 0;
    __y = 0;
    __scaleX = 1;
    __scaleY = 1;
    __rotation = 0;
    __programmer = null;

    /**
     * 0x0001 scale9Grid
     * 0x0002 filters
     * @type {number}
     * @private
     */
    __programmerFlag = 0;

    constructor() {
    }

    setX(val) {
        this.__x = val;
        this.show.setPositionX(val);
    }

    setY(val) {
        this.__y = val;
        this.show.setPositionY(val);
    }

    setScaleX(val) {
        this.__scaleX = val;
        this.show.setScaleX(val);
    }

    setScaleY(val) {
        this.__scaleY = val;
        this.show.setScaleY(val);
    }

    setRotation(val) {
        this.__rotation = val;
        this.show.setRotation(val);
    }

    setAlpha(val) {
        this.show.setOpacity(val * 255);
    }

    addProgrammerFlag(flag) {
        this.__programmerFlag |= flag;
        this.programmerFlagChange(this.__programmerFlag);
    }

    removeProgrammerFlag(flag) {
        this.__programmerFlag &= ~flag;
        this.programmerFlagChange(this.__programmerFlag);
    }

    programmerFlagChange(flag) {
        if (flag) {
            if (!this.__programmer) {
                this.__programmer = PlatformProgrammer.createProgrammer();
                if (Platform.native) {
                    this.show.setGLProgramState(this.__programmer.$nativeProgrammer);
                } else {
                    this.show.setShaderProgram(this.__programmer.$nativeProgrammer);
                }
            }
        } else {
            if (this.__programmer) {
                this.__programmer = null;
                if (Platform.native) {
                    this.show.setGLProgramState(PlatformProgrammer.getInstance().$nativeProgrammer);
                } else {
                    this.show.setShaderProgram(PlatformProgrammer.getInstance().$nativeProgrammer);
                }
            }
        }
    }

    release() {
        var show = this.show;
        show.setPosition(0, 0);
        show.setScale(1);
        show.setOpacity(255);
        show.setRotation(0);
        show.setVisible(true);
        this.__x = 0;
        this.__y = 0;
        this.__scaleX = 1;
        this.__scaleY = 1;
        this.__rotation = 0;
        this.__programmer = null;
        this.__programmerFlag = 0;
        if (this.__programmer) {
            PlatformProgrammer.release(this.__programmer);
            if (Platform.native) {
                this.show.setGLProgramState(PlatformProgrammer.getInstance());
            } else {
                this.show.setShaderProgram(PlatformProgrammer.getInstance());
            }
        }
    }

    setFilters(filters) {
        var types1 = [0, 0, 0, 0];
        var types2 = [0, 0, 0, 0];
        if (filters && filters.length) {
            this.addProgrammerFlag(0x0002);
            var nativeProgrammer = this.__programmer.$nativeProgrammer;
            if (!Platform.native) {
                this.__programmer.use();
            }
            var paramsIndex = 0;
            for (var i = 0; i < filters.length; i++) {
                if (i < 4) {
                    types1[i] = filters[i].type;
                } else {
                    types2[i - 4] = filters[i].type;
                }
                var params = filters[i].params;
                if (params.length <= 4) {
                    if (Platform.native) {
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params));
                    } else {
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params));
                    }
                    paramsIndex++;
                } else {
                    if (Platform.native) {
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params.slice(0, 4)));
                        paramsIndex++;
                        nativeProgrammer.setUniformVec4("filtersParams" + paramsIndex, cc.math.vec4.apply(null, params.slice(4, params.length)));
                        paramsIndex++;
                    } else {
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params.slice(0, 4)));
                        paramsIndex++;
                        nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filtersParams" + paramsIndex)].concat(params.slice(4, params.length)));
                        paramsIndex++;
                    }
                }
            }
        } else {
            this.removeProgrammerFlag(0x0002);
        }
        if (this.__programmer) {
            var nativeProgrammer = this.__programmer.$nativeProgrammer;
            if (Platform.native) {
                nativeProgrammer.setUniformVec4("filters1", cc.math.vec4.apply(null, types1));
                nativeProgrammer.setUniformVec4("filters2", cc.math.vec4.apply(null, types2));
            } else {
                this.__programmer.use();
                nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filters1")].concat(types1));
                nativeProgrammer.setUniformLocationWith4f.apply(nativeProgrammer, [nativeProgrammer.getUniformLocationForName("filters2")].concat(types2));
            }
        }
    }
}