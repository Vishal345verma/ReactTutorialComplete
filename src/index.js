import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick} style = {props.highlight ? {backgroundColor: 'powderblue'} : {}}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          highlight = {this.shouldHighlight(i)}
        />
      );
    }

    shouldHighlight(i){
      // console.log(`${this.props.highlights[i]} ${i}`);
      return this.props.highlights[i];
    }
    render() {
      let result = [];
      let index = 0;
      for(let i = 0;i < 3;i++){
        let rowItems = [];
        for(let j = 0;j < 3;j++){
          rowItems.push(this.renderSquare(index));
          index++;
        }
        result.push(<div className="board-row">{rowItems}</div>);
      }
      return (
        <div>
         {result}
        </div>
      );
  }
}
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    row: null,
                    col: null,
                    hightlights : Array(9).fill(false),
                }
            ],
            stepNumber : 0,
            isAscending: true,
            xIsNext: true,
            winner: null,
            moves: 0,
        }
        this.reverseIt = this.reverseIt.bind(this);
    }

    getMappings(){
      let index = 0;
      let result = {};
      for(let i =0 ; i < 3;i++){
        for(let j = 0;j < 3;j++){
          result[index] = [i,j];
          index++;
        }
      }
      return result;
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext : (step% 2 ) === 0,
      })
    }

    getRowAndCol(i){
      return this.getMappings()[i];
    }
    handleClick(i) {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const squares = current.squares.slice();
      const currentHighlights = current.hightlights.slice();
      const inc = this.state.moves + 1;
      this.setState({
        moves: inc,
      });
      console.log(this.state.moves);
      if(squares[i] || this.state.winner){
        return;
      }else{
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const [winner,winningSquares] = calculateWinner(squares);
        if(winner && (this.state.winner === null)){
          this.setState({
            winner: winner,
          });
          winningSquares.forEach(element => {
            currentHighlights[element] = true;
          });
        }
      }
      let [row, col] = this.getRowAndCol(i);
      this.setState({
        history: history.concat({
          squares: squares,
          row: row,
          col: col,
          hightlights: currentHighlights
        }),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    reverseIt(){
      this.setState({
        isAscending : !this.state.isAscending,
      })
    }
    render() {
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const [winner] = calculateWinner(current.squares);
      const moves = history.map((step, move) => {
      const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });     
      if(!this.state.isAscending)moves.reverse(); 
      let status;
      if (winner) {
          status = 'Winner: ' + winner;     
      }else if(this.state.moves === 9){
        status = 'DRAWWWW';
      } 
      else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares = {current.squares}
                  onClick = {(i) => this.handleClick(i)}
                  highlights= {current.hightlights}
                  />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={this.reverseIt}>{this.state.isAscending ? 'Descending' : 'Ascending' }</button>
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
        return [squares[a],lines[i]]
      }
    }
    return [null,null];
  }
  