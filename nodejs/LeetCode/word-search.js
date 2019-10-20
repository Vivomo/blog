/**
 Given a 2D board and a word, find if the word exists in the grid.

 The word can be constructed from letters of sequentially adjacent cell, where "adjacent" cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once.

 Example:

 board =
 [
 ['A','B','C','E'],
 ['S','F','C','S'],
 ['A','D','E','E']
 ]

 Given word = "ABCCED", return true.
 Given word = "SEE", return true.
 Given word = "ABCB", return false.
 */
/**
 * @param {[][]} board
 * @param {string} word
 * @return {boolean}
 */
let exist = function(board, word) {
    let letterIndex = 0;
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        let row = board[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            if (row[colIndex] === word[letterIndex]) {
                letterIndex++;
                if (letterIndex > word.length) {
                    return true;
                }
            }
        }
    }
    return false;
};

let board =
    [
        ['A','B','C','E'],
        ['S','F','C','S'],
        ['A','D','E','E']
    ];

console.log(exist(board, 'ABCCED'));
console.log(exist(board, 'SEE'));
console.log(exist(board, 'ABCB'));


// TODO
