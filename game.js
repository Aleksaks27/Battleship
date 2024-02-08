const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");
const message = document.querySelector("#message");

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
        this.hits++;
        this.isSunk();
    }

    isSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
            message.textContent = `The ${this.name} has sunk!`;
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
    constructor(name) {
        this.name = name;
        this.board = new Gameboard;
    }

    boardSetup() {
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
                        if (this.board.board[start[0]][start[1] + i] === "S") break;
                    }
                }
                else {
                    if ((start[0] + ship.length - 1) > 9) continue;
                    for (i = 0; i < ship.length; i++) {
                        if (this.board.board[start[0] + i][start[1]] === "S") break;
                    }
                }
                if (i === ship.length) valid = true;
            }
            this.board.placeShip(ship.name, ship.length, start, orientation);
        }
        if (this.name === "player") {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (this.board.board[i][j] === "S") {
                        playerBoard.children[Number(String(i) + String(j))].classList.add("ship");
                    }
                }
            }
        }
        if (this.name === "computer") {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (this.board.board[i][j] === "S") {
                        computerBoard.children[Number(String(i) + String(j))].classList.add("ship-hidden");
                    }
                }
            }
        }
    }

    playTurn(coordinates, opponent) {
        let row = coordinates[0];
        let col = coordinates[1];
        if (opponent.board.board[row][col] === "H" || opponent.board.board[row][col] === "M") {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            console.log([x, y]);
            return this.playTurn([x, y], opponent);
        }
        else {
            opponent.board.receiveAttack(coordinates);
            if (opponent.name === "player") {
                if (playerBoard.children[Number(String(row) + String(col))].classList.contains("ship")) {
                    playerBoard.children[Number(String(row) + String(col))].classList.add("hit");
                    playerBoard.children[Number(String(row) + String(col))].classList.remove("ship");
                }
                else if (playerBoard.children[Number(String(row) + String(col))].classList.contains("water")) {
                    playerBoard.children[Number(String(row) + String(col))].classList.add("miss");
                    playerBoard.children[Number(String(row) + String(col))].classList.remove("water");
                }
            }
            return;
        }
    }
}

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        let square = document.createElement("div");
        square.classList.add("water");
        square.id = `${i}` + `${j}` + "p";
        playerBoard.appendChild(square);
    }
}

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        let square = document.createElement("div");
        square.classList.add("water");
        square.id = `${i}` + `${j}` + "c";
        computerBoard.appendChild(square);
        
        square.addEventListener("click", () => {
            if (!player.board.gameOver && !computer.board.gameOver) {
                if (!square.classList.contains("hit") && !square.classList.contains("miss")) {
                    if (square.classList.contains("ship-hidden")) {
                        square.classList.add("hit");
                        square.classList.remove("ship-hidden");
                        playGame(player, computer, [i, j]);
                    }
                    else if (square.classList.contains("water")) {
                        square.classList.add("miss");
                        square.classList.remove("water");
                        playGame(player, computer, [i, j]);
                    }
                }
            }
        })
    }
}

let computer = new Player("computer");
let player = new Player("player");
computer.boardSetup();
player.boardSetup();

function playGame(player, computer, guess) {
    if (!player.board.gameOver && !computer.board.gameOver) {
        player.playTurn(guess, computer);
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        if (!computer.board.gameOver) {
            computer.playTurn([x, y], player);
        }
    }
    if (computer.board.gameOver) message.textContent = "Congratulations. You win this round!";
    else if (player.board.gameOver) message.textContent = "Hard luck. The computer wins this round.";
}

module.exports = {
    "availableShips": availableShips,
    "Ship": Ship,
    "Gameboard": Gameboard,
    "Player": Player,
    "boardSetup": boardSetup
};