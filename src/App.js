import { useState } from 'react';

function Square({ cName, value, onSquareClick }) {
  return (
    <button className={'square ' + cName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winner, setWinner }) {
  const [player, line] = calculateWinner(squares, setWinner);

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = 'X') : (nextSquares[i] = 'O');
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = 'Winner: ' + player;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  let sq_list = Array(9).fill(null);
  let cName = '';
  sq_list = sq_list.map((_, i) => {
    if (winner && line.includes(i)) {
      cName = 'winner';
    } else {
      cName = '';
    }
    return (
      <Square
        key={'square-' + i}
        cName={cName}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
      />
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">{sq_list.slice(0, 3)}</div>
      <div className="board-row">{sq_list.slice(3, 6)}</div>
      <div className="board-row">{sq_list.slice(6, 9)}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(false);
  const [newGame, setNewGame] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const endGame = currentMove === 9;

  if (newGame) {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(false);
    setNewGame(false);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (0 < move < 9) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winner={winner}
          setWinner={setWinner}
        />
        <button
          className="new-game-btn"
          onClick={() => setNewGame(true)}
          hidden={!endGame}
        >
          New Game?
        </button>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, setWinner) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      setWinner(true);
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}
