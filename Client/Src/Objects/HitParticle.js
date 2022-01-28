import { GameObject } from "./GameObject";

export class HitParticle extends GameObject {
    constructor(id, x, y, radius) {
        super(id, 3, x, y, radius);
        
        this.particles = [];
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
            })
        }
    }

    Update() {

    }

    Draw(engine) {
        for (let i = 0; i < this.particles.length; i++) {
            const pos = this.particles[i];
            ctx.fillRect(pos.x, pos.y, 40, 40);
        }
    }
}