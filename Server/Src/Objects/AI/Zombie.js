const Common = require("../../Utility/Common");
const { GameObject, ObjectType } = require("../GameObject");

class Zombie extends GameObject {
    constructor(id, x, y, radius, speed, node) {
        super(id, ObjectType.Zombie, x, y, radius, speed, node);

        this.name = 'Zombie';
        this.isAlive = true;
        this.targetPlayer = null;
        this.targetX = 0;
        this.targetY = 0;
        this.angle = 0;
        this.dirX = 0;
        this.dirY = 0;
        this.turnSpeed = 20;

        this.attack = 5;
        this.attackTime = 0;
        this.shootTimingSec = 1000;
        
        this.viewBoxSize = {
            width: 1000,
            height: 1000,
        }
    }

    Initialize(room) {
    }

    Update(room) {
        if (!this.isAlive) {
            return;
        }

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
            
            // 攻撃を行う = 1秒の間
            if ((Date.now() - this.attackTime) >= this.shootTimingSec) {
                let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
                // 当たり判定をとる
                if (dist <= (this.radius + this.targetPlayer.radius)) {
                    this.attackTime = Date.now();
                    this.targetPlayer.HitAttack(this);
                }
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

module.exports = Zombie;