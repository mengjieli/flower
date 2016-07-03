/**
 * 调试信息
 */
class DebugInfo {

    /**
     * 平台对象纪录
     * @type {{}}
     */
    platformObjects;
    /**
     *
     * @type {{}}
     */
    objects = {};

    /**
     * 所有纹理纹理信息
     * @type {Array}
     */
    textures = [];

    constructor() {

    }

    addTexture(texture) {
        this.textures.push(texture);
    }

    delTexture(texture) {
        for (var i = 0; i < this.textures.length; i++) {
            if (this.textures[i] == texture) {
                this.textures.splice(i, 1);
                break;
            }
        }
    }

    static instance = new DebugInfo();

    static getInstance() {
        return DebugInfo.instance;
    }
}

exports.DebugInfo = DebugInfo;