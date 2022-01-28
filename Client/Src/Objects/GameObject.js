export class GameObject {
    constructor(id, type, x, y, radius) {
        this.id = id;
        this.type = type;
        this.x = this.nx = this.ox = x;
        this.y = this.ny = this.oy = y;
        this.radius = radius;
        this.isAlive = false;
        this.updateTime = 0;
    }

    Update(timestamp) {
        this.dt = Math.min(1, (Math.max((timestamp - this.updateTime) / 50, 0)));
        this.x = this.dt * (this.nx - this.ox) + this.ox;
        this.y = this.dt * (this.ny - this.oy) + this.oy;
    }
}