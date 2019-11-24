import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
	key = {i}
	value={this.props.squares[i]}
	onClick={()=>this.props.onClick(i)}
	/>
    );
  }
  
  render() {
    let rows = [];
    let squares = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
    	squares.push(this.renderSquare(i*3+j));
      }
      rows.push(<div key={i*3} className="board-row">{squares}</div>);
      squares = [];
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
	squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      locationsHistory: [null],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const locationsHistory = this.state.locationsHistory.slice(0, this.state.stepNumber + 1);
    locationsHistory.push(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
	squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      locationsHistory: locationsHistory,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let moveX = Math.floor(this.state.locationsHistory[move]/3);
      let moveY = this.state.locationsHistory[move] - (moveX * 3);

      const DescEl = () => {
	const text = move ?
	      `Go to move #${move} (${moveX}:${moveY})`:
	      'Go to game start';
	return (
	  move === this.state.stepNumber ?
	    <b>{text}</b> :
	  text
	);
      };

      return (
      	<li key={move}>
      	  <button onClick={() => this.jumpTo(move)}>
      	    <DescEl />
      	  </button>
      	</li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
	    squares={current.squares}
	    onClick={(i) => this.handleClick(i)}
	    />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
