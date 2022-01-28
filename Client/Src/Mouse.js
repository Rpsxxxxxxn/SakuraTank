export class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;

        const self = this;
        document.onmousedown = function(e){
            self.MouseDown(e)
        };
        document.onmousemove = function(e) {
            self.MouseMove(e)
        };
        document.onmousedown = function(e) {
            self.MouseDown(e)
        };
    }

    MouseDown(e) {

    }

    MouseMove(e) {
        this.x = e.clientX;
        this.y = e.clientY;
        // this.position.set(e.clientX, e.clientY);
    }

    MouseDown(e) {

    }
}