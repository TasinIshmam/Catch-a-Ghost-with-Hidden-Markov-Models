import React from "react";
import Board from "./Board";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                xIsNext: true
            }],

            currentDisplayedMove: 0,
            rowsInputTest: props.rows,
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps for Game.js. Nextprops: ", nextProps);
        console.log("State: ", this.state);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
                xIsNext: true
            }],

            currentDisplayedMove: 0,
            rowsInputTest: nextProps.rows,
        }
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[this.state.currentDisplayedMove];
        const latestMove = history.length - 1;
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i] ) {  //winner decided
            return;
        }

        if (latestMove !== this.state.currentDisplayedMove) { //in preview mode. Can't click on buttons.
            return;
        }

        squares[i] = current.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                xIsNext: !current.xIsNext,
            }]),
            currentDisplayedMove: this.state.currentDisplayedMove + 1,
        });
    }

    jumpTo(move) {
        const history = this.state.history;

        this.setState({
            history : history,
            currentDisplayedMove : move
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.currentDisplayedMove];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?  //if move is 0 then returns go to game start
                'Go to move #' + move :
                'Go to game Start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
        }

        let currentlyDisplayedMode = this.state.currentDisplayedMove === this.state.history.length - 1 ?
            `Game current State ${this.state.rowsInputTest}` :
            `Previewing move ${this.state.currentDisplayedMove}`

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}  // the curly brackets are to imply that javascript code will go here.
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{currentlyDisplayedMode}</div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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
