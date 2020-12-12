import React from "react";
import Board from "./Board";
import GameControls from "./GameControls";
import { calculateManhattanDistance, getRandomInt } from "./utils";
import * as hmm from "./hmm"; 

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        let boardProbabilities = initializeProbabilityDistribution(props.rows, props.cols);
        let boardManhattanDistanceArray = initializeBoardManhattanDistanceArray(props.rows, props.cols);

        let ghostPosRow = getRandomInt(0, props.rows - 1);
        let ghostPosCol = getRandomInt(0, props.cols - 1);

        this.state = {
            boardProbabilities, ghostPosRow, ghostPosCol, boardManhattanDistanceArray,
            isGhostFound: false,
            attempts: 0,
            movesMade: 0,
            rows: props.rows,
            cols: props.cols
        }
    }

    initializeGame = (nextProps) => {
        let boardProbabilities = initializeProbabilityDistribution(nextProps.rows, nextProps.cols);
        let boardManhattanDistanceArray = initializeBoardManhattanDistanceArray(nextProps.rows, nextProps.cols);

        let ghostPosRow = getRandomInt(0, nextProps.rows - 1);
        let ghostPosCol = getRandomInt(0, nextProps.cols - 1);

        this.setState({
            boardProbabilities, ghostPosRow, ghostPosCol, boardManhattanDistanceArray,
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
        let manhattanDistance = calculateManhattanDistance(row, col, this.state.ghostPosRow, this.state.ghostPosCol);

        let manhattanDistanceArray = this.state.boardManhattanDistanceArray;
        manhattanDistanceArray[row][col] = manhattanDistance;

        //todo update probability distribution

        this.setState({
            manhattanDistanceArray
        })
        
    }

    handleAdvanceTime() {
        console.log("Advance time called");
    }

    handleRevealGhost() {
        console.log(`Ghost is located in (${this.state.ghostPosRow},${this.state.ghostPosCol})`);
    }

    handleCatchGhost() {
        console.log("Catch ghost handler called");
    }


    render() {

        let victoryMessage = this.state.isGhostFound === true? "You Found the ghost!" : "";

        return (
            <div className="game container">
                <div className="game-board row">
                    <div className="col-12">
                        <Board
                            boardProbabilities={this.state.boardProbabilities}  // the curly brackets are to imply that javascript code will go here
                            rows={this.state.rows}
                            cols={this.state.cols}
                            boardManhattanDistanceArray={this.state.boardManhattanDistanceArray}
                            onClick={(row, col) => this.handleBoardClick(row, col)}
                        />
                    </div>
                </div>

                <div className="game-controls row">
                    <div className="col-12">
                        <GameControls 
                            onClickAdvanceTime={() => this.handleAdvanceTime()}
                            onClickRevealGhost={() => this.handleRevealGhost()}
                            onClickCatchGhost={() => this.handleCatchGhost()}
                            />
                    </div>

                </div>

                <div className="game-info row">
                    <div className="col-12">
                        {victoryMessage}
                    </div>

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

function initializeBoardManhattanDistanceArray(rows, cols) {
    let board = new Array(rows);

    for (let i = 0; i < rows; i++) {
        board[i] = new Array(cols)

        for (let j = 0; j < cols; j++) {
            board[i][j] = -1;
        }
    }

    return board;
}

