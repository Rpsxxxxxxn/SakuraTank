import { GameObject } from "./GameObject";

export class Zombie extends GameObject {
    constructor(id, x, y, radius, hitpoint) {
        super(id, 3, x, y, radius);
        this.hitpoint = hitpoint;
        this.isAlive = false;
        this.bulletAngle = 0;
    }
    
    Update(timestamp) {
        super.Update(timestamp);
    }

    Draw(engine) {
        const ctx = engine.ctx;

        if (this.isAlive) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#ff7777"
            ctx.strokeStyle = "#aaaaaa"
            ctx.lineWidth = 5;
            ctx.globalAlpha = 1;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
    
            if (this.hitpoint < 100) {
                const baseSize = this.radius * 2.5;
                const hpSize = (baseSize / 100) * this.hitpoint;
                ctx.fillStyle = "#ff3333";
                ctx.fillRect(this.x - baseSize * .5, this.y - this.radius * 1.5, hpSize, 5);
            }
        }
    }
}