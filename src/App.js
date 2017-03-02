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
    this.state = { board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO), 
                  turn: PLAYER_ONE, 
                  selectedSquare: null, winner: null };

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.turn != this.state.turn) {
      let board = this.state.board;
      if (!board.hasMoves(this.state.turn)) {
        console.log("no available moves!!!");
        this.setState({winner: this.nextPlayer()});
      }
    }
  }

  selectSquare(row, column) {
    console.log("in select square for row "+row+" column "+column);
    let selected = this.state.selectedSquare;
    if (this.canSelectSquare(row, column)) {
      this.setSquare(row, column);
    } else if (selected != null) {
      this.handleMove(row, column);
    }
  }

  handleMove(row, col) {
    console.log("handling move...");
    let board = this.state.board;
    let selected = this.state.selectedSquare;
    let start = board.board[selected.row][selected.column];
    if (!board.canMoveChecker(start, row, col)) {
      console.log("illegal move");
      return;
    }

    let isJump = board.isJumpMove(start, row, col);
    let becameKing = false;
    board.moveChecker(start, row, col);
    if (!board.isKing(start) && (board.getPlayer(start) == PLAYER_ONE && row == 0) || (board.getPlayer(start) == PLAYER_TWO && row == ((board.board.length)-1))) {
      console.log("making King....");
      becameKing = true;
      board.makeKing(start);
    }

    if (!becameKing && isJump && board.canKeepJumping(start)) {
      this.setState({board: board, selectedSquare: {row: row, column: col}});
    } else {
      this.setState({board: board, turn: this.nextPlayer(), selectedSquare: null});
    }
  }

  canSelectSquare(row, column) {
    let square = this.state.board.board[row][column];
    if (!square) {
      return false;
    }
    let player = this.state.board.checkers[square].player;
    return player == this.state.turn;
  }

  setSquare(row, column) {
    this.setState({selectedSquare: {row: row, column: column}});
  }

  nextPlayer() {
    return (this.state.turn == PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)
  }

  restart() {
    this.setState({ board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO), 
                  turn: PLAYER_ONE, selectedSquare: null, winner: null });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Checkers</h2>
        </div>
        {this.state.winner &&
          <Winner player={this.state.winner} restart={this.restart.bind(this)} />
        }
        <h3>Current turn: {PLAYERS[this.state.turn].name}<span className={PLAYERS[this.state.turn].class}></span></h3>
        <GameBoard board={this.state.board} 
        selectedSquare={this.state.selectedSquare}
        selectSquare={this.selectSquare.bind(this)} />
      </div>
    );
  }
}

function Winner(props) {
  let player = PLAYERS[props.player].name;
  return (
    <div id="winner">
      <div>
        <p>{player} has won the game!</p>
        <button onClick={props.restart}>Play again?</button>
      </div>
    </div>
  );
}

class GameBoard extends Component {
  render() {
    let selectedRow = this.props.selectedSquare ? this.props.selectedSquare.row : null;
    let rows = this.props.board.board.map((row, i) => {
      return <Row key={i} 
              row={row} 
              selectedSquare={i == selectedRow ? this.props.selectedSquare : null}
              rowNum={i} 
              checkers={this.props.board.checkers}
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
  let classes = "";
  if (props.checker) {
    classes += PLAYERS[props.checker.player].class;
    if (props.checker.isKing) {
      classes += " king";
    }
  }
  return (
    <div className={classes}></div>
  )
}

export default App;
