import { Common } from "../Utility";
import { GameObject } from "./GameObject";

export class Player extends GameObject {
    constructor(id, team, name, skin, x, y, radius, hitpoint, updateTime) {
        super(id, 0, x, y, radius);
        this.team = team;
        this.name = name;
        this.skin = null;
        this.skinInfo = { minSize: 0, offsetX: 0, offsetY: 0, }
        this.hitpoint = hitpoint;
        this.angle = 0;
        this.updateTime = updateTime;
        this.bulletCount = 1;
        
        const newSkin = new Image();
        newSkin.src = skin;

        const self = this;
        newSkin.onload = function() {
            self.skin = newSkin;
            self.skinInfo.minSize = Math.min(newSkin.width, newSkin.height);
            self.skinInfo.offsetX = (newSkin.width - self.skinInfo.minSize) / 2;
            self.skinInfo.offsetY = (newSkin.height - self.skinInfo.minSize) / 2;
        }
    }

    Update(timestamp) {
        super.Update(timestamp);
    }

    Draw(engine) {
        const ctx = engine.ctx;
        if (this.isAlive) {
            // ↓↓↓ 四角での描画処理 ↓↓↓
            const sizeW = 50;
            const sizeH = 30;
            const sizeWH = sizeW * .5;
            const sizeHH = sizeH * .5;
            let angle = this.angle;
            let bulletAngle = ((Math.PI * 2) / this.bulletCount);
            for (let i = 0; i < this.bulletCount; i++) {
                const bulletX = (this.x - sizeWH) + Math.cos(angle) * this.radius;
                const bulletY = (this.y - sizeHH) + Math.sin(angle) * this.radius;
                ctx.save();
                ctx.lineWidth = 5;
                ctx.fillStyle = "#444444";
                ctx.strokeStyle = "#aaaaaa";
                ctx.translate(bulletX + sizeWH, bulletY + sizeHH);
                ctx.rotate(this.angle);
                ctx.translate(-sizeWH, -sizeHH);
                ctx.strokeRect(0, 0, sizeW, sizeH);
                ctx.fillRect(0, 0, sizeW, sizeH);
                ctx.restore();
                angle += bulletAngle;
            }
            // ↑↑↑ 四角での描画処理 ↑↑↑

            // プレイヤーの描画
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#00ffff"
            ctx.strokeStyle = "#6677ff"
            ctx.lineWidth = 5;
            ctx.globalAlpha = 1;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            if (this.skin) {
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.clip();
                ctx.drawImage(
                    this.skin,
                    this.skinInfo.offsetX,
                    this.skinInfo.offsetY,
                    this.skinInfo.minSize,
                    this.skinInfo.minSize,
                    this.x - this.radius,
                    this.y - this.radius,
                    2 * this.radius,
                    2 * this.radius);
                ctx.restore();
            }

            if (engine.myId !== this.id) {
                const baseSize = this.radius * 2.5;
                const hpSize = (baseSize / 100) * this.hitpoint;
                ctx.strokeStyle = "#000000";
                ctx.fillStyle = "#ff3333";
                ctx.lineWidth = 1;
                ctx.fillRect(this.x - baseSize * .5, this.y - this.radius * 1.5, hpSize, 7);
                ctx.strokeRect(this.x - baseSize * .5, this.y - this.radius * 1.5, baseSize, 7);
    
                ctx.textAlign = "center";
                ctx.font = "bold 25px Ron";
                ctx.strokeStyle = "#000000";
                ctx.fillStyle = "#FFFFFF";
                ctx.lineWidth = 3;
                ctx.strokeText(this.name, this.x, this.y - this.radius * 1.7);
                ctx.fillText(this.name, this.x, this.y - this.radius * 1.7);
            }
        }
    }

    Lerp(a, b, dt) {
        return dt * (a - b) + b;
    }
}