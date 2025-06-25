import React, { Component } from "react";
import "./TicTacToe.css";

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: null,
    };
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      winner: this.calculateWinner(squares),
    });
  }

  resetGame = () => {
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: null,
    });
  };

  renderSquare(i) {
    return (
      <button className="square" onClick={() => this.handleClick(i)}>
        {this.state.squares[i]}
      </button>
    );
  }

  render() {
    const winner = this.calculateWinner(this.state.squares);
    const isDraw =
      !winner && this.state.squares.every((square) => square !== null);
    let status;

    if (winner) {
      status = `Winner: ${winner}`;
    } else if (isDraw) {
      status = "Game Draw!";
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="tictactoe">
        <h2>Tic Tac Toe</h2>
        <div className="status">{status}</div>
        <div className="board">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        <button className="reset-button" onClick={this.resetGame}>
          Reset Game
        </button>
      </div>
    );
  }
}

export default TicTacToe;
