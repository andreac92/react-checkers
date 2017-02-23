import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './board.js';

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
    this.board = new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO);
    this.checkers = this.board.checkers;
    this.state = { board: this.board.returnBoard(), 
                  turn: PLAYER_ONE, 
                  selectedSquare: null };
    this.moveMade = false;
    this.scores = {[PLAYER_ONE]: 0, [PLAYER_TWO]: 0};
  }

  selectSquare(row, column) {
    console.log("in select square for row "+row+" column "+column);
    let selected = this.state.selectedSquare;
    if (!this.moveMade  
        && selected 
        && selected.row == row 
        && selected.column == column) {
        this.deselect();
    }
    else if (selected == null && this.canSelectSquare(row, column)) {
      this.setSquare(row, column);
    } 
    else if (this.state.selectedSquare != null && this.canMoveToSquare(row, column)) {
      this.moveSelected(row, column);
      console.log("allowed!!");
    }
  }

  moveSelected(row, column) {
    let newBoard = JSON.parse(JSON.stringify(this.state.board));
    let checker = newBoard[this.state.selectedSquare.row][this.state.selectedSquare.column];
    newBoard[row][column] = checker;
    newBoard[this.state.selectedSquare.row][this.state.selectedSquare.column] = null;
    this.moveMade = true;
    if (Math.abs(this.state.selectedSquare.row - row) == 2) {
      let diff;
      if ((this.state.turn == PLAYER_ONE && !checker.isKing) ||  
          (this.state.turn == PLAYER_TWO && checker.isKing)
        ) {
        diff = 1;
      } else {
        diff = -1;
      }
      let col = (column + this.state.selectedSquare.column) / 2
      newBoard[row - diff][col] = null;
      this.scores[this.state.turn]++;
    }
    if ((row == 0 && this.state.turn == PLAYER_TWO) || 
       (row == BOARD_SIZE-1 && this.state.turn == PLAYER_ONE)) {
      this.checkers[checker].isKing = true;
    }
    this.setState({board: newBoard, selectedSquare: {row: row, column: column}});
  }

  canMoveToSquare(row, column) {
    console.log("checking if you can move here....");
    if (this.state.board[row][column] != null) {
      return false;
    }

    let selected = this.state.selectedSquare;
    let checker = this.checkers[this.state.board[selected.row][selected.column]];
    let diff;
    if ((this.state.turn == PLAYER_ONE && !checker.isKing) ||  
        (this.state.turn == PLAYER_TWO && checker.isKing)
      ) {
      diff = 1;
    } else {
      diff = -1;
    }

    if (row - selected.row == diff &&
        Math.abs(selected.column - column) == 1 &&
        !this.moveMade) {
        return true;
    } else if ( row - selected.row == 2*diff &&
      Math.abs(selected.column - column) == 2 ) {
        console.log("can you jump?");
        let col = (column + selected.column) / 2;
        let square = this.state.board[row - diff][col];
        return square && this.checkers[square].player == this.nextPlayer();
    }
    return false;
  }

  canSelectSquare(row, column) {
    let square = this.state.board[row][column];
    if (!square) {
      return false;
    }
    let player = this.checkers[square].player;
    return player == this.state.turn;
  }

  setSquare(row, column) {
    this.setState({selectedSquare: {row: row, column: column}});
  }

  deselect() {
    this.setState({selectedSquare: null});
  }

  nextPlayer() {
    return (this.state.turn == PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)
  }

  switchTurn() {
    this.moveMade = false;
    this.setState({turn: this.nextPlayer(), selectedSquare: null});
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
        <GameBoard board={this.state.board} 
        checkers={this.checkers}
        selectedSquare={this.state.selectedSquare}
        selectSquare={this.selectSquare.bind(this)} />
      </div>
    );
  }
}

class GameBoard extends Component {
  render() {
    let selectedRow = this.props.selectedSquare ? this.props.selectedSquare.row : null;
    let rows = this.props.board.map((row, i) => {
      return <Row key={i} 
              row={row} 
              selectedSquare={i == selectedRow ? this.props.selectedSquare : null}
              rowNum={i} 
              checkers={this.props.checkers}
              selectSquare={this.props.selectSquare} />;
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
    let selectedCol = this.props.selectedSquare ? this.props.selectedSquare.column : null;
    let squares = this.props.row.map((square, i) => {
      return <Square key={i} 
              val={square != null ? this.props.checkers[square] : null} 
              row={this.props.rowNum} 
              column={i} 
              selected={i == selectedCol ? true : false}
              selectSquare={this.props.selectSquare} />
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
    let selection = this.props.selected ? " selected" : "";
    let classes = "square " + color + selection;
    return (
      <div className={classes} onClick={() => this.props.selectSquare(this.props.row, this.props.column)}>
        {this.props.val != null &&
          <Piece checker={this.props.val} />
        }
      </div>
    )
  }
}

function Piece(props) {
  console.log(props.checker);
  let classes = props.checker ? PLAYERS[props.checker.player].class : "";
  return (
    <div className={classes}></div>
  )
}

export default App;
