'use strict'
const EMPTY = ''
const MINE = '💣'
const EL_MINES_LEFT = document.querySelector('h3 span')
var gBoard
var gCounter

var gLevel = {
  SIZE: 4,
  MINES: 2,
}
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
EL_MINES_LEFT.innerHTML = gLevel.MINES

function onInit() {
  gGame.isOn = true
  gBoard = createBoard(4, 4)
  // renderBoard(gBoard)
  renderBoard(gBoard)
  gLevel.SIZE = gBoard.length
  gLevel.MINES = gBoard.length / 2
  console.log(gBoard)
  gCounter = 0
}

function createBoard(ROWS, COLS) {
  const board = []
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push({
        coardinate: { i, j },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      })
    }
    board.push(row)
  }
  setMinePos(board, ROWS)
  setMinesNegsCount(board)
  return board
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return
  console.log(elCell)

  // onRightClick(ev)
  gCounter++
  console.log(gCounter)
  const cell = gBoard[i][j]
  if (cell.isMine && gCounter < 2) return
  else if (cell.isMine && gCounter >= 2) {
    gameOver()
    gGame.isOn = false
    return
  } else onGamePlay(i, j, cell)
  console.log(gBoard)
}

// function onRightClick(event){
//   if(event.key)
// }

function gameOver() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        var location = { i, j }
        renderCell(location, MINE)
        // gBoard[i][j].isShown = true
      }
    }
  }
  console.log(`Game Over`)
}

function onGamePlay(i, j, cell) {
  const inCell = cell.minesAroundCount
  if (cell.minesAroundCount !== 0) {
    renderCell({ i, j }, inCell)
    cell.isShown = true
  } else if (cell.minesAroundCount === 0) {
    countNegsAroundZero(i, j)
  }
}
// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function setMinesNegsCount(board) {
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell.isMine) return
      cell.minesAroundCount = countNegs(board, i, j)
    })
  )
}

function countNegs(mat, rowIdx, colIdx) {
  var negsCount = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue
      if (i === rowIdx && j === colIdx) continue
      if (mat[i][j].isMine) negsCount++
    }
  }
  return negsCount
}

function countNegsAroundZero(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      var cell = gBoard[i][j]
    }
  }
}
