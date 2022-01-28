class Common {
    static Clamp(value, max, min) {
        return Math.max(Math.min(value, max), min);
    }

    static LerpAngle(time, value1, value2) {
        if (Math.abs(value1 - value2) >= Math.PI) {
            if (value1 > value2) {
                value1 = Math.PI * 2.0;
            } else {
                value2 = Math.PI * 2.0;
            }
        }
        return this.Lerp(time, value1, value2)
    }

    static Lerp(time, value1, value2) {
        return time * (value1 - value2) + value2;
    }

    static Dot(x1, y1, x2, y2) {
        return (x1 * x2) + (y1 * y2);
    }

    static Cross(x1, y1, x2, y2) {
        return (x1 * y2) - (y1 * x2);
    }
    
    static ToRadian(value) {
		return (value) * (Math.PI / 180.0);
    }
}

module.exports = Common;