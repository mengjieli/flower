class Math {

    constructor() {

    }

    /**
     * 获取点到线段的垂足
     * @param point
     * @param segment
     */
    static getSegmentFootPoint(point, segment) {
        var vec1 = new Vector(point.x - segment.point1.x, point.y - segment.point1.y);
        var vec2 = new Vector(segment.point2.x - segment.point1.x, segment.point2.y - segment.point1.y);
        var vec3 = vec2.getUnitVector();
        vec3.length = vec1.dotProduct(vec2) / vec2.length;
        var vec4 = vec3.remove(vec1);
        return point.clone().addVector(vec4);
    }
}

exports.getSegmentFootPoint = Math.getSegmentFootPoint;