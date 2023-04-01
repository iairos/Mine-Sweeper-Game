'use strict'
const EMPTY = ''
const MINE = '💣'
var gBoard
var gCountTimesClicked
var gShownCount
var gIsMark
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
var gElMinesLeft = document.querySelector('h3 span')

gElMinesLeft.innerHTML = gLevel.MINES

function onInit() {
  gGame.isOn = true
  gBoard = createBoard(4, 4)
  gLevel.SIZE = gBoard.length
  gLevel.MINES = gBoard.length / 2
  renderBoard(gBoard)
  console.log(gBoard)
  gCountTimesClicked = 0
  gShownCount = 0
  gIsMark = 0
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
function setMinePos(board, ROWS) {
  var randRowIdx
  var randCollIdx
  for (var i = 0; i < ROWS / 2; i++) {
    randRowIdx = getRandomInt(0, ROWS)
    randCollIdx = getRandomInt(randRowIdx, ROWS)
    board[randRowIdx][randCollIdx].isMine = true
  }
}

function countMinesInBoard() {
  var countMines = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) countMines++
    }
  }
  return countMines
}

function onCellRightClicked(elCell, i, j) {
  if (gGame.isOn === false) return
  const cell = gBoard[i][j]
  if (cell.isShown === false && cell.isMarked === false) {
    gIsMark++
    gLevel.MINES--
    gElMinesLeft.innerHTML = gLevel.MINES
    renderCell({ i, j }, '🚩')
    cell.isMarked = true
    console.log(gIsMark)
  } else if (cell.isShown === false && cell.isMarked === true) {
    gIsMark--
    gLevel.MINES++
    gElMinesLeft.innerHTML = gLevel.MINES
    renderCell({ i, j }, '')
    cell.isMarked = false
    console.log(gIsMark)
  }
}

function onCellClicked(elCell, i, j) {
  const cell = gBoard[i][j]
  if (!gGame.isOn) return
  if (cell.isMarked) return
  // console.log(elCell)
  gCountTimesClicked++
  if (cell.isMine && gCountTimesClicked < 2) return
  else if (cell.isMine && gCountTimesClicked >= 2) {
    gameOver()
    gGame.isOn = false
    return
  } else onGamePlay(i, j, cell)
  console.log(gBoard, gShownCount)
}

function gameOver() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      // if (gBoard[i][j].isMarked) continue
      // var cellEl = document.querySelectorAll(`.cell-${i}-${j}`)
      // cellEl.style.backgroundColor = 'red'
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
    gShownCount++
    cell.isShown = true
  } else if (cell.minesAroundCount === 0) {
    gShownCount++
    cell.isShown = true
    renderCell({ i, j }, 0)
    showNegsAroundZero(i, j)
  }
  checkVictory()
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

function showNegsAroundZero(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      var cell = gBoard[i][j]
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (cell.isMine === true) continue
      if (cell.isMarked || cell.isShown) continue
      renderCell({ i, j }, cell.minesAroundCount)
      cell.isShown = true
      gShownCount++
    }
  }
}

function checkVictory() {
  const mines = countMinesInBoard()
  if (gIsMark === mines) {
    if (gBoard.length * gBoard[0].length - gIsMark === gShownCount) {
      gGame.isOn = false
      console.log('victory!!!!!!')
    }
  }
}

// function checkVictory() {
//   let numRevealed = 0
//   let numMines = countMinesInBoard()
//   for (let i = 0; i < gBoard.length; i++) {
//     for (let j = 0; j < gBoard[i].length; j++) {
//       const cell = gBoard[i][j]
//       if (cell.isShown && !cell.isMine) {
//         numRevealed++
//       }
//     }
//   }
//   return numRevealed === gBoard.length * gBoard[0].length - numMines
// }
// function createTimer() {
//   let seconds = 0
//   let timerDiv = document.createElement('div')
//   document.body.appendChild(timerDiv)

//   setInterval(function () {
//     seconds++
//     timerDiv.textContent = 'Elapsed time: ' + seconds + ' seconds'
//   }, 1000)
// }
