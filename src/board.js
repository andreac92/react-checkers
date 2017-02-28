function Board(size, playerOne, playerTwo) {
	this.board = this.fillBoard(this.makeBoard(size));
	this.playerOne = playerOne;
	this.playerTwo = playerTwo;
	this.checkers = this.makeCheckers(size, playerOne, playerTwo);
}

Board.prototype.makeBoard = function(size) {
    let b = [];

    for (let i = 0; i < size; i++) {
      b.push(Array(size).fill(null));
    };
    return b;
}

Board.prototype.fillBoard = function(board) {
	let size = board.length;
	let count = 0;
	let row = size - 1, row2 = 0;
	
	for (let i = 0; i < 3; i++) {
		for (let col = 0; col < size; col+=2) {
			if (i % 2 == 1) {
				board[row-i][col+1] = count;
				board[row2+i][col] = (size/2)*3 + count;
			} else {
				board[row-i][col] = count;
				board[row2+i][col+1] = (size/2)*3 + count;
			}
			count++;		
		}
	}
	return board;
}

Board.prototype.getAllMoves = function(player) {
	let moves = {jumps: [], singles: []};
	let checkers = this.checkers;
	checkers.forEach((checker, i) => {
		if (checker.player == player && !checker.removed) {
			let cMoves = this.getMoves(i);
			moves.jumps = (moves.jumps).concat(cMoves.jumps);
			moves.singles = (moves.singles).concat(cMoves.singles);
		}
	});
	console.log("moves: " + JSON.stringify(moves));
	return moves;
}

Board.prototype.hasMoves = function(player) {
	let moves = this.getAllMoves(player);
	return moves.jumps.length + moves.singles.length > 0;
}


Board.prototype.canMoveChecker = function(checker, row, col) {
	let player = this.checkers[checker].player;
	let moves = this.getAllMoves(player);
	let movesToCheck = moves.jumps.length ? moves.jumps : moves.singles;
		for (let move of movesToCheck) {
			if (move.row === row && move.col === col) {
				return true;
			}
		}
	return false;
}

Board.prototype.isJumpMove = function(checker, row) {
	return Math.abs(this.checkers[checker].row - row) === 2;
}

Board.prototype.canKeepJumping = function(checker) {
	let moves = this.getMoves(checker).jumps;
	console.log(JSON.stringify(moves));
	if (moves.length) {
		return true;
	}
	return false;
}

Board.prototype.makeKing = function(checker) {
	let c = this.checkers[checker];
	c.isKing = true;
}

Board.prototype.isKing = function(checker) {
	let c = this.checkers[checker];
	return c.isKing;
}

Board.prototype.getPlayer = function(checker) {
	let c = this.checkers[checker];
	return c.player;
}

Board.prototype.moveChecker = function (checker, row, col) {
	let c = this.checkers[checker];
	let cRow = c.row;
	let cCol = c.col;
	if (this.isJumpMove(checker, row)) {
		let midRow = (cRow + row) / 2;
		let midCol = (cCol + col) / 2;
		let removedPlayer = this.board[midRow][midCol];
		this.board[midRow][midCol] = null;
		this.checkers[removedPlayer].removed = true;
	}
	c.row = row;
	c.col = col;
	this.board[cRow][cCol] = null;
	this.board[row][col] = checker;
}

Board.prototype.getMoves = function(checker) {
	let singles = [];
	let jumps = [];
	let c = this.checkers[checker];

	let topRow = c.row - 1;
	let bottomRow = c.row + 1;
	let leftCol = c.col -1;
	let rightCol = c.col + 1;
	
	if (c.player == this.playerOne || c.isKing) {
		jumps = this.checkJumps(topRow, topRow-1, leftCol, rightCol, leftCol-1, rightCol+1, c.player);
		if (!jumps.length) {
			singles = this.checkAdjacent(topRow, leftCol, rightCol);
		}

	}
	if (c.player == this.playerTwo || c.isKing) {
		jumps = jumps.concat(this.checkJumps(bottomRow, bottomRow+1, leftCol, rightCol, leftCol-1, rightCol+1, c.player));
		if (!jumps.length) {
			singles = singles.concat(this.checkAdjacent(bottomRow, leftCol, rightCol));
		}
	}
	return {singles: singles, jumps: jumps};
}

Board.prototype.checkAdjacent = function(row, left, right) {
	let moves = [];
	if (row >= this.board.length || row < 0) {
		return moves;
	}
	if (this.board[row][left] === null) {
		moves.push({row: row, col: left});
	}
	if (this.board[row][right] === null) {
		moves.push({row: row, col: right});
	}
	return moves;
}

Board.prototype.checkJumps = function(row, nextRow, left, right, nextLeft, nextRight, player) {
	let moves = [];
	if (row >= this.board.length || row < 0 || nextRow >= this.board.length ||
		nextRow < 0
		) {
		return moves;
	}
	let adjacent = this.board[row][left];
	if (adjacent != null && this.checkers[adjacent].player !== player) {
		if (this.board[nextRow][nextLeft] === null) {
			moves.push({row: nextRow, col: nextLeft});
		}
	}
	adjacent = this.board[row][right];
	if (adjacent != null && this.checkers[adjacent].player !== player) {
		if (this.board[nextRow][nextRight] === null) {
			moves.push({row: nextRow, col: nextRight});
		}
	}
	return moves;
}

Board.prototype.makeCheckers = function(size, playerOne, playerTwo) {
	let checkers = [];
	let num = (size/2) * 3;
	let row = size-1, col = 0;
    for (let i = 0; i < num; i++) {
    	if (i && i % (size/2) === 0){
	      	row--;
	      	col = i == size ? 0 : 1;
	      }
	    checkers.push({player: playerOne, isKing: false, row: row, col: col, removed: false});
	    col+=2;
    }
    row = 0, col = 1;
    for (let i = 0; i < num; i++) {
    	if (i && i % (size/2) === 0){
	      	row++;
	      	col = i == size ? 1 : 0;
	      }
	    checkers.push({player: playerTwo, isKing: false, row: row, col: col, removed: false});
	    col+=2;
    }
    return checkers;
}


module.exports = Board;