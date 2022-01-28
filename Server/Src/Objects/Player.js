const { GameObject, ObjectType } = require("./GameObject");
const Writer = require("../Utility/Writer");
const Common = require("../Utility/Common");

class Player extends GameObject {
    constructor(server, ws, id, x, y, radius, speed, node) {
        super(id, ObjectType.Player, x, y, radius, speed, node)
        this.server = server;
        this.room = null;
        this.ws = ws;
        this.team = 0;
        this.name = 'うんこ';
        this.skin = 'https://i.imgur.com/h8BNkQZ.png';

        this.isWaitingRoom = false;
        this.isConnection = false;
        this.isAlive = false;
        this.bulletCount = 1;
        this.shootTimingSec = 1000;

        this.viewBoxSize = {
            width: 500,
            height: 500,
        }

        this.newViewNodes = [];
        this.oldViewNodes = [];

        this.receiveAction = {
            0: this.PlayerInfo.bind(this),
            1: this.JoinWaitingRoom.bind(this),
            2: this.MoveController.bind(this),
            3: this.BulletController.bind(this),
            4: this.BulletAction.bind(this)
        }
        
        this.bulletStartTime = 0;
        this.bulletEndTime = 0;
    }

    Initialize(room) {
        super.Initialize(room);
    }

    Update(room) {
        const viewBox = {
            x: this.x - this.viewBoxSize.width,
            y: this.y - this.viewBoxSize.height,
            width: this.viewBoxSize.width * 2,
            height: this.viewBoxSize.height * 2
        }

        // ルームに参加している
        if (this.room) {
            const newView = this.room.ViewColliding(viewBox);
            this.newViewNodes = [];
            newView.forEach(data => {
                this.newViewNodes.push(data.object);
            })
            
            // 一旦ソートを挟む
            this.newViewNodes.sort((a, b) => { return a.id - b.id });
            
            let groupNodes = this.newViewNodes.concat(this.oldViewNodes);
            let addView = [], deleteView = [], updateView = []; 
            groupNodes.forEach(element => {
                // 追加されたオブジェクトを追加する
                if (this.newViewNodes.includes(element) && !this.oldViewNodes.includes(element)) {
                    addView.push(element);
                } 
                // 削除されたオブジェクトを追加する
                else if (!this.newViewNodes.includes(element) && this.oldViewNodes.includes(element)) {
                    deleteView.push(element);
                } 
                // 更新されたオブジェクトを追加する
                else {
                    updateView.push(element);
                }
            });
    
            this.oldViewNodes = this.newViewNodes;
    
            // プレイヤー情報を送信する
            // this.EmitUpdatePlayers();
            // プレイヤー側の表示されているオブジェクトの更新
            this.EmitUpdate(addView, updateView, deleteView);
        }

        if (this.experience >= 100) {
            const getLevel = ~~(this.experience / 100);

            // ステータス振り分け
            for (let i = 0; i < getLevel; i++) {
                switch (this.level % 2) {
                    case 0:
                        this.shootTimingSec -= 50;
                        break;
                    case 1:
                        this.speed += 0.5;
                        break;
                }
                if (this.level % 10 === 0) {
                    this.bulletCount++;
                }
                this.defense += 10;
                this.attack += 10;

                this.shootTimingSec = Common.Clamp(this.shootTimingSec, 1000, 100);
                this.speed = Common.Clamp(this.speed, 15, 0);
                this.bulletCount = Common.Clamp(this.bulletCount, 3, 1);
                this.level++;
            }
            this.experience = 0;
            this.EmitMyStatus();
        }

        super.Update(room);
    }

    Destroy() {

    }

    Handler(reader) {
        const type = reader.getUint8();
        this.receiveAction[type](reader);
    }

    PlayerInfo(reader) {
    }

    JoinWaitingRoom(reader) {
        this.name = reader.getString();
        this.skin = reader.getString();
        // this.server.JoinWaitingRoom(this);
        // デバッグ専用
        this.server.DebugRoom(this);
    }

