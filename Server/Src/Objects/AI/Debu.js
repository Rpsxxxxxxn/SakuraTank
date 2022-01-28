const Common = require("../../Utility/Common");
const { GameObject, ObjectType } = require("../GameObject");

class Debu extends GameObject {
    constructor(id, x, y, radius, speed, node) {
        super(id, ObjectType.Zombie, x, y, radius, speed, node);

        this.name = 'Debu';
        this.isAlive = true;
        this.targetPlayer = null;
        this.targetX = 0;
        this.targetY = 0;
        this.angle = 0;
        this.dirX = 0;
        this.dirY = 0;
        this.turnSpeed = 5;

        this.bulletCount = 1;
        this.experience = 300;
        this.attackTime = 0;
        this.shootTimingSec = 2000;
        this.defense = 80;
        
        this.viewBoxSize = {
            width: 600,
            height: 600,
        }
        this.bulletStartTime = 0;
        this.bulletEndTime = 0;
    }

    Update(room) {
        const viewBox = {
            x: this.x - this.viewBoxSize.width,
            y: this.y - this.viewBoxSize.height,
            width: this.viewBoxSize.width * 2,
            height: this.viewBoxSize.height * 2
        }
        // 視野に映っているオブジェクトを全て出力
        const newView = room.ViewColliding(viewBox);
        const viewNodes = [];
        newView.forEach(data => {
            viewNodes.push(data.object);
        })
        // プレイヤーが存在する場合
        this.targetPlayer = viewNodes.find((element) => { return element.type === ObjectType.Player});

        let dx, dy;
        if (this.targetPlayer) {
            dx = this.targetPlayer.x - this.x;
            dy = this.targetPlayer.y - this.y;
            this.bulletAngle = Math.atan2(dy, dx);
            
            // 攻撃を行う
            if ((Date.now() - this.attackTime) >= this.shootTimingSec) {
                let angle = this.bulletAngle;
                let bulletAngle = (Math.PI * 4) / this.bulletCount;
                for (let i = 0; i < this.bulletCount; i++) {
                    angle += bulletAngle;
                    let x = this.x + Math.cos(angle) * this.radius;
                    let y = this.y + Math.sin(angle) * this.radius;
                    
                    room.ShootBulletActionCustom(this, x, y, 10, this.speed + 10, angle);
                    // バレット発射時の反動
                    this.x -= Math.cos(angle) * this.speed;
                    this.y -= Math.sin(angle) * this.speed;
                }
                this.attackTime = Date.now();
            }
        } else {
            dx = room.fieldSize.width * .5 - this.x;
            dy = room.fieldSize.height * .5 - this.y;
        }

        let magnitude = this.Magnitude(dx, dy);
        dx /= magnitude;
        dy /= magnitude;

        const dot = Common.Dot(dx, dy, this.dirX, this.dirY);
        if (dot < 0.98) {
            const cross = Common.Cross(dx, dy, this.dirX, this.dirY);
            if (cross >= Common.ToRadian(this.turnSpeed)) {
                this.angle -= Common.ToRadian(this.turnSpeed);
            }
            
            if (cross <= Common.ToRadian(-this.turnSpeed)) {
                this.angle += Common.ToRadian(this.turnSpeed);
            }
            this.dirX = Math.cos(this.angle);
            this.dirY = Math.sin(this.angle);
        }
            
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        super.Update(room);
    }
}

module.exports = Debu;