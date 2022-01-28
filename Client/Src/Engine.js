import { Key } from "./Key";
import { Mouse } from "./Mouse";
import { Touch } from "./Touch";
import { Common, Reader, Writer } from "./Utility";
import { Player, Bullet, Food } from "./Objects";
import { Zombie } from "./Objects/Zombie";

export class Engine {
    constructor() {
        this.ws = null;
        this.myId = -1;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.player = null;
        this.players = [];
        this.playerList = {};
        this.bullets = [];
        this.bulletList = {};

        this.level = 1;
        this.attack = 0;
        this.defense = 0;

        this.cameraX = 0;
        this.cameraY = 0;

        this.killLogs = [];
        this.objects = [];
        this.range = 1.0;
        this.zoom = 0.01;
        
        this.topText = '';

        this.roomSize = {
            width: 0,
            height: 0,
        }

        this.touch = new Touch();
        this.mouse = new Mouse();
        this.key = new Key();
        
        this.debugText = document.getElementById("debugLogs");

        this.handler = {
            0: this.UpdateObject.bind(this),
            3: this.GameMyId.bind(this),
            4: this.RoomSize.bind(this),
            5: this.KillLog.bind(this),
            10: this.ZombieLevel.bind(this),
            11: this.GameMyStatus.bind(this),
            100: this.DebugServerInfo.bind(this),
            110: this.DeadPlayer.bind(this),
        }

        this.frame = 0;
        this.startTime = 0;
        this.endTime = 0;
    }

    LoadLocalStorage() {
        const username = Common.getLocalStorage("username");
        if (username) {
            let usernameElement = document.getElementById("username");
            usernameElement.value = username;
        }
        const skinurl = Common.getLocalStorage("skinURL");
        if (skinurl) {
            let skinurlElement = document.getElementById("skinURL");
            skinurlElement.value = skinurl;
        }
    }
    
	ViewRange() {
		let ratio = Math.max(window.innerHeight / 1080, window.innerWidth / 1920);
		return ratio * this.zoom;
	}

    DeadPlayer(reader) {
        this.player = null;
        this.myId = -1;
    }

    KillLog(reader) {
        const killerName = reader.getString();
        const deathName = reader.getString();
        this.killLogs.push({
            message: `${killerName} が ${deathName} を倒した`,
            textAlpha: 1,
            startTime: Date.now(),
            hideTime: 5000,
        });
    }

    UpdateObject(reader) {
        let id, type, x, y, radius, hitpoint, object, updateId, deleteId, bulletIndex, name, skin, experience;
        const updateTime = Date.now();

        const addViewCount = reader.getUint16();
        for (let i = 0; i < addViewCount; i++) {
            id = reader.getUint32();
            type = reader.getUint8();
            x = reader.getFloat();
            y = reader.getFloat();
            radius = reader.getUint16();
            hitpoint = reader.getUint8();

            if (type === 0) {
                name = reader.getString();
                skin = reader.getString();
                experience = reader.getUint32();
            }

            switch (type) {
                case 0:
                    object = new Player(id, '', name, skin, x, y, radius, hitpoint, updateTime);
                    break;
                case 1:
                    object = new Bullet(id, x, y, radius, hitpoint);
                    break;
                case 2:
                    object = new Food(id, x, y, radius, hitpoint);
                    break;
                case 3:
                    object = new Zombie(id, x, y, radius, hitpoint);
                    break;
            }

            this.objects.push(object);
        }
        
        const date = Date.now();
        const updateViewCount = reader.getUint16();
        for (let i = 0; i < updateViewCount; i++) {
            updateId = reader.getUint32();
            object = this.objects.find(element => element.id == updateId);
            if (object) {
                object.Update(date);
                object.ox = object.x;
                object.oy = object.y;
                object.type = reader.getUint8();
                object.nx = reader.getFloat();
                object.ny = reader.getFloat();
                object.radius = reader.getUint16();
                object.hitpoint = reader.getUint8();
                let oldAlive = object.isAlive;
                object.isAlive = reader.getUint8();
                if (object.isAlive !== oldAlive) {
                    object.ox = object.nx;
                    object.oy = object.ny;
                }
                if (object.type === 0) {
                    object.angle = reader.getFloat();
                    object.experience = reader.getUint32();
                    object.bulletCount = reader.getUint8();
                }
                object.updateTime = Date.now();
            }
        }
        
        const deleteViewCount = reader.getUint16();
        for (let i = 0; i < deleteViewCount; i++) {
            deleteId = reader.getUint32();
            bulletIndex = this.objects.findIndex(element => element.id == deleteId);
            this.objects.splice(bulletIndex, 1);
        }

        this.EmitMoveAngle();
        this.EmitBulletAngle();
    }

