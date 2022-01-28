export class Key {
    constructor() {
        this.oldkey = new Array(256);
        this.newkey = new Array(256);

        const self = this;
        document.onkeydown = function(e){
            self.KeyDown(e)
        };
        document.onkeyup = function(e) {
            self.KeyUp(e)
        };
    }

    Update() {
        for (let i = 0; i < 256; i++) {
            this.oldkey[i] = this.newkey[i];
        }
    }

    /**
     * キーの押し込み
     * @param {*} event 
     */
    KeyDown(event) {
        for (let i = 0; i < 256; i++) {
            if (event.keyCode == i) {
                this.newkey[i] = true;
            }
        }
    }

    /**
     * キーの押上
     * @param {*} event 
     */
    KeyUp(event) {
        for (let i = 0; i < 256; i++) {
            if (event.keyCode == i) {
                this.newkey[i] = false;
            }
        }
    }

    /**
     * キーの取得
     * @param {*} keyCode 
     */
    getKeyDown(keyCode) {
        return this.newkey[keyCode];
    }

    /**
     * キーの取得
     * @param {*} keyCode 
     */
    getKeyUp(keyCode) {
        return !this.newkey[keyCode] && this.oldkey[keyCode];
    }

    /**
     * キーの取得
     * @param {*} keyCode 
     */
    getKeyPressed(keyCode) {
        return this.newkey[keyCode] && !this.oldkey[keyCode];
    }
}