const StandardFood = require("../Objects/StandardFood");
const { Gamemode } = require("./Gamemode");

class FreeForAll extends Gamemode {
    constructor() {
        super();
    }

    Initialize(room) {
        // 通常の餌を追加
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
            // バレットの更新を行う
            room.bullets.forEach((bullet) => {
                bullet.Update(room);
                // 4分岐の更新
                room.UpdateQuadNode(bullet);
            })
    
            // プレイヤーの更新を行う
            room.players.forEach((player) => {
                if (player.isAlive) {
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
                        if (target.type === 1) {
                            if (target.player.id !== player.id) {
                                const dx = player.x - target.x;
                                const dy = player.y - target.y;
                                const dist = Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
                                if (dist <= (target.radius + player.radius)) {
                                    player.HitBullet(room, this, target);
                                    room.RemoveQuadNode(target);
                                }
                            }
                        } else if (target.type === 2 || target.type === 0) {
                            player.Rigidbody(target);
                        }
                    })
                }
            });
    
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
                }
            })
        // ゲームステップが結果発表の場合
        } else if (room.gameStep === 3) {
    
        }
    }
}

module.exports = FreeForAll;