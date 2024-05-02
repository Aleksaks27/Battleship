import Ship from './ship';

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

    placeShip(name, length, start, orientation) {
        let ship = new Ship(name, length, start, orientation);
        for (let position of ship.occupied) {
            this.board[position[0]][position[1]] = "S";
        }
        this.fleet.push(ship);
    }

    receiveAttack(coordinates) {
        const row = coordinates[0];
        const col = coordinates[1];
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

export default Gameboard;