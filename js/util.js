'use strict'
function createBoard(ROWS, COLS) {
  const board = []
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push({
        cell: { i, j },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      })
    }
    board.push(row)
  }
  var randRowIdx
  var randCollIdx
  for (var i = 0; i < ROWS / 2; i++) {
    randRowIdx = getRandomInt(0, ROWS)
    randCollIdx = getRandomInt(randRowIdx, ROWS)
    board[randRowIdx][randCollIdx].isMine = true
  }
  setMinesNegsCount(board)
  return board
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
