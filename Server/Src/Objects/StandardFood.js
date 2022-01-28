const { GameObject, ObjectType } = require("./GameObject");

class StandardFood extends GameObject {
    constructor(id, x, y, radius, speed) {
        super(id, ObjectType.Food, x, y, radius, speed, null);
        this.isAlive = true;
        this.experience = 50;
    }

    Initialize() {

    }

    Update(room) {
        super.Update(room);
    }

    Destroy() {

    }
}

module.exports = StandardFood;