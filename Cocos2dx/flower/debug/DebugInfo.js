/**
 * 调试信息
 */
class DebugInfo {
    /**
     * 所有纹理纹理信息
     * @type {Array}
     */
    static textures = [];

    /**
     * native显示对象统计
     */
    static nativeDisplayInfo = new NativeDisplayInfo();

    /**
     * 显示对象统计
     */
    static displayInfo = new DisplayInfo();

    /**
     * 帧遍历显示对象统计
     * @param texture
     */
    static frameInfo = new FrameInfo();


    static addTexture(texture) {
        DebugInfo.textures.push(texture);
    }

    static delTexture(texture) {
        var textures = DebugInfo.textures;
        for (var i = 0; i < textures.length; i++) {
            if (textures[i] == texture) {
                textures.splice(i, 1);
                break;
            }
        }
    }
}

exports.DebugInfo = DebugInfo;