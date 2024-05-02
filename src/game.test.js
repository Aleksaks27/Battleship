// const gameClasses = require('./game');
import Gameboard from "./gameboard";
import Player from "./player";

const testBoard = new Gameboard;
testBoard.placeShip(4, [0, 0], "horizontal")

test("Check that the ship is occupying the correct points", () => {
    expect(testBoard.fleet[0].occupied).toStrictEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
})

testBoard.receiveAttack([0, 1]);

test("Check that a strike on a ship registers correctly", () => {
    expect(testBoard.board[0][1]).toBe("H");
})

testBoard.receiveAttack([5, 5]);

test("Check that a miss registers correctly", () => {
    expect(testBoard.board[5][5]).toBe("M");
})

testBoard.receiveAttack([0, 0]);
testBoard.receiveAttack([0, 2]);
testBoard.receiveAttack([0, 3]);

test("Check that a ship sinks correctly", () => {
    expect(testBoard.sinkCount).toBe(1);
})

const testUser = new Player;
testUser.boardSetup();

test("Check that all available ships are added to the board", () => {
    expect(testUser.board.fleet.length).toBe(5);
})