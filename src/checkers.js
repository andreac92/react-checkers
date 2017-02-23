const checkerOps = (() => {
	let makeCheckers = (size, playerOne, playerTwo) => {
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

	return {
		makeCheckers: makeCheckers
	}
})();

module.exports = checkerOps;