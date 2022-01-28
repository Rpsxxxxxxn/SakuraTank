const { GameObject, ObjectType } = require("./GameObject");

class Bullet extends GameObject {
    constructor(id, player, x, y, radius, speed, angle, node) {
        super(id, ObjectType.Bullet, x, y, radius, speed, node);
        this.player = player;
        this.moveAngle = angle;
    }

    Initialize(room) {

    }

    Update(room) {
        // フィールドから出た場合削除
        if (this.x >= room.fieldSize.width ||
            this.y >= room.fieldSize.height ||
            this.x <= 0 ||
            this.y <= 0) {
            room.RemoveQuadNode(this);
        } else {
            this.x += Math.cos(this.moveAngle) * this.speed;
            this.y += Math.sin(this.moveAngle) * this.speed;
            room.UpdateQuadNode(this);
        }
    }
}

module.exports = Bullet;