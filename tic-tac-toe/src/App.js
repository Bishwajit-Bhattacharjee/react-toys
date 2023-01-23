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
      return [a, b, c];
    }
  }
  return null;
}

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      type="button"
      className={`square ${isWinning && "square-winning"}`}
      onClick={onSquareClick}
    >
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
    onPlay(newSquares, i);
  }

  const winner = calculateWinner(squares);
  const status =
    winner === null
      ? `Next player is ${xIsNext ? "X" : "O"}`
      : `winner is ${squares[winner[0]]}`;

  const board = [];
  for (let row = 0; row < 3; row += 1) {
    const rows = [];
    for (let col = 0; col < 3; col += 1) {
      const pos = row * 3 + col;
      rows.push(
        <Square
          value={squares[pos]}
          isWinning={winner && winner.includes(pos)}
          onSquareClick={() => handleClick(pos)}
        />
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
  const [history, setHistory] = useState([
    {
      curBoard: Array(9).fill(null),
      movePos: null,
    },
  ]);
  const [isDesc, setIsDesc] = useState(true);

  const handlePlay = (curBoard, movePos) => {
    const newHistory = [...history, { curBoard, movePos }];
    setHistory(newHistory);
  };
  const handleTimeTravel = (pos) => {
    setHistory(history.filter((_, ind) => ind <= pos));
  };
  const handleToggleHistory = () => {
    setIsDesc(!isDesc);
  };

  const currentBoard = history[history.length - 1].curBoard;
  const xIsNext = history.length % 2 === 1;

  const pastMoves = history.map((move, id) => {
    const isCurrentMove = id === history.length - 1;
    const movePosMsg = `(${Math.floor(move.movePos / 3)}, ${move.movePos % 3})`;
    const msg = `Go to ${id ? `#${id} ${movePosMsg}` : "Starting"}`;
    return (
      // eslint-disable-next-line react/no-array-index-key
      <li key={id}>
        <ClickableMsg
          msg={msg}
          isClickable={isCurrentMove}
          onClick={() => handleTimeTravel(id)}
        />
      </li>
    );
  });

  if (!isDesc) {
    pastMoves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentBoard} onPlay={handlePlay} />
      </div>
      {/* </button>
      <button type="button" className="toggle" onClick={handleToggleHistory}>
      </button> */}
      <div className="game-info">
        <ol>{pastMoves}</ol>
        <button type="button" onClick={handleToggleHistory}>
          {`Sort ${isDesc ? "ASC" : "DESC"}`}
        </button>
      </div>
    </div>
  );
}
