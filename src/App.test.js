import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Board from './board.js';
//const checkers = require('./checkers.js');
// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
// });

describe('Creates Board', () => {
	let myBoard = new Board(8, 1, 2);
	console.log(myBoard.board);
	test('Board is created', () => {
	  expect(myBoard.board.length).toBe(8);
	});

	let filledBoard = myBoard.board;
	test('Board is filled', () => {
	  expect(filledBoard[0][1]).toBe(12);
	  expect(filledBoard[7][0]).toBe(0);
	});
	let myCheckers = myBoard.checkers;
	test('Checkers created', () => {
		expect(myCheckers.length).toBe(24);
		expect(myCheckers[0].player).toBe(1);
		expect(myCheckers[0].isKing).toBe(false);
	});
});

describe('Can move checkers', () => {
	let myBoard = new Board(8, 1, 2);
	test('Can move checker 9', () => {
		expect(myBoard.canMoveChecker(9, 4, 3)).toBe(true);
	});
});

describe('Move checkers', () => {
	let myBoard = new Board(8, 1, 2);
	test('Move checker 9', () => {
		myBoard.moveChecker(9, 4, 3);
		expect(myBoard.checkers[9].row).toBe(4);
		expect(myBoard.checkers[9].col).toBe(3);
		expect(myBoard.board[4][3]).toBe(9);
	});
	test('Move checker 20', () => {
		myBoard.moveChecker(20, 3, 2);
		expect(myBoard.checkers[20].row).toBe(3);
		expect(myBoard.checkers[20].col).toBe(2);
		expect(myBoard.board[3][2]).toBe(20);
	});
	test('Move checker 9 again', () => {
		myBoard.moveChecker(9, 3, 4);
		expect(myBoard.checkers[9].row).toBe(3);
		expect(myBoard.checkers[9].col).toBe(4);
		expect(myBoard.board[3][4]).toBe(9);
	});
	test('Move checker 21', () => {
		myBoard.moveChecker(21, 4, 5);
		expect(myBoard.checkers[21].row).toBe(4);
		expect(myBoard.checkers[21].col).toBe(5);
		expect(myBoard.board[4][5]).toBe(21);
		expect(myBoard.board[3][4]).toBe(null);
	});
});

describe('Gets moves for given checker', () => {
	let myBoard = new Board(8, 1, 2);
	test('No possible moves for checker 1 at start', () => {
		let moves = myBoard.getMoves(1);
		expect(moves.singles.length + moves.jumps.length).toBe(0);
	});
	test('Two possible moves for checker 9 at start', () => {
		let moves = myBoard.getMoves(9);
		expect(moves.singles.length).toBe(2);
	});
	test('One possible move for checker 21', () => {
		myBoard.moveChecker(9, 4, 3);
		myBoard.moveChecker(9, 3, 4);
		let moves = myBoard.getMoves(21);
		expect(moves.singles.length + moves.jumps.length).toBe(1);
	});
	test('One possible move for checker 11', () => {
		myBoard.moveChecker(21, 4, 5);
		let moves = myBoard.getMoves(11);
		expect(moves.singles.length + moves.jumps.length).toBe(1);
	});
	test('One possible move for checker 8', () => {
		let moves = myBoard.getMoves(8);
		expect(moves.singles.length + moves.jumps.length).toBe(1);
	});
});
