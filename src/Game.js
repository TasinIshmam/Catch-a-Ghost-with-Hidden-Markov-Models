import React from "react";
import Board from "./Board";
import GameControls from "./GameControls";
import { calculateManhattanDistance, getRandomInt } from "./utils";

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
            cols: props.cols,
            distanceMedium: props.distanceMedium,
            distanceFar: props.distanceFar,
            displayMessage: "",
            catchMode: false,
            lateralProb: props.lateralProb,
            diagonalProb: props.diagonalProb,
            stayProb: props.stayProb
        }
    }

    initializeGame = (props) => {
        let boardProbabilities = initializeProbabilityDistribution(props.rows, props.cols);
        let boardManhattanDistanceArray = initializeBoardManhattanDistanceArray(props.rows, props.cols);

        let ghostPosRow = getRandomInt(0, props.rows - 1);
        let ghostPosCol = getRandomInt(0, props.cols - 1);

        this.setState({
            boardProbabilities, ghostPosRow, ghostPosCol, boardManhattanDistanceArray,
            isGhostFound: false,
            attempts: 0,
            movesMade: 0,
            rows: props.rows,
            cols: props.cols,
            distanceMedium: props.distanceMedium,
            distanceFar: props.distanceFar,
            displayMessage: "",
            catchMode: false,
            lateralProb: props.lateralProb,
            diagonalProb: props.diagonalProb,
            stayProb: props.stayProb

        })
    }

    setDisplayMessage(message) {
        this.setState({
            displayMessage: message
        })
    }


    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps for Game.js. Nextprops: ", nextProps);
        console.log("State: ", this.state);
        this.initializeGame(nextProps)

    }


    handleBoardClick(row, col) {
        console.log(`Handle click called for ${row},${col}`);

        if (this.state.isGhostFound) {
            return;
        }

        if (this.state.catchMode) {
            if (row === this.state.ghostPosRow && col === this.state.ghostPosCol) {
                alert("Ghost caught successfully. Game over.");

                this.setState({
                    catchMode: false,
                    isGhostFound: true,
                    displayMessage: `Ghost found in cell (${row},${col})`
                })
            } else {
                alert("The ghost was not in that cell! Try again")

                this.setState({
                    catchMode: false
                })
            }

            return;
        }
        let manhattanDistance = calculateManhattanDistance(row, col, this.state.ghostPosRow, this.state.ghostPosCol);

        let manhattanDistanceArrayCopy = JSON.parse(JSON.stringify(this.state.boardManhattanDistanceArray));
        manhattanDistanceArrayCopy[row][col] = manhattanDistance;

        let noGhostLowerBound = 0;
        let noGhostUpperBound = 0;

        let boardProbabilitiesUpdated = this.state.boardProbabilities;

        if (manhattanDistance > this.state.distanceFar) { //green. No ghost within cell to distanceFar
            boardProbabilitiesUpdated = updateProbabilitiesBasedOnSensorReadingGreen(this.state.boardProbabilities, row, col, this.state.distanceFar);
        } else if (manhattanDistance >= this.state.distanceMedium && manhattanDistance <= this.state.distanceFar) {
            boardProbabilitiesUpdated = updateProbabilitiesBasedOnSensorReadingOrange(this.state.boardProbabilities, row, col, this.state.distanceMedium, this.state.distanceFar);
        } else {
            //TODO handling that one weird corner case which leads to NAN
            boardProbabilitiesUpdated = updateProbabilitiesBasedOnSensorReadingRed(this.state.boardProbabilities, row, col, this.state.distanceMedium - 1);
        }


        boardProbabilitiesUpdated = normalizeBoardProbabilities(boardProbabilitiesUpdated);
        //todo update probability distribution

        this.setState({
            boardManhattanDistanceArray: manhattanDistanceArrayCopy,
            boardProbabilities: boardProbabilitiesUpdated
        })

    }


    handleAdvanceTime() {
        console.log("Advance time called");

        if (this.state.isGhostFound) {
            return;
        }

        let boardProbabilitiesUpdated = updateBoardProbabilitiesBasedonGhostMovement(this.state.boardProbabilities, this.state.lateralProb, this.state.diagonalProb, this.state.stayProb);

        let boardManhattanDistanceArrayUpdated = initializeBoardManhattanDistanceArray(this.state.rows, this.state.cols);

        let newGhostPos = this.simulateRandomGhostMovement(this.state.boardProbabilities, this.state.ghostPosRow, this.state.ghostPosCol);


        this.setState({
            boardProbabilities: boardProbabilitiesUpdated,
            boardManhattanDistanceArray: boardManhattanDistanceArrayUpdated,
            ghostPosRow: newGhostPos.row,
            ghostPosCol: newGhostPos.col
        })
    }

    simulateRandomGhostMovement(board, ghostPosRow, ghostPosCol) {
        let randomProb = Math.random();


        let lateralMoves = findAllLateralMoves(board, ghostPosRow, ghostPosCol);
        let diagonalMoves = findAllDiagonalMoves(board, ghostPosRow, ghostPosCol);

        let newGhostPos = lateralMoves[0]; //backup safety option

        if (randomProb < this.state.stayProb) { //go for staying.

            newGhostPos = {row: ghostPosRow, col: ghostPosCol}
        } else if (randomProb < this.state.diagonalProb + this.state.stayProb) { //go for diagonal move
            //pick random item from array
            newGhostPos = diagonalMoves[Math.floor(Math.random() * diagonalMoves.length)]; 
        } else { //go for lateral move
            newGhostPos = lateralMoves[Math.floor(Math.random() * lateralMoves.length)];
        }

        return newGhostPos;
    }

    handleRevealGhost() {
        console.log(`Ghost is located in (${this.state.ghostPosRow},${this.state.ghostPosCol})`);

        if (this.state.isGhostFound) {
            return;
        }

        alert(`Ghost is located in (${this.state.ghostPosRow},${this.state.ghostPosCol})`);

    }

    handleCatchGhost() {
        if (this.state.isGhostFound) {
            return;
        }

        console.log("Catch ghost handler called");
        // alert("Click on a cell to try and catch the ghost");
        this.setState({
            catchMode: true
        })

    }


    render() {


        let info = "";

        if (this.state.isGhostFound) {
            info = this.state.displayMessage || "Ghost has been found";

        } else {
            info = this.state.catchMode === true ? "Catch Mode" : "Sensor Mode";
        }



        return (
            <div className="game container vertical-hack">
                <div className="game-mode row">
                    <div className="col-12">
                        {info}
                    </div>
                </div>
                <div className="game-board row">
                    <div className="col-12">
                        <Board
                            boardProbabilities={this.state.boardProbabilities}  // the curly brackets are to imply that javascript code will go here
                            rows={this.state.rows}
                            cols={this.state.cols}
                            boardManhattanDistanceArray={this.state.boardManhattanDistanceArray}
                            onClick={(row, col) => this.handleBoardClick(row, col)}
                            distanceMedium={this.state.distanceMedium}
                            distanceFar={this.state.distanceFar}
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


// if (x,y) has manhattan distance of 3. then for all neighbours with 0-2 manhattan distance, probability of ghost is 0.
// row, col == cell for which sensor reading was taken.

function updateProbabilitiesBasedOnSensorReadingGreen(boardProbabilities, row, col, noGhostRangeUpperThreshold) {

    for (let i = 0; i < boardProbabilities.length; i++) {
        for (let j = 0; j < boardProbabilities[i].length; j++) {
            let manhattanDistanceToSensorCell = calculateManhattanDistance(row, col, i, j);
            if (manhattanDistanceToSensorCell <= noGhostRangeUpperThreshold) {
                boardProbabilities[i][j] = 0;
            }
        }
    }

    return boardProbabilities;
}

function updateProbabilitiesBasedOnSensorReadingOrange(boardProbabilities, row, col, ghostRangeLowerThreshold, ghostRangeUpperThreshold) {

    for (let i = 0; i < boardProbabilities.length; i++) {
        for (let j = 0; j < boardProbabilities[i].length; j++) {
            let manhattanDistanceToSensorCell = calculateManhattanDistance(row, col, i, j);

            if (!(ghostRangeLowerThreshold <= manhattanDistanceToSensorCell && manhattanDistanceToSensorCell <= ghostRangeUpperThreshold)) {

                boardProbabilities[i][j] = 0;
            }
        }
    }

    return boardProbabilities;
}


function updateProbabilitiesBasedOnSensorReadingRed(boardProbabilities, row, col, ghostConfirmedUpperThreshold) {

    for (let i = 0; i < boardProbabilities.length; i++) {
        for (let j = 0; j < boardProbabilities[i].length; j++) {
            let manhattanDistanceToSensorCell = calculateManhattanDistance(row, col, i, j);
            if (manhattanDistanceToSensorCell > ghostConfirmedUpperThreshold) {
                boardProbabilities[i][j] = 0;
            }
        }
    }

    return boardProbabilities;
}

function findAllLateralMoves(board, row, col) {
    let lateralMoves = [];

    if (row !== 0) {
        lateralMoves.push({ row: row - 1, col: col })
    }

    if (row !== board.length - 1) {
        lateralMoves.push({ row: row + 1, col: col })
    }

    if (col !== 0) {
        lateralMoves.push({ row: row, col: col - 1 })
    }

    if (col !== board[row].length - 1) {
        lateralMoves.push({ row: row, col: col + 1 })
    }

    return lateralMoves;
}


function findAllDiagonalMoves(board, row, col) {
    let diagonalMoves = [];

    if (row !== 0 && col !== 0) {
        diagonalMoves.push({ row: row - 1, col: col - 1 });
    }

    if (row !== board.length - 1 && col !== board[row].length - 1) {
        diagonalMoves.push({ row: row + 1, col: col + 1 })
    }

    if (row !== 0 && col !== board[row].length - 1) {
        diagonalMoves.push({ row: row - 1, col: col + 1 })
    }

    if (row !== board.length - 1 && col !== 0) {
        diagonalMoves.push({ row: row + 1, col: col - 1 })

    }

    return diagonalMoves;

}

function updateBoardProbabilitiesBasedonGhostMovement(board, lateralMovementProb, diagonalMovementProb, stayInplaceProb) {
    let board_original_copy = JSON.parse(JSON.stringify(board));

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let lateralMoves = findAllLateralMoves(board, row, col);
            let diagonalMoves = findAllDiagonalMoves(board, row, col);

            // console.log(`Lateral moves for ${row},${col} is ${lateralMoves.length}`);
            // console.log(`Diagonal moves for ${row},${col} is ${diagonalMoves.length}`);

            board[row][col] = board[row][col] * stayInplaceProb ;  //resetting probability

            for (let i = 0; i < lateralMoves.length; i++) {

                let neighbourPos = lateralMoves[i];

                let probEachLateralMove = lateralMovementProb / findAllLateralMoves(board, neighbourPos.row, neighbourPos.col).length;

                let probOfComingToCellFromNeighbor = board_original_copy[neighbourPos.row][neighbourPos.col] * probEachLateralMove;
                board[row][col] += probOfComingToCellFromNeighbor;
            }


            for (let i = 0; i < diagonalMoves.length; i++) {

                let neighbourPos = diagonalMoves[i];

                let probEachDiagonalMove = diagonalMovementProb / findAllDiagonalMoves(board, neighbourPos.row, neighbourPos.col).length;

                let probOfComingToCellFromNeighbor = board_original_copy[neighbourPos.row][neighbourPos.col] * probEachDiagonalMove;
                board[row][col] += probOfComingToCellFromNeighbor;
            }

            // lateralMoves.forEach((item, idx) => {   board[row][col] += board_original_copy[item.row][item.col]  * probEachLateralMove     })

            // diagonalMoves.forEach((item, idx) => {   board[row][col] += board_original_copy[item.row][item.col]  * probEachDiagonalMove     })
        }

    }

    if (!isBoardNormalized(board)) {
        console.error("normalizeBoardProbabilities: Error in normalizing board");
    }

    return board;
}



//ensure board probabilities sum to 0
function normalizeBoardProbabilities(boardProbabilities) {
    let sum = 0;

    for (let i = 0; i < boardProbabilities.length; i++) {
        for (let j = 0; j < boardProbabilities[i].length; j++) {
            sum += boardProbabilities[i][j];
        }
    }

    let multiplier = 100 / sum;

    for (let i = 0; i < boardProbabilities.length; i++) {
        for (let j = 0; j < boardProbabilities[i].length; j++) {
            boardProbabilities[i][j] = boardProbabilities[i][j] * multiplier;
        }
    }

    if (!isBoardNormalized(boardProbabilities)) {
        console.error("normalizeBoardProbabilities: Error in normalizing board");
    }

    return boardProbabilities;
}

function isBoardNormalized(boardProbabilities) {
    let sum = 0;

    for (let i = 0; i < boardProbabilities.length; i++) {
        for (let j = 0; j < boardProbabilities[i].length; j++) {
            sum += boardProbabilities[i][j];
        }
    }

    console.log("IsBoardNormalized Value: ", sum);
    return Math.abs(sum - 100) < 1;
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

