const Quadtree = require("quadtree-lib");
const { FreeForAll, ZombieBattle } = require("./Gamemodes");
const { GamemodeType } = require("./Gamemodes/Gamemode");
const Bullet = require("./Objects/Bullet");
const Writer = require("./Utility/Writer");

const Waiting = 0;
const Countdown = 1;
const Gaming = 2;
const Result = 3;

class Room {
    constructor(server) {
        this.server = server;

        this.fieldSize = {
            width: 2000,
            height: 2000,
        }
        
        this.quadTree = new Quadtree({
            width: this.fieldSize.width,
            height: this.fieldSize.height,
            maxElements: 8,
        });

        this.countdown = 10;
        this.gametimer = 600;
        this.players = [];
        this.expFoods = [];
        this.bullets = [];
        this.zombies = [];

        this.gameStep = Gaming;
        this.gamemode = null;

        this.startTime = 0;
        this.endTime = 0;
        this.frame = 0;
    }

    /**
     * 初期化処理
     */
    Initialize() {

    }

    /**
     * 破棄処理
     */
    Destroy() {
        this.quadTree = null;
        this.players = [];
        this.expFoods = [];
        this.bullets = [];
        this.gameStep = Waiting;
    }

    /**
     * 更新処理
     */
    Update() {
        // フレーム計測
        this.frame++;
        this.endTime = Date.now();
        // 一秒経過
        if (this.endTime - this.startTime >= 1000) {
            this.DebugServerInfo();
            this.frame = 0;
            this.startTime = Date.now();

        }

        if (this.gamemode) {
            this.gamemode.Update(this);
        }
    }

    /**
     * ゲームステップを上げる
     * @returns 
     */
    NextGameStep() {
        if (this.gameStep > Result) {
            this.gameStep = Waiting;
        }
        return this.gameStep;
    }

    /**
     * 視野に入っているオブジェクトを抽出
     * @param {*} viewBox 
     * @returns 
     */
    ViewColliding(viewBox) {
        return this.quadTree.colliding(viewBox);
    }

    /**
     * バレットの発射
     * @param {*} player 
     */
    ShootBulletAction(player) {
        const object = new Bullet(
            this.server.GetNewId(),
            player,
            player.x + Math.cos(player.bulletAngle) * player.radius,
            player.y + Math.sin(player.bulletAngle) * player.radius,
            10,
            player.speed + 10,
            player.bulletAngle,
            null);

        this.AddQuadNode(object);
    }
    
    /**
     * バレットの発射
     * @param {*} player 
     */
     ShootBulletActionCustom(player, x, y, radius, speed, bulletAngle) {
        const object = new Bullet(
            this.server.GetNewId(),
            player,
            x,
            y,
            radius,
            speed,
            bulletAngle,
            null);

        this.AddQuadNode(object);
    }

    /**
     * プレイヤーの参加
     * @param {*} player 
     */
    JoinPlayer(joinPlayer) {
        this.players.push(joinPlayer);
        joinPlayer.x = Math.random() * this.fieldSize.width;
        joinPlayer.y = Math.random() * this.fieldSize.height;
        joinPlayer.isAlive = true;
        this.AddQuadNode(joinPlayer);

        joinPlayer.Send(this.gamemode.GetZombieLevelPacket());
    }

    LeavePlayer(player) {
        this.players.splice(this.players.indexOf(player), 1);
        this.RemoveQuadNode(player);
    }
    
    /**
     * 4分岐のオブジェクトを追加する
     * @param {*} gameobject 
     */
    AddQuadNode(gameobject) {
        const radius = gameobject.radius;
        let node = { 
            x: gameobject.x - radius,
            y: gameobject.y - radius,
            width: radius * 2,
            height: radius * 2,
            object: gameobject
        }
        gameobject.node = node;
        this.quadTree.push(node);

        // タイプによって追加する配列を変更
        switch (gameobject.type) {
            case 1:
                this.bullets.push(gameobject);
                break;
            case 2:
                this.expFoods.push(gameobject);
                break;
            case 3:
                this.zombies.push(gameobject);
                break;
        }
    }

    /**
     * 4分岐のオブジェクトを更新する
     * @param {*} gameobject 
     */
    UpdateQuadNode(gameobject) {
        let node = gameobject.node;
        if (node.x == (gameobject.x - gameobject.radius) &&
            node.y == (gameobject.y - gameobject.radius) &&
            node.width == gameobject.radius * 2 &&
            node.height == gameobject.radius * 2) {
            return;
        }
        // remove
        this.quadTree.remove(node);

        const radius = gameobject.radius;
        // new
        node = { 
            x: gameobject.x - radius,
            y: gameobject.y - radius,
            width: radius * 2,
            height: radius * 2,
            object: gameobject
        }
        gameobject.node = node;
        this.quadTree.push(node);
    }

    /**
     * 4分岐のオブジェクトを削除する
     * @param {*} gameobject 
     */
    RemoveQuadNode(gameobject) {
        let node = gameobject.node;
        let isRemoved = this.quadTree.remove(node);
        if (isRemoved) {
            switch (gameobject.type) {
                case 1:
                    this.bullets.splice(this.bullets.indexOf(gameobject), 1);
                    break;
                case 2:
                    this.expFoods.splice(this.expFoods.indexOf(gameobject), 1);
                    break;
                case 3:
                    this.zombies.splice(this.zombies.indexOf(gameobject), 1);
                    break;
            }
        }
    }

    /**
     * ブロードキャストパケット
     * @param {*} packet 
     */
    BroadCastPacket(packet) {
        this.players.forEach((player) => {
            player.Send(packet);
        })
    }

    /**
     * サーバ情報の送信
     */
    DebugServerInfo() {
        const writer = new Writer();
        // 送信タイプ
        writer.setUint8(100);
        // ServerFps
        writer.setUint8(this.frame);
        // PlayerCount
        writer.setUint8(this.players.length);
        // GameobjectCount
        writer.setUint16(this.bullets.length);
        // GameStep
        writer.setUint8(this.gameStep);

        this.BroadCastPacket(writer.buffer);
    }

    /**
     * ゲームモードの設定
     * @param {*} gamemode 
     * @returns 
     */
    SetGamemode(gamemode) {
        if (this.gamemode) {
            return;
        }

        switch (gamemode) {
            case GamemodeType.FreeForAll:
                this.gamemode = new FreeForAll();
                break;
            case GamemodeType.ZombieBattle:
                this.gamemode = new ZombieBattle();
                break;
        }

        // 初期化処理
        this.gamemode.Initialize(this);
    }
}

module.exports = Room;