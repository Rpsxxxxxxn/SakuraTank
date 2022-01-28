const WebSocket = require('ws');
const Logger = require("pino")();
const Room = require('./Room');
const Settings = require('./Settings');

const Reader = require("./Utility/Reader");
const Player = require("./Objects/Player");
const { GamemodeType } = require('./Gamemodes/Gamemode');

class Server {
    constructor() {
        this.settings = new Settings();
        this.rooms = [];
        this.players = [];
        this.objectIds = 0;
        this.waitingPlayers = [];
        this.ws = null;

        // デバッグルームを作成
        // 多分実際には、待機中のルームにする
        this.debugRoom = new Room(this);
        this.debugRoom.SetGamemode(GamemodeType.ZombieBattle);
    }

    /**
     * 設定の読み込み
     */
    CreateSettings() {
        // ini情報を読み込み
        this.settings.LoadSettingsInI();
    }

    /**
     * ソケットの初期設定
     */
    CreateWebsocket() {
        // ソケットの初期設定
        const wsOptions = {
            port: 2000,
            perMessageDeflate: false,
            maxPayload: 4096
        };
        // Websocketを作成する
        this.ws = new WebSocket.Server(wsOptions);
        // プレイヤーコネクションをバインド
        this.ws.on("connection", this.PlayerConnection.bind(this));
        // プレイヤーエラーをバインド
        this.ws.on("error", this.PlayerConnectionError.bind(this));

        Logger.info('Start Server');
    }
    
    /**
     * メインループ処理
     */
    MainLoop() {
        // デバッグの処理
        if (this.debugRoom) {
            this.debugRoom.Update(this);
        }

        // ルーム処理
        this.rooms.forEach((room) => {
            room.Update(this);
        });
        setTimeout(this.MainLoop.bind(this), 33);
    }


    /**
     * プレイヤーがソケット接続を試みた場合
     */
    PlayerConnection(ws) {
        // プレイヤー情報を作成
        ws.player = new Player(this, ws, this.GetNewId(), 0, 0, 48, 4, null);
        // プレイヤーを接続済みにする
        ws.player.isConnection = true;
        
        // クライアント側から送信されたメッセージを受信
        ws.on("message", (msg) => {
            this.PlayerSocketMessage(msg, ws);
        });
        // クライアント側のソケットが閉じられた時に呼び出される
        ws.on("close", (event) => {
            this.PlayerSocketClose(event, ws);
        })
    }

    /**
     * プレイヤーに何らかのエラーがある場合
     */
    PlayerConnectionError() {
        Logger.info(PlayerConnectionError.name);
    }

    /**
     * プレイヤーからメッセージが届いたとき
     * @param {*} msg 
     * @param {*} ws 
     * @returns 
     */
    PlayerSocketMessage(msg, ws) {
        // メッセージが最大データ量を超えた場合、落とす
        if (msg.length > 2048) {
            return;
        }
        ws.player.Handler(new Reader(Buffer.from(msg)));
    }

    /**
     * ソケットが閉じられた時
     * @param {*} event 
     * @param {*} ws 
     */
    PlayerSocketClose(event, ws) {
        // コネクションを無効にする
        ws.player.isConnection = false;

        if (ws.player.room) {
            ws.player.room.LeavePlayer(ws.player);
        }
        // 待機中のプレイヤーは外す
        if (ws.player.isWaitingRoom) {
            this.waitingPlayers.splice(
                this.waitingPlayers.indexOf(ws.player), 1);
        }
        // プレイヤーオブジェクトを消す
        if (ws.player) {
            ws.player = null;
        }
    }

    /**
     * 待機中にする
     * @param {*} player 
     */
    JoinWaitingRoom(player) {
        // プレイヤーを待機中にする
        player.isWaitingRoom = true;
        // 待機列に追加
        this.waitingPlayers.push(player);
        // 待機厨にする
        this.StartGameWithWaitingPlayers();
    }

    /**
     * 待機中のプレイヤーをぶち込む
     */
    StartGameWithWaitingPlayers() {
        if (this.waitingPlayers.length >= 2) {
            let room = this.CreateRoom();

            // ルームが既に作成されていて、最大作成数を上回る場合
            if (room === null) {
                // 作成されているルームのゲームステップが０の場合
                room = this.rooms.find(room => room.gameStep === 0);
                // ルームが存在する
                if (room) {
                    this.waitingPlayers.forEach((player) => {
                        player.isWaitingRoom = false;
                        player.SetRoom(room);
                        room.JoinPlayer(player);
                    })
                    // 待機中のプレイヤーを空にする
                    this.waitingPlayers = [];
                }
            } else {
                // 新規作成
                this.waitingPlayers.forEach((player) => {
                    player.isWaitingRoom = false;
                    player.SetRoom(room);
                    room.JoinPlayer(player);
                })
                // 待機中のプレイヤーを空にする
                this.waitingPlayers = [];
            }
        } else {
            setTimeout(
                this.StartGameWithWaitingPlayers.bind(this),
                2000);
        }
    }

    /**
     * 開発者用ルーム
     */
    DebugRoom(player) {
        // デバッグ専用ルーム
        player.SetRoom(this.debugRoom);
        // デバッグルームに参加
        this.debugRoom.JoinPlayer(player);
        // 自身のIDを送信
        player.EmitMyId();
        player.EmitMyStatus();

        // ルームのサイズを送信
        player.EmitRoomSize(
            this.debugRoom.fieldSize.width,
            this.debugRoom.fieldSize.height)
    }

    /**
     * プレイヤーIDの新規作成
     * @returns 新しい番号
     */
    GetNewId() {
        if (this.objectIds > 2147483646) {
            this.objectIds = 0;
        }
        return this.objectIds++;
    }

    /**
     * ルームの作成
     * @returns ルームが既に存在する場合NULL、その他は新規作成のオブジェクト
     */
    CreateRoom() {
        if (this.rooms.length < 2) {
            const room = new Room();
            this.rooms.push(room);
            return room;
        }
        return null;
    }
}

module.exports = Server;