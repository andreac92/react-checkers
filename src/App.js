import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { board: this.makeBoard(8), turn: 1 };

  }
  makeBoard(num) {
    let b = Array(num).fill(Array(num).fill(null));
    // make players
    let p1 = this.makePlayerRows(1, num);
    let p2 = this.makePlayerRows(2, num);

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
        <Board board={this.state.board} />
      </div>
    );
  }
}

class Board extends Component {
  render() {
    let rows = this.props.board.map((row, i) => {
      return <Row key={i} row={row} rowNum={i} />;
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
      return <Square key={i} val={square} row={this.props.rowNum} column={i} />
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
    let classes = "square " + color;
    let square = null;
    //if (this.props.)
    return (
      <div className={classes}>
        {this.props.val}
      </div>
    )
  }
}

export default App;
