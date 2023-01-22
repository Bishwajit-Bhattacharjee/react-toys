import React, { useState } from "react";

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square({ value, onSquareClick }) {
  return (
    <button type="button" className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const newSquares = [...squares];
    newSquares[i] = xIsNext ? "X" : "O";
    onPlay(newSquares);
  }

  const winner = calculateWinner(squares);
  const status =
    winner === null
      ? `Next player is ${xIsNext ? "X" : "O"}`
      : `winner is ${winner}`;

  const board = [];
  for (let row = 0; row < 3; row += 1) {
    const rows = [];
    for (let col = 0; col < 3; col += 1) {
      const pos = row * 3 + col;
      rows.push(
        <Square value={squares[pos]} onSquareClick={() => handleClick(pos)} />
      );
    }
    board.push(<div className="board-row">{rows}</div>);
  }

  return (
    <React.Fragment key="key">
      <div className="status"> {status} </div>
      {board}
    </React.Fragment>
  );
}

function ClickableMsg({ isClickable, msg, onClick }) {
  return isClickable ? (
    msg
  ) : (
    <button type="button" onClick={onClick}>
      {msg}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const handlePlay = (curBoard) => {
    const newHistory = [...history, curBoard];
    setHistory(newHistory);
  };
  const handleTimeTravel = (pos) => {
    setHistory(history.filter((_, ind) => ind <= pos));
  };

  const currentBoard = history[history.length - 1];
  const xIsNext = history.length % 2 === 1;
  const pastMoves = history.map((_, id) => {
    const isCurrentMove = id === history.length - 1;
    const msg = `Go to ${id ? `#${id}` : "Starting"}`;
    return (
      <li key={id}>
        <ClickableMsg
          msg={msg}
          isClickable={isCurrentMove}
          onClick={() => handleTimeTravel(id)}
        />
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentBoard} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{pastMoves}</ol>
      </div>
    </div>
  );
}
