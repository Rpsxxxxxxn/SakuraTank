const Writer = require("../Utility/Writer");

const ObjectType = {
    Player: 0,
    Bullet: 1,
    Food: 2,
    Zombie: 3,
}

class GameObject {
    constructor(id, type, x, y, radius, speed, node) {
        this.id = id;
        this.name = '';
        this.type = type;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.moveAngle = 0;
        this.bulletAngle = 0;
        this.hitpoint = 100;
        this.attack = 100;
        this.defense = 0;
        this.isAlive = false;
        this.experience = 0;
        this.level = 1;
        this.node = node;
        this.shootTimingSec = 1000;
        
        this.killCount = 0;
        this.lastKillPlayer = null;
    }

    Reset() {
        this.hitpoint = 100;
        this.isAlive = true;
    }

    Initialize(room) {
        room.AddQuadNode(this);
    }

    Update(room) {
        this.x = Math.min(Math.max(this.x, 0), room.fieldSize.width)
        this.y = Math.min(Math.max(this.y, 0), room.fieldSize.height)

        room.UpdateQuadNode(this);
    }

    HitBullet(room, gamemode, bullet) {
        let attack = (bullet.player.attack - this.defense);
        if (attack < 1) {
            attack = 1;
        }

        this.hitpoint -= attack;
        if (this.hitpoint <= 0 && this.isAlive) {
            this.hitpoint = 0;
            this.isAlive = false;

            bullet.player.killCount += 1;
            bullet.player.experience += this.experience;

            // プレイヤーの場合最後にしたキルを入れる
            if (this.type === ObjectType.Player || this.type === ObjectType.Zombie) {
                
                bullet.player.lastKillPlayer = this;

                // キルしたログを全体に送信
                const writer = new Writer();
                writer.setUint8(5);
                writer.setString(bullet.player.name);
                writer.setString(this.name);
                room.BroadCastPacket(writer.toBuffer());
            }

            if (this.type === ObjectType.Zombie) {
                gamemode.afterZombieCount--;
            }
        }
    }

    HitAttack(object) {
        let attack = (object.attack - this.defense);
        if (attack < 0) {
            attack = 0;
        }

        this.hitpoint -= attack;
        if (this.hitpoint <= 0 && this.isAlive) {
            this.hitpoint = 0;
            this.isAlive = false;
        }
    }

    Rigidbody(target) {
        if (!target.isAlive || !this.isAlive) {
            return;
        }

        const totalRadius = this.radius + target.radius;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        const push = Math.min((totalRadius - dist) / dist, totalRadius - dist);
        if (push / totalRadius < 0) {
            return;
        }
    
        const ms = this.GetRadiusSquared() + target.GetRadiusSquared();
        const m1 = push * (target.GetRadiusSquared() / ms);
        const m2 = push * (this.GetRadiusSquared() / ms);

        this.x -= dx * m1;
        this.y -= dy * m1;
        target.x += dx * m2;
        target.y += dy * m2;
    }

    GetRadiusSquared() {
        return Math.pow(this.radius, 2);
    }
    
	Magnitude(x, y) {
        return Math.sqrt((x * x) + (y * y));
	}
}

module.exports = {
    GameObject,
    ObjectType
};