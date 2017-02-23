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

// describe('Creates Checkers', () => {
// 	let myCheckers = checkers.makeCheckers(8, 1, 2);
// 	console.log(myCheckers);
// 	test('Checkers created', () => {
// 		expect(myCheckers.length).toBe(24);
// 		expect(myCheckers[0].player).toBe(1);
// 		expect(myCheckers[0].isKing).toBe(false);
// 	});
//});
