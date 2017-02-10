class Math {

    /**
     * 将时间(ms) 转换为 00:00:00 的格式
     * @param time
     */
    static timeToHMS(time) {
        var hour = math.floor(time / (1000 * 3600));
        var minute = math.floor((time % (1000 * 3600)) / (1000 * 60));
        var second = math.floor((time % (1000 * 60)) / (1000));
        return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
    }

    /**
     * 将时间(ms) 转换为 00:00:00 的格式
     * @param time
     */
    static timeToMSM(time) {
        var minute = math.floor((time % (1000 * 3600)) / (1000 * 60));
        var second = math.floor((time % (1000 * 60)) / (1000));
        var ms = math.floor((time % 1000) / 10);
        return (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second) + ":" + (ms < 10 ? "0" + ms : ms);
    }
}

exports.Math = Math;