    MoveController(reader) {
        this.moveAngle = reader.getFloat();
        this.x += Math.cos(this.moveAngle) * this.speed;
        this.y += Math.sin(this.moveAngle) * this.speed;
    }

    BulletController(reader) {
        this.bulletAngle = reader.getFloat();
    }

    BulletAction() {
        this.bulletEndTime = Date.now();
        if (this.room && ((this.bulletEndTime - this.bulletStartTime) >= this.shootTimingSec)) {
            // バレットを発射する
            // this.room.ShootBulletAction(this);

            let angle = this.bulletAngle;
            let bulletAngle = (Math.PI * 2) / this.bulletCount;
            for (let i = 0; i < this.bulletCount; i++) {
                angle += bulletAngle;
                let x = this.x + Math.cos(angle) * this.radius;
                let y = this.y + Math.sin(angle) * this.radius;
                this.room.ShootBulletActionCustom(this, x, y, 10, this.speed + 10, this.bulletAngle);
                // バレット発射時の反動
                this.x -= Math.cos(angle) * this.speed;
                this.y -= Math.sin(angle) * this.speed;
            }
            // バレットの間隔を初期
            this.bulletStartTime = Date.now();

        }
    }

    SetRoom(room) {
        this.room = room;
    }

    EmitUpdate(addView, updateView, deleteView) {
        const writer = new Writer();
        writer.setUint8(0);

        // ADD
        writer.setUint16(addView.length);
        addView.forEach((object) => {
            writer.setUint32(object.id);
            writer.setUint8(object.type);
            writer.setFloat(object.x);
            writer.setFloat(object.y);
            writer.setUint16(object.radius >>> 0);
            writer.setUint8(object.hitpoint >>> 0);
            if (object.type === 0) {
                writer.setString(object.name);
                writer.setString(object.skin);
                writer.setUint32(object.experience);
            }
        })
        
        // UPDATE
        writer.setUint16(updateView.length);
        updateView.forEach((object) => {
            writer.setUint32(object.id);
            writer.setUint8(object.type);
            writer.setFloat(object.x);
            writer.setFloat(object.y);
            writer.setUint16(object.radius >>> 0);
            writer.setUint8(object.hitpoint >>> 0);
            writer.setUint8(object.isAlive >>> 0);
            if (object.type === 0) {
                writer.setFloat(object.bulletAngle);
                writer.setUint32(object.experience);
                writer.setUint8(object.bulletCount);
            }
        })
        
        // DELETE
        writer.setUint16(deleteView.length);
        deleteView.forEach((object) => {
            writer.setUint32(object.id);
        })

        this.Send(writer.toBuffer());
    }

    EmitDetectAction() {
        const writer = new Writer();
        writer.setUint8(1);
        writer.setFloat(object.x);
        writer.setFloat(object.y);
        this.Send(writer.toBuffer());
    }

    EmitMyId() {
        const writer = new Writer();
        writer.setUint8(3);
        writer.setUint32(this.id);
        this.Send(writer.toBuffer());
    }

    EmitMyStatus() {
        const writer = new Writer();
        writer.setUint8(11);
        writer.setUint16(this.level);
        writer.setUint16(this.attack);
        writer.setUint16(this.defense);
        this.Send(writer.toBuffer());
    }

    EmitRoomSize(x, y) {
        const writer = new Writer();
        writer.setUint8(4);
        writer.setUint32(x);
        writer.setUint32(y);
        this.Send(writer.toBuffer());
    }

    EmitResetPlayer() {
        const writer = new Writer();
        writer.setUint8(110);
        this.Send(writer.toBuffer());
    }
    
    Send(packet) {
        if (!this.ws) {
            return;
        }

        if (this.isConnection) {
            this.ws.send(packet, {
                binary: true
            });
        }
    }
}

module.exports = Player;