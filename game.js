class Ship {
    constructor(length, start, end) {
        this.length = length;
        this.start = start;
        this.end = end;
        // this.orientation ???
        this.occupied = this.cover();
        this.hits = 0;
        this.sunk = false;
    }

    cover() {
        let positions = [];
        if (this.start[0] === this.end[0]) {
            let row = this.start[0];
            let i = this.end[1];
            while (i >= this.start[1]) {
                positions.unshift([row, i]);
                i--;
            }
        }
        else {
            let col = this.start[1];
            let i = this.end[0];
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

    isSunk() {
        if (this.hits === this.length) this.sunk = true;
    }
}

// Gameboard conventions: 0 represents unoccupied and untouched water. S represents a square
// occupied by a ship. H represents a hit - part of a ship that was successfully struck. Finally,
// M is a miss - a patch of empty water that was struck by the enemy.

class Gameboard {
    constructor() {
        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.fleet = [];
        this.sinkCount = 0;
        this.gameOver = false;
    }

    placeShip(length, start, end) {
        let ship = new Ship(length, start, end);
        for (let position of ship.occupied) {
            this.board[position[0]][position[1]] = "S";
        }
        this.fleet.push(ship);
    }

    receiveAttack(coordinates) {
        let row = coordinates[0];
        let col = coordinates[1];
        if (this.board[row][col] === 0) {
            this.board[row][col] = "M";
        }
        else if (this.board[row][col] === "S") {
            this.board[row][col] = "H";
            for (let ship of this.fleet) {
                for (let position of ship.occupied) {
                    if (position[0] === row && position[1] === col) {
                        ship.hit();
                        if (ship.sunk) {
                            this.sinkCount++;
                        }
                    }
                }
            }
        }
        if (this.sinkCount === 5) this.gameOver = true;
    }
}

module.exports = {"Gameboard": Gameboard, "Ship": Ship};