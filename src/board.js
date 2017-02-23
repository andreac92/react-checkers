function Board(size, playerOne, playerTwo) {
	this.board = this.fillBoard(this.makeBoard(size));
	this.checkers = this.makeCheckers(size, playerOne, playerTwo);
}

Board.prototype.returnBoard = function() {
	return JSON.parse(JSON.stringify(this.board));
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

Board.prototype.getMoves = function(checker) {
	let allMoves = [];
	let c = this.checkers[checker];

	let topRow = c.row - 1;
	let bottomRow = c.row + 1;
	let leftCol = c.col -1;
	let rightCol = c.col + 1;
	
	if (c.isKing) {

	} else if (c.player == 1) {
		allMoves.concat(this.checkAdjacent(topRow, leftCol, rightCol));
	} else if (c.player == 2) {
		allMoves.concat(this.checkAdjacent(bottomRow, leftCol, rightCol));
	}
}

Board.prototype.checkAdjacent = function(row, left, right, player) {
	let moves = [];
	if (this.board[row][left] == null) {
		moves.push({row: row, col: left});
	}
	if (this.board[row][right] == null) {
		moves.push({row: row, col: right});
	}
	return moves;
}

Board.prototype.canMove = function(from, to) {
	if (this.board[to.row][to.col] != null) {
		return false;
	}
}

Board.prototype.makeCheckers = function(size, playerOne, playerTwo) {
	let checkers = [];
	let num = (size/2) * 3;
	let row = size-1, col = 0;
    for (let i = 0; i < num; i++) {
    	if (i && i % (size/2) == 0){
	      	row--;
	      	col = i == size ? 0 : 1;
	      }
	    checkers.push({player: playerOne, isKing: false, row: row, col: col});
	    col+=2;
    }
    row = 0, col = 1;
    for (let i = 0; i < num; i++) {
    	if (i && i % (size/2) == 0){
	      	row++;
	      	col = i == size ? 1 : 0;
	      }
	    checkers.push({player: playerTwo, isKing: false, row: row, col: col});
	    col+=2;
    }
    return checkers;
}


module.exports = Board;