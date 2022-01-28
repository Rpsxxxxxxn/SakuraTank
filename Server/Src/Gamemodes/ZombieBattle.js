const Zombie = require("../Objects/AI/Zombie");
const { Gamemode } = require("./Gamemode");
const { ObjectType } = require("../Objects/GameObject");
const { StandardFood } = require("../Objects");
const Writer = require("../Utility/Writer");
const Debu = require("../Objects/AI/Debu");

class ZombieBattle extends Gamemode {
    constructor() {
        super();

        this.zombieLevel = 1;
        this.maxSpawn = 60;
        this.afterZombieCount = 0;
    }

    Initialize(room) {
        // 初期ゾンビを投入
        let zombie = new Zombie(
            room.server.GetNewId(),
            Math.random() * room.fieldSize.width,
            Math.random() * room.fieldSize.height,
            32,
            2,
            null);
        room.AddQuadNode(zombie);
        
        for (let i = 0; i < 15; i++) {
            let food = new StandardFood(
                room.server.GetNewId(),
                Math.random() * room.fieldSize.width,
                Math.random() * room.fieldSize.height,
                30,
                2);
            room.AddQuadNode(food);
        }
    }

    Update(room) {
        // ゲームステップが待機中の場合
        if (room.gameStep === 0) {

        // ゲームステップがカウントダウンの場合
        } else if (room.gameStep === 1) {
            
        // ゲームステップがゲーム中の場合
        } else if (room.gameStep === 2) {
            let isEndGame = true;
            // プレイヤーの更新を行う
            room.players.forEach((player) => {
                if (player.isAlive) {
                    isEndGame = false;
                    player.Update(room);

                    const collider = {
                        x: player.x - player.radius,
                        y: player.y - player.radius,
                        width: player.radius * 2,
                        height: player.radius * 2
                    }
                    // バレットとプレイヤーの当たり判定
                    const detectList = room.ViewColliding(collider);
                    detectList.forEach((element) => {
                        const target = element.object;
                        if (target.type === ObjectType.Food || target.type === ObjectType.Player) {
                            player.Rigidbody(target);
                        }
                    })
                }
            });
            
            // バレットの更新を行う
            room.bullets.forEach((bullet) => {
                bullet.Update(room);
                // 4分岐の更新
                room.UpdateQuadNode(bullet);
            })
            
            // ゾンビの更新を行う
            let isNoneZombie = true;
            room.zombies.forEach((zombie) => {
                if (zombie.isAlive) {
                    isNoneZombie = false;
                    zombie.Update(room);
    
                    // 当たり判定の作成
                    const collider = {
                        x: zombie.x - zombie.radius,
                        y: zombie.y - zombie.radius,
                        width: zombie.radius * 2,
                        height: zombie.radius * 2
                    }
                    // バレットとゾンビの当たり判定
                    const detectList = room.ViewColliding(collider);
                    detectList.forEach((element) => {
                        const target = element.object;
                        // 
                        if (target.type === ObjectType.Bullet) {
                            if (target.player.id !== zombie.id) {
                                const dx = zombie.x - target.x;
                                const dy = zombie.y - target.y;
                                const dist = Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
                                if (dist <= (target.radius + zombie.radius)) {
                                    zombie.HitBullet(room, this, target);
                                    room.RemoveQuadNode(target);
                                }
                            }
                        } else if (target.type === ObjectType.Player || target.type === ObjectType.Zombie || target.type === ObjectType.Food) {
                            zombie.Rigidbody(target);
                        }
                    })
                }
            })

            room.expFoods.forEach((food) => {
                if (food.isAlive) {
                    food.Update(room);
    
                    const collider = {
                        x: food.x - food.radius,
                        y: food.y - food.radius,
                        width: food.radius * 2,
                        height: food.radius * 2
                    }
                    // バレットとプレイヤーの当たり判定
                    const detectList = room.ViewColliding(collider);
                    detectList.forEach((element) => {
                        const target = element.object;
                        if (target.type === 1) {
                            const dx = food.x - target.x;
                            const dy = food.y - target.y;
                            const dist = Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
                            if (dist <= (target.radius + food.radius)) {
                                food.HitBullet(room, this, target);
                                room.RemoveQuadNode(target);
                            }
                        }
                    })
                } else {
                    food.hitpoint = 100;
                    food.x = Math.random() * room.fieldSize.width;
                    food.y = Math.random() * room.fieldSize.height;
                    food.isAlive = true;
                    room.UpdateQuadNode(food);
                }
            })

            // ゾンビが消滅したら？
            if (isNoneZombie) {
                this.zombieLevel++;
                this.afterZombieCount = this.zombieLevel;
                if (room.zombies.length < this.maxSpawn) {
                    let zombie = new Zombie(
                        room.server.GetNewId(),
                        Math.random() * room.fieldSize.width,
                        Math.random() * room.fieldSize.height,
                        33,
                        2,
                        null);
                    room.AddQuadNode(zombie);

                    let debu = new Debu(
                        room.server.GetNewId(),
                        Math.random() * room.fieldSize.width,
                        Math.random() * room.fieldSize.height,
                        60,
                        2,
                        null);
                    room.AddQuadNode(debu);

                }
                
                room.zombies.forEach((zombie) => {
                    if (!zombie.isAlive) {
                        zombie.x = Math.random() * room.fieldSize.width,
                        zombie.y = Math.random() * room.fieldSize.height,
                        // zombie.experience = this.zombieLevel * 5;
                        zombie.experience = 10;
                        zombie.defense += (this.zombieLevel * 2);
                        zombie.Reset();
                    }
                });

                room.BroadCastPacket(this.GetZombieLevelPacket());
            }
            
            // ゲームを終了するかどうか
            // if (isEndGame && room.players.length > 0) {
            //     room.gameStep++;
            // }
        // ゲームステップが結果発表の場合
        } else if (room.gameStep === 3) {
    
        }
    }

    GetZombieLevelPacket() {
        let writer = new Writer();
        writer.setUint8(10);
        writer.setUint8(this.zombieLevel);
        return writer.toBuffer();
    }
}

module.exports = ZombieBattle;