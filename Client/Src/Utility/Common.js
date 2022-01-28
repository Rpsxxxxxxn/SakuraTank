export class Common {
    static GetWindowWidth() {
        return window.innerWidth;
    }

    static GetWindowHeight() {
        return window.innerHeight;
    }

    static GetWindowHalfWidth() {
        return window.innerWidth * .5;
    }

    static GetWindowHalfHeight() {
        return window.innerHeight * .5;
    }

    static LerpAngle(time, value1, value2) {
        if (value1 > (Math.PI * 2.0)) {
            value1 -= Math.PI * 2.0;
            value2 = value1;
        } else if (value1 < -(Math.PI * 2.0)) {
            value1 += Math.PI * 2.0;
            value2 = value1;
        }

        return this.Lerp(time, value1, value2)
    }

    static Lerp(time, value1, value2) {
        return time * (value1 - value2) + value2;
    }
    
    static setLocalStorage(key, value) {
        if ("string" == typeof value) {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    static getLocalStorage(storageKey) {
        return localStorage.getItem(storageKey);
    };

    static removeLocalStorage(storageKey) {
        return localStorage.removeItem(storageKey);
    }
}