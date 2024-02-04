const availableShips = [
    {name: "Carrier", length: 5},
    {name: "Battleship", length: 4},
    {name: "Destroyer", length: 3},
    {name: "Submarine", length: 3},
    {name: "Patrol Boat", length: 2},
]

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

    cover() {
        let positions = [];
        if (this.orientation === "horizontal") {
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
        console.log("It's a successful hit!");
        this.hits++;
        this.isSunk();
    }

    isSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
            console.log(`The ${this.name} has sunk!`);
        }
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

    placeShip(name, length, start, orientation) {
        let ship = new Ship(name, length, start, orientation);
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
            console.log("It's a miss!");
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

class Player {
    constructor() {
        this.turn = false;
        this.board = new Gameboard;
        this.lost = this.board.gameOver;
    }
}

function playGame() {
    let computer = new Player;
    let player = new Player;
    player.turn = true;
    boardSetup(computer);
    boardSetup(player);
    while (!player.lost && !computer.lost) {
        if (player.turn) {
            while (player.turn) {
                let guess = prompt("Where do you want to strike your enemy?");
                playTurn([Number(guess[0]), Number(guess[2])], player, computer);
            }
        }
        else {
            while (computer.turn) {
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * 10);
                playTurn([x, y], computer, player);
            }
        }
    }
    if (computer.lost) console.log("Congratulations. You win this round!");
    else console.log("Hard luck. The computer wins this round.");
}

function boardSetup(user) {
    for (let ship of availableShips) {
        let valid = false;
        let start = [];
        let orientation;
        if (Math.random() > 0.5) orientation = "horizontal";
        else orientation = "vertical";
        while (!valid) {
            start = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
            let i;
            if (orientation === "horizontal") {
                if ((start[1] + ship.length - 1) > 9) continue;
                for (i = 0; i < ship.length; i++) {
                    if (user.board.board[start[0]][start[1] + i] === "S") break;
                }
            }
            else {
                if ((start[0] + ship.length - 1) > 9) continue;
                for (i = 0; i < ship.length; i++) {
                    if (user.board.board[start[0] + i][start[1]] === "S") break;
                }
            }
            if (i === ship.length) valid = true;
        }
        user.board.placeShip(ship.name, ship.length, start, orientation);
    }
    console.log(user.board.board);
}

function playTurn(coordinates, player, opponent) {
    let row = coordinates[0];
    let col = coordinates[1];
    if (opponent.board.board[row][col] === "H" || opponent.board.board[row][col] === "M") {
        console.log("You've already fired there! Choose another spot");
        return;
    }
    opponent.board.receiveAttack(coordinates);
    player.turn = false;
    opponent.turn = true;
    return;
}

playGame();

module.exports = {
    "availableShips": availableShips,
    "Ship": Ship,
    "Gameboard": Gameboard,
    "Player": Player,
    "boardSetup": boardSetup
};