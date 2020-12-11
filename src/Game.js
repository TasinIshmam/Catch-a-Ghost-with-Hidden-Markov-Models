import React from "react";
import Board from "./Board";
import {getRandomInt} from "./utils";

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        let boardProbabilities = initializeProbabilityDistribution(props.rows, props.cols);
        let boardIsClicked = initializeIsClickedBoard(props.rows, props.cols);

        let ghostPosRow = getRandomInt(0, props.rows - 1);
        let ghostPosCol = getRandomInt(0, props.cols - 1);

        this.state = {
            boardProbabilities, ghostPosRow, ghostPosCol, boardIsClicked,
            isGhostFound: false,
            attempts: 0,
            movesMade: 0,
            rows: props.rows,
            cols: props.cols
        }
    }

    initializeGame = (nextProps) => {
        let boardProbabilities = initializeProbabilityDistribution(nextProps.rows, nextProps.cols);
        let boardIsClicked = initializeIsClickedBoard(nextProps.rows, nextProps.cols);

        let ghostPosRow = getRandomInt(0, nextProps.rows - 1);
        let ghostPosCol = getRandomInt(0, nextProps.cols - 1);

        this.setState({
            boardProbabilities, ghostPosRow, ghostPosCol, boardIsClicked,
            isGhostFound: false,
            attempts: 0,
            movesMade: 0,
            rows: nextProps.rows,
            cols: nextProps.cols
        })
    }


    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps for Game.js. Nextprops: ", nextProps);
        console.log("State: ", this.state);
        this.initializeGame(nextProps)

    }

    handleBoardClick(row, col) {
        console.log(`Handle click called for ${row},${col}`);
    }

    handleAdvanceTime() {
        console.log("Advance time called");
    }


    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        boardProbabilities={this.state.boardProbabilities}  // the curly brackets are to imply that javascript code will go here
                        rows = {this.state.rows}
                        cols = {this.state.cols}
                        boardIsClicked = {this.state.boardIsClicked}
                        onClick={(row,col) => this.handleBoardClick(row,col)}
                    />
                </div>
                <div className="game-info">
                </div>
            </div>
        );
    }
}




function initializeProbabilityDistribution(rows, cols) {
    let ghostBoard = new Array(rows);

    let totalCells = rows * cols;
    let probabilityEachCell = 100 / totalCells;

    for (let i = 0; i < rows; i++) {
        ghostBoard[i] = new Array(cols)

        for (let j = 0; j < cols; j++) {
            ghostBoard[i][j] = +probabilityEachCell.toFixed(2); //crops the number to two digits after decimal.
        }
    }

    return ghostBoard;

}

function initializeIsClickedBoard(rows, cols) {
    let board = new Array(rows);

    for (let i = 0; i < rows; i++) {
        board[i] = new Array(cols)

        for (let j = 0; j < cols; j++) {
            board[i][j] = false;
        }
    }

    return board;
}

