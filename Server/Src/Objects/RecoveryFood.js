const { GameObject, ObjectType } = require("./GameObject");

class RecoveryFood extends GameObject {
    constructor(id, x, y, radius, speed) {
        super(id, ObjectType.Food, x, y, radius, speed, null);
        this.isAlive = true;
        this.experience = 100;
    }

    Initialize() {

    }

    Update(room) {
        super.Update(room);
    }

    Destroy() {

    }
}

module.exports = RecoveryFood;