    DetectAction(reader) {
        const type = reader.getUint8();
        const x = reader.getFloat();
        const y = reader.getFloat();
    }

    GameMyId(reader) {
        const id = reader.getUint32();
        this.myId = id;
        console.log("GameMyId: %s", id);
    }

    GameMyStatus(reader) {
        this.level = reader.getUint16();
        this.attack = reader.getUint16();
        this.defense = reader.getUint16();
    }

    DebugServerInfo(reader) {
        this.Fps = reader.getUint8();
        this.PlayerCount = reader.getUint8();
        this.BulletCount = reader.getUint16();
        this.GameStep = reader.getUint8();
        // this.debugText.innerText = `ServerFPS: ${Fps} \n PlayerCount: ${PlayerCount} \n GameStep: ${GameStep}`;
    }

    ZombieLevel(reader) {
        const level = reader.getUint8();
        this.topText = `StageLevel ${level}`;
    }

    RoomSize(reader) {
        this.roomSize.width = reader.getUint32();
        this.roomSize.height = reader.getUint32();
        console.log("RoomSize: %s, %s", this.roomSize.width, this.roomSize.height);
    }

    MainLoop() {
        // フレーム計測
        this.frame++;
        this.endTime = this.updateTime = Date.now();
        // 一秒経過
        if (this.endTime - this.startTime >= 1000) {
            // this.debugText.innerText = `ServerFPS: ${this.Fps} \n PlayerCount: ${this.PlayerCount} \n BulletCount: ${this.BulletCount} \n GameStep: ${this.GameStep} \n ClientFPS: ${this.frame} \n GameCount: ${this.objects.length}`
            this.frame = 0;
            this.startTime = Date.now();
        }

        // this.updateTime = Date.now();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.key.Update();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


        this.ctx.save();

        if (this.player) {
            const calcRange = this.ViewRange();

            this.cameraX = (20 * this.cameraX + this.player.x) / 21;
            this.cameraY = (20 * this.cameraY + this.player.y) / 21;

            this.ctx.save();
            // 背景のラインを引く ↓↓↓ ここから ↓↓↓
            this.ctx.strokeStyle = "#000000";
            this.ctx.globalAlpha = .1;
            this.ctx.scale(this.range + calcRange, this.range + calcRange);

            const a = this.canvas.width;
            const b = this.canvas.height;
            for (let c = -.5 + (-this.cameraX + a * .5) % 50; c < a; c += 50) {
                this.ctx.moveTo(c, 0);
                this.ctx.lineTo(c, b);
            }
            this.ctx.stroke();
            this.ctx.beginPath();
            for (let c = -.5 + (-this.cameraY + a * .5) % 50; c < b; c += 50) {
                this.ctx.moveTo(0, c);
                this.ctx.lineTo(a, c);
            }
            this.ctx.stroke()
            this.ctx.restore()
            // ↑↑↑ ここまで ↑↑↑

            // カメラの処理
            this.ctx.translate(this.canvas.width * .5, this.canvas.height * .5);
            this.ctx.scale(this.range + calcRange, this.range + calcRange);
            this.ctx.translate(-this.cameraX, -this.cameraY);

            // ルームの壁を描画
            this.ctx.save();
            this.ctx.lineWidth = 30;
            this.ctx.strokeStyle = "yellow";
            this.ctx.strokeRect(0, 0, this.roomSize.width, this.roomSize.height);
            this.ctx.restore();

            this.objects.sort((a, b) => { return a.radius - b.radius; });

            const date = Date.now();
            this.objects.forEach((object) => {
                object.Update(date);
                object.Draw(this);
            })

            if (this.key.getKeyDown(32)) {
                this.WsSend(new Uint8Array([4]))
            }
        } else if(this.myId > -1 && !this.player) {
            if (this.objects.length > 0) {
                this.player = this.objects.find(element => element.id === this.myId);
                console.log("GetPlayerInfo: %s", this.player ? "YES" : "NO");
            }
        }

        this.ctx.restore();
        
        // 自身のプレイヤー情報を描画
        if (this.player) {
            this.ctx.save();

            // 体力ゲージ
            const baseWidthSize = Common.GetWindowHalfWidth();
            const baseHalfSize = baseWidthSize * .5;
            const baseHeight = 30;
            const hpSize = (baseWidthSize / 100) * this.player.hitpoint;
            this.ctx.strokeStyle = "#000000";
            this.ctx.fillStyle = "#33ff33";
            this.ctx.lineWidth = 1;
            this.ctx.fillRect(baseWidthSize - baseHalfSize, Common.GetWindowHeight() - baseHeight * 3, hpSize, baseHeight);
            this.ctx.strokeRect(baseWidthSize - baseHalfSize, Common.GetWindowHeight() - baseHeight * 3, baseWidthSize, baseHeight);
            
            // 経験値ゲージ
            const expSize = (baseWidthSize / 100) * this.player.experience;
            this.ctx.strokeStyle = "#000000";
            this.ctx.fillStyle = "#333Fff";
            this.ctx.lineWidth = 1;
            this.ctx.fillRect(baseWidthSize - baseHalfSize, Common.GetWindowHeight() - baseHeight * 1.8, expSize, baseHeight);
            this.ctx.strokeRect(baseWidthSize - baseHalfSize, Common.GetWindowHeight() - baseHeight * 1.8, baseWidthSize, baseHeight);
    
            // 名前
            this.ctx.textAlign = "center";
            this.ctx.font = "bold 25px Ron";
            this.ctx.strokeStyle = "#000000";
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(this.player.name, baseWidthSize, Common.GetWindowHeight() - baseHeight * 3.5);
            this.ctx.fillText(this.player.name, baseWidthSize, Common.GetWindowHeight() - baseHeight * 3.5);

            this.ctx.restore();
        }
        
        const baseWidthSize = Common.GetWindowHalfWidth();
        // ゾンビステージレベル文字
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 30px Ron";
        this.ctx.strokeStyle = "#000000";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(this.topText, baseWidthSize, 30);
        this.ctx.fillText(this.topText, baseWidthSize, 30);
        
        this.ctx.textAlign = "left";
        this.ctx.strokeText(`PlayerLevel ${this.level}`, 0, 30);
        this.ctx.fillText(`PlayerLevel ${this.level}`, 0, 30);
        this.ctx.textAlign = "left";
        this.ctx.strokeText(`Attack ${this.attack}`, 0, 60);
        this.ctx.fillText(`Attack ${this.attack}`, 0, 60);
        this.ctx.textAlign = "left";
        this.ctx.strokeText(`Defense ${this.defense}`, 0, 90);
        this.ctx.fillText(`Defense ${this.defense}`, 0, 90);
        
        for (let i = 0; i < this.killLogs.length; i++) {
            let height = (i + 1) * 30;
            this.ctx.save();
            this.ctx.textAlign = "left";
            this.ctx.font = "bold 25px Ron";
            this.ctx.globalAlpha = this.killLogs[i].textAlpha;
            this.ctx.strokeText(`${this.killLogs[i].message}`, 0, Common.GetWindowHeight() - height);
            this.ctx.fillText(`${this.killLogs[i].message}`, 0, Common.GetWindowHeight() - height);
            this.ctx.restore();
            const timeleft = Date.now() - this.killLogs[i].startTime;
            if (timeleft > this.killLogs[i].hideTime) {
                this.killLogs.splice(i, 1);
            }
        }
        // this.ctx.strokeText(this.topText, baseWidthSize, 30);
        // this.ctx.fillText(this.topText, baseWidthSize, 30);
        
        // this.ctx.strokeText(this.topText, baseWidthSize, 30);
        // this.ctx.fillText(this.topText, baseWidthSize, 30);
        
        // this.ctx.strokeText(this.topText, baseWidthSize, 30);
        // this.ctx.fillText(this.topText, baseWidthSize, 30);

        this.touch.Draw(this.ctx);

        requestAnimationFrame(this.MainLoop.bind(this));
    }

    ConnectServer() {
        this.ws = new WebSocket("ws://localhost:2000");
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.WsOpen.bind(this);
        this.ws.onmessage = this.WsMessage.bind(this);
        this.ws.onclose = this.WsClose.bind(this);
        this.ws.onerror = this.WsError.bind(this);
        console.log("ConnectTo: %s BinaryType: %s", "ws://localhost:2000", this.ws.binaryType)
    }
    
    WsSend(packet) {
        if (!this.ws) {
            return;
        }
        if (this.ws.readyState != 1){
             return;
        }
        if (packet.build) {
            this.ws.send(packet.build());
        } else {
            this.ws.send(packet.buffer);
        }
    }

    WsOpen() {
        console.log("socket open");
        // this.WsSend(new Uint8Array([1]))
    }

    WsClose() {
        console.log("socket close");
    }

    WsError() {
        console.log("socket error");
    }

    WsMessage(msg) {
        const reader = new Reader(new DataView(msg.data), 0, true);
        const type = reader.getUint8();
        if (this.handler[type]) {
            this.handler[type](reader);
        }
    }

    EmitMoveAngle() {
        let isPress = false;
        let x = 0;
        let y = 0;
        if (this.key.getKeyDown(87)) {
            isPress = true;
            y -= 1;
        }
        if (this.key.getKeyDown(65)) {
            isPress = true;
            x -= 1;
        }
        if (this.key.getKeyDown(83)) {
            isPress = true;
            y += 1;
        }
        if (this.key.getKeyDown(68)) {
            isPress = true;
            x += 1;
        }
        if (isPress) {
            const writer = new Writer(true);
            writer.setUint8(2);
            writer.setFloat32(Math.atan2(y, x));
            this.WsSend(writer);
        }
    }

    EmitBulletAngle() {
        const x = this.mouse.x - (this.canvas.width / 2);
        const y = this.mouse.y - (this.canvas.height / 2);
        
        const writer = new Writer(true);
        writer.setUint8(3);
        writer.setFloat32(Math.atan2(y, x));
        this.WsSend(writer);
    }

    EmitJoinPlayer() {
        let username, skinurl;
        let usernameElement = document.getElementById('username');
        let skinurlElement = document.getElementById('skinURL');
        username = usernameElement.value;
        skinurl = skinurlElement.value;
        if (usernameElement.value.length > 20) {
            username = usernameElement.value.substring(0, 20);
        }

        const writer = new Writer(true);
        writer.setUint8(1);
        writer.setString(username);
        writer.setString(skinurl);
        this.WsSend(writer);

        Common.setLocalStorage("username", username);
        Common.setLocalStorage("skinURL", skinurl);
    }

    EmitSpectate() {
        this.WsSend(new Uint8Array([4]))
    }

    CreateAction() {
        const self = this;
        const joinGame = document.getElementById('join');
        if (joinGame) {
            joinGame.onclick = function() {
                self.EmitJoinPlayer();
                console.log("GamePlay");
                
                const overlays = document.getElementById('overlays');
                overlays.style.display ="none";
            }
        }
        const Spectate = document.getElementById('spec');
        if (Spectate) {
            Spectate.onclick = function() {
                self.EmitSpectate();
                console.log("Spectate");
            }
        }
    }

    GetUpdateTime() {
        return this.updateTime;
    }
}