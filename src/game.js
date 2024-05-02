import "./styles.css";
import Player from "./player";
import initialize from "./initialize";

const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");
const message = document.querySelector("#message");
const restart = document.querySelector("#restart");

const availableShips = [
    {name: "Carrier", length: 5},
    {name: "Battleship", length: 4},
    {name: "Destroyer", length: 3},
    {name: "Submarine", length: 3},
    {name: "Patrol Boat", length: 2},
]
const popup = document.querySelector("#popup");
const startingBoard = document.querySelector("#starting-board");
const randomise = document.querySelector("#randomise");
const begin = document.querySelector("#begin");
let introMessage = document.querySelector("#intro-message");
let orientation = document.querySelector("#orientation");
let index = 0;
let randomLayout = false;

popup.showModal();
// The user can choose their starting layout on the popup menu. Much like boardSetup() below, the
// position of a ship is only valid if it neither spills off the board nor crosses another ship.
// The user will cycle through the fleet's available ships, each accompanied by a different message.
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const square = document.createElement("div");
        startingBoard.appendChild(square);
        square.addEventListener("click", () => {
            if (index < 5) {
                if (orientation.textContent === "Horizontal") {
                    if (j + availableShips[index].length - 1 < 10) {
                        let k = availableShips[index].length - 1;
                        let start = Number(String(i) + String(j));
                        let valid = true;
                        for (let z = start; z <= start + k; z++) {
                            if (startingBoard.children[z].classList.contains("choice")) {
                                valid = false;
                            }
                        }
                        if (valid) {
                            while (k >= 0) {
                                startingBoard.children[start + k].classList.add("choice");
                                k--;
                            }
                            let ship = availableShips[index];
                            player.board.placeShip(ship.name, ship.length, [i, j],"Horizontal");
                            index++;
                            if (index < 5) introMessage.textContent = `Place your ${availableShips[index].name}`;
                        }
                    }
                }
                else {
                    if (i + availableShips[index].length - 1 < 10) {
                        let k = 10 * (availableShips[index].length - 1);
                        let start = Number(String(i) + String(j));
                        let valid = true;
                        for (let z = start; z <= start + k; z += 10) {
                            if (startingBoard.children[z].classList.contains("choice")) {
                                valid = false;
                            }
                        }
                        if (valid) {
                            while (k >= 0) {
                                startingBoard.children[start + k].classList.add("choice");
                                k -= 10;
                            }
                            let ship = availableShips[index];
                            player.board.placeShip(ship.name, ship.length, [i, j],"Verical");
                            index++;
                            if (index < 5) introMessage.textContent = `Place your ${availableShips[index].name}`;
                        }
                    }
                }
            }
        })
    }
}

orientation.addEventListener("click", () => {
    if (orientation.textContent === "Horizontal") orientation.textContent = "Vertical";
    else orientation.textContent = "Horizontal";
})

randomise.addEventListener("click", () => {
    randomLayout = true;
    popup.close();
    initialize();
})

begin.addEventListener("click", () => {
    if (index === 5) {
        console.log("test");
        popup.close();
        initialize();
    }
})

restart.addEventListener("click", () => {
    location.reload();
})

// class Ship {
//     constructor(name, length, start, orientation) {
//         this.name = name;
//         this.length = length;
//         this.start = start;
//         this.orientation = orientation;
//         this.occupied = this.cover();
//         this.hits = 0;
//         this.sunk = false;
//     }
//     // The cover() function calculates the positions a ship occupies depending on its orientation.
//     cover() {
//         let positions = [];
//         if (this.orientation === "Horizontal") {
//             let row = this.start[0];
//             let i = this.start[1] + (this.length - 1);
//             while (i >= this.start[1]) {
//                 positions.unshift([row, i]);
//                 i--;
//             }
//         }
//         else {
//             let col = this.start[1];
//             let i = this.start[0] + (this.length - 1);
//             while (i >= this.start[0]) {
//                 positions.unshift([i, col]);
//                 i--;
//             }
//         }
//         return positions;
//     }

//     hit() {
//         this.hits++;
//         this.isSunk();
//     }
//     // The success message changes depending on which fleet the ship belongs to.
//     isSunk() {
//         if (this.hits === this.length) {
//             this.sunk = true;
//             if (player.board.fleet.includes(this)) message.textContent = `Ỳour ${this.name} has sunk!`;
//             else message.textContent = `The computer's ${this.name} has sunk!`;
            
//         }
//     }
// }

// Gameboard conventions: 0 represents unoccupied and untouched water. S represents a square
// occupied by a ship. H represents a hit - part of a ship that was successfully struck. Finally,
// M is a miss - a patch of empty water that was struck by the enemy.

// class Gameboard {
//     constructor() {
//         this.board = [
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//         ];
//         this.fleet = [];
//         this.sinkCount = 0;
//         this.gameOver = false;
//     }

//     placeShip(name, length, start, orientation) {
//         let ship = new Ship(name, length, start, orientation);
//         for (let position of ship.occupied) {
//             this.board[position[0]][position[1]] = "S";
//         }
//         this.fleet.push(ship);
//     }

//     receiveAttack(coordinates) {
//         const row = coordinates[0];
//         const col = coordinates[1];
//         if (this.board[row][col] === 0) {
//             this.board[row][col] = "M";
//         }
//         else if (this.board[row][col] === "S") {
//             this.board[row][col] = "H";
//             for (let ship of this.fleet) {
//                 for (let position of ship.occupied) {
//                     if (position[0] === row && position[1] === col) {
//                         ship.hit();
//                         if (ship.sunk) {
//                             this.sinkCount++;
//                         }
//                     }
//                 }
//             }
//         }
//         if (this.sinkCount === 5) this.gameOver = true;
//     }
// }

// class Player {
//     constructor(name) {
//         this.name = name;
//         this.board = new Gameboard;
//     }
//     // The function below chooses a ship's orientation randomly. After that, random coordinates
//     // are chosen. However that position is only valid if it does not spill off the board or
//     // overlap with another ship. The DOM is then updated accordingly.
//     boardSetup() {
//         for (let ship of availableShips) {
//             let valid = false;
//             let start = [];
//             let orientation;
//             if (Math.random() > 0.5) orientation = "Horizontal";
//             else orientation = "Vertical";
//             while (!valid) {
//                 start = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
//                 let i;
//                 if (orientation === "Horizontal") {
//                     if ((start[1] + ship.length - 1) > 9) continue;
//                     for (i = 0; i < ship.length; i++) {
//                         if (this.board.board[start[0]][start[1] + i] === "S") break;
//                     }
//                 }
//                 else {
//                     if ((start[0] + ship.length - 1) > 9) continue;
//                     for (i = 0; i < ship.length; i++) {
//                         if (this.board.board[start[0] + i][start[1]] === "S") break;
//                     }
//                 }
//                 if (i === ship.length) valid = true;
//             }
//             this.board.placeShip(ship.name, ship.length, start, orientation);
//         }
//         if (this.name === "player") {
//             for (let i = 0; i < 10; i++) {
//                 for (let j = 0; j < 10; j++) {
//                     if (this.board.board[i][j] === "S") {
//                         playerBoard.children[Number(String(i) + String(j))].classList.add("ship");
//                     }
//                 }
//             }
//         }
//         if (this.name === "computer") {
//             for (let i = 0; i < 10; i++) {
//                 for (let j = 0; j < 10; j++) {
//                     if (this.board.board[i][j] === "S") {
//                         computerBoard.children[Number(String(i) + String(j))].classList.add("ship-hidden");
//                     }
//                 }
//             }
//         }
//     }
//     // When the computer plays a turn (with random coordinates), these will be rejected if already
//     // occupied by a hit or miss. In that case playTurn() recursively invokes until it finds a free
//     // spot.

//     playTurn(coordinates, opponent) {
//         const row = coordinates[0];
//         const col = coordinates[1];
//         if (opponent.board.board[row][col] === "H" || opponent.board.board[row][col] === "M") {
//             const x = Math.floor(Math.random() * 10);
//             const y = Math.floor(Math.random() * 10);
//             return this.playTurn([x, y], opponent);
//         }
//         else {
//             opponent.board.receiveAttack(coordinates);
//             if (opponent.name === "player") {
//                 if (playerBoard.children[Number(String(row) + String(col))].classList.contains("ship")) {
//                     playerBoard.children[Number(String(row) + String(col))].classList.add("hit");
//                     playerBoard.children[Number(String(row) + String(col))].classList.remove("ship");
//                 }
//                 else if (playerBoard.children[Number(String(row) + String(col))].classList.contains("water")) {
//                     playerBoard.children[Number(String(row) + String(col))].classList.add("miss");
//                     playerBoard.children[Number(String(row) + String(col))].classList.remove("water");
//                 }
//             }
//             return;
//         }
//     }
// }
// The HTML boards/grids are created below. For the player's board, event listeners are added to
// each unoccupied square for the user to play a round. These are only accessible while the game is
// in progress. CSS properties of squares change accordingly.
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const square = document.createElement("div");
        square.classList.add("water");
        square.id = `${i}` + `${j}` + "p";
        playerBoard.appendChild(square);
    }
}

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const square = document.createElement("div");
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
// New player objects are created here. If the user has chosen a random layout, the board and fleet
// are first erased to ensure no repetition. Otherwise, the layout chosen at the beginning is 
// applied to the player's board.
let computer = new Player("computer");
let player = new Player("player");
// function initialize() {
//     computer.boardSetup();
//     if (randomLayout) {
//         player.board.fleet = [];
//         player.board.board = [
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//         ];
//         player.boardSetup();
//     }
//     else {
//         for (let i = 0; i < 10; i++) {
//             for (let j = 0; j < 10; j++) {
//                 if (startingBoard.children[Number(String(i) + String(j))].classList.contains("choice")) {
//                     player.board.board[i][j] = "S";
//                     playerBoard.children[Number(String(i) + String(j))].classList.add("ship");
//                 }
//                 else {
//                     player.board.board[i][j] = 0;
//                     playerBoard.children[Number(String(i) + String(j))].classList.add("water");
//                 }
//             }
//         }
//     }
// }
// Each time the user clicks a square on the computer's board, both play one turn until a winner
// is crowned.
function playGame(player, computer, guess) {
    if (!player.board.gameOver && !computer.board.gameOver) {
        player.playTurn(guess, computer);
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        if (!computer.board.gameOver) {
            computer.playTurn([x, y], player);
        }
    }
    if (computer.board.gameOver) message.textContent = "Congratulations. You win this round!";
    else if (player.board.gameOver) message.textContent = "Hard luck. The computer wins this round.";
}

// module.exports = {
//     "availableShips": availableShips,
//     "Ship": Ship,
//     "Gameboard": Gameboard,
//     "Player": Player,
//     "boardSetup": boardSetup
// };

export { 
    playerBoard,
    computerBoard,
    message,
    startingBoard,
    availableShips,
    randomLayout,
    computer,
    player,
}