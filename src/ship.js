import { player, message } from "./game";

class Ship {
    constructor(name, length, start, orientation) {
        this.name = name;
        this.length = length;
        this.start = start;
        this.orientation = orientation;
        this.occupied = this.cover();
        this.hits = 0;
        this.sunk = false;
    }
    // The cover() function calculates the positions a ship occupies depending on its orientation.
    cover() {
        let positions = [];
        if (this.orientation === "Horizontal") {
            let row = this.start[0];
            let i = this.start[1] + (this.length - 1);
            while (i >= this.start[1]) {
                positions.unshift([row, i]);
                i--;
            }
        }
        else {
            let col = this.start[1];
            let i = this.start[0] + (this.length - 1);
            while (i >= this.start[0]) {
                positions.unshift([i, col]);
                i--;
            }
        }
        return positions;
    }

    hit() {
        this.hits++;
        this.isSunk();
    }
    // The success message changes depending on which fleet the ship belongs to.
    isSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
            if (player.board.fleet.includes(this)) message.textContent = `Ỳour ${this.name} has sunk!`;
            else message.textContent = `The computer's ${this.name} has sunk!`;
            
        }
    }
}

export default Ship;