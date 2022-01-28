const { GameObject, ObjectType } = require("../GameObject");

class BotPlayer extends GameObject {
    constructor(id, x, y, radius, speed, node) {
        super(id, ObjectType.Player, x, y, radius, speed, node);

        this.isAlive = true;

        this.viewBoxSize = {
            width: 500,
            height: 500,
        }

        this.newViewNodes = [];
        this.oldViewNodes = [];
        
        this.bulletStartTime = 0;
        this.bulletEndTime = 0;
    }
    
    Initialize(room) {
    }

    Update(room) {
    }
}

module.exports = BotPlayer;