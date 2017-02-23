import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const BOARD_SIZE = 8;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
const PLAYERS = {
  [PLAYER_ONE]: {
    name: "Player One",
    class: "player-one"
  },
  [PLAYER_TWO]: {
    name: "Player Two",
    class: "player-two"
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { board: this.makeBoard(BOARD_SIZE), 
                  turn: PLAYER_ONE, 
                  selectedSquare: null };
    this.moveMade = false;
    this.scores = {[PLAYER_ONE]: 0, [PLAYER_TWO]: 0};
  }

  selectSquare(row, column) {
    console.log("in select square for row "+row+" column "+column);
    if (!this.moveMade && this.state.selectedSquare && this.state.selectedSquare.row == row && 
        this.state.selectedSquare.column == column) {
      console.log("selected the selected..");
      this.deselect();
    }
    else if (this.state.selectedSquare == null && this.canSelectSquare(row, column)) {
      this.setSquare(row, column);
    } 
    else if (this.state.selectedSquare != null && this.canMoveToSquare(row, column)) {
       this.moveSelected(row, column);
    //   if !canSetMore turn = other player
    console.log("allowed!!");
    }
  }

  deselect() {
    let newBoard = JSON.parse(JSON.stringify(this.state.board));
    newBoard[this.state.selectedSquare.row][this.state.selectedSquare.column] /= 10;
    this.setState({board: newBoard, selectedSquare: null});
  }

  moveSelected(row, column) {
    let newBoard = JSON.parse(JSON.stringify(this.state.board));
    newBoard[row][column] = this.state.turn * 10;
    newBoard[this.state.selectedSquare.row][this.state.selectedSquare.column] = null;
    this.moveMade = true;
    if (Math.abs(this.state.selectedSquare.row - row) == 2) {
      let diff = this.state.turn == PLAYER_ONE ? 1 : -1; 
      let col = (column + this.state.selectedSquare.column) / 2
      newBoard[row - diff][col] = null;
      this.scores[this.state.turn]++;
    }
    this.setState({board: newBoard, selectedSquare: {row: row, column: column}});
  }

  canSelectSquare(row, column) {
    if (this.state.board[row][column] == this.state.turn) {
      return true;
    }
    return false;
  }

  canMoveToSquare(row, column) {
    console.log("checking if you can move here....");
    let diff = this.state.turn == PLAYER_ONE ? 1 : -1;
    if (row - this.state.selectedSquare.row == diff &&
        Math.abs(this.state.selectedSquare.column - column) == 1 &&
        !this.moveMade &&
        this.state.board[row][column] == null
       ) {
        return true;
    } else if (
        row - this.state.selectedSquare.row == 2*diff &&
        Math.abs(this.state.selectedSquare.column - column) == 2 &&
        this.state.board[row][column] == null
      ) {
      console.log("can you jump?");
      let col = (column + this.state.selectedSquare.column) / 2
      return this.state.board[row - diff][col] == this.nextPlayer();
    }
    return false;
  }

  setSquare(row, column) {
    console.log("heyyy");
    let newBoard = JSON.parse(JSON.stringify(this.state.board));
    if (newBoard[row][column]) {
      newBoard[row][column] *= 10;
    }
    this.setState({board: newBoard, selectedSquare: {row: row, column: column}});
    //console.log(JSON.stringify(newBoard));
  }

  moveSquare(row, column) {
    let newBoard = this.state.board.slice();
    newBoard[this.state.selectedSquare.row][this.state.selectedSquare.column] = null;
    newBoard[row][column] = this.state.turn;
    this.setState({board: newBoard});
  }

  nextPlayer() {
    return (this.state.turn == PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)
  }

  switchTurn() {
    this.moveMade = false;
    let newBoard = JSON.parse(JSON.stringify(this.state.board));
    newBoard[this.state.selectedSquare.row][this.state.selectedSquare.column] /= 10;
    this.setState({turn: this.nextPlayer(), board: newBoard, selectedSquare: null});
  }

  makeBoard(num) {
    let b = Array(num).fill(Array(num).fill(null));
    // make players
    let p1 = this.makePlayerRows(PLAYER_ONE, num);
    let p2 = this.makePlayerRows(PLAYER_TWO, num);

    b[0] = p1.even;
    b[1] = p1.odd;
    b[num-1] = p2.odd;
    b[num-2] = p2.even;

    return b;
  }
  makePlayerRows(p, num) {
    let evenRow = [];
    let oddRow = [];
    for (let i = 0; i < num; i++) {
      if (i % 2 == 0) {
        evenRow.push(p);
        oddRow.push(null);
      } else {
        oddRow.push(p);
        evenRow.push(null);
      }
    }
    return {even: evenRow, odd: oddRow};
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Checkers</h2>
        </div>
        <h3>Current turn: {PLAYERS[this.state.turn].name}<span className={PLAYERS[this.state.turn].class}></span></h3>
        <button onClick={this.switchTurn.bind(this)}>End my turn</button>
        <Board board={this.state.board} selectSquare={this.selectSquare.bind(this)} />
      </div>
    );
  }
}

class Board extends Component {
  render() {
    let rows = this.props.board.map((row, i) => {
      return <Row key={i} row={row} rowNum={i} selectSquare={this.props.selectSquare} />;
    });
    return (
      <div className="board">
        {rows}
      </div>
    )
  }
}

class Row extends Component {
  render() {
    let squares = this.props.row.map((square, i) => {
      return <Square key={i} val={square} row={this.props.rowNum} column={i} selectSquare={this.props.selectSquare} />
    });
    return (
      <div className="row">
        {squares}
      </div>
    )
  }
}

class Square extends Component {
  render() {
    let color = (this.props.row + this.props.column) % 2 == 0 ? "red" : "black";
    let selection = this.props.val && this.props.val >= 10 ? " selected" : "";
    let classes = "square " + color + selection;
    let player = this.props.val && this.props.val >= 10 ? this.props.val / 10 : this.props.val;
    return (
      <div className={classes} onClick={() => this.props.selectSquare(this.props.row, this.props.column)}>
        {this.props.val &&
          <Piece player={player} />
        }
      </div>
    )
  }
}

function Piece(props) {
  console.log(props.player);
  let classes = props.player ? PLAYERS[props.player].class : "";
  return (
    <div className={classes}></div>
  )
}

export default App;
