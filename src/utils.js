

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */


export function getRandomInt(min, max) {
    let minVal = Math.ceil(min);
    let maxVal = Math.floor(max);
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

export function calculateManhattanDistance(row1,col1,row2,col2) {
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}
