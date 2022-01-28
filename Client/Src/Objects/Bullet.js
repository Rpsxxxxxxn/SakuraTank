import { GameObject } from "./GameObject";

export class Bullet extends GameObject {
    constructor(id, x, y, radius) {
        super(id, 1, x, y, radius);
    }

    Update(timestamp) {
        super.Update(timestamp);
    }

    Draw(engine) {
        const ctx = engine.ctx;
        
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#aaaaaa"
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}