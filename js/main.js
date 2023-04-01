'use strict'
const EMPTY = ''
const MINE = '💣'
var gBoard
var gCountTimesClicked
var gLevel = {
  SIZE: 0,
  MINES: 0,
}
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isClicked: false,
}
var gElMinesLeft = document.querySelector('.mines-left span')
var gElImoji = document.querySelector('.imoji')

function onInit() {
  gGame.isOn = true
  gBoard = createBoard(4, 4)
  gLevel.SIZE = gBoard.length
  gLevel.MINES = countMinesInBoard()
  gElMinesLeft.innerHTML = gLevel.MINES
  renderBoard(gBoard)
  console.log(gBoard)
  gCountTimesClicked = 0
  closeModal()
  // if (gCountTimesClicked >= 1) createTimer()
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
  const selectedIndexes = []
  for (var i = 0; i < ROWS / 2; i++) {
    randRowIdx = getRandomInt(0, ROWS)
    randCollIdx = getRandomInt(randRowIdx, ROWS)
    if (
      selectedIndexes.findIndex(
        ([row, col]) => row === randRowIdx && col === randCollIdx
      ) > -1
    ) {
      i--
      continue
    }
    selectedIndexes.push([randRowIdx, randCollIdx])
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
  // console.log(`${countMines} mines`)
  return countMines
}

function onCellRightClicked(elCell, i, j) {
  if (gGame.isOn === false) return
  const cell = gBoard[i][j]
  if (cell.isShown === false && cell.isMarked === false) {
    gGame.markedCount++
    gLevel.MINES--
    gElMinesLeft.innerHTML = gLevel.MINES
    renderCell({ i, j }, '🚩')
    cell.isMarked = true
  } else if (cell.isShown === false && cell.isMarked === true) {
    gGame.markedCount--
    gLevel.MINES++
    gElMinesLeft.innerHTML = gLevel.MINES
    renderCell({ i, j }, '')
    cell.isMarked = false
  }
  console.log(gGame.markedCount)
}

function onCellClicked(elCell, i, j) {
  gGame.isClicked = true
  if (gCountTimesClicked === 0) createTimer()
  const cell = gBoard[i][j]
  if (!gGame.isOn) return
  if (cell.isMarked) return
  // console.log(elCell)
  gCountTimesClicked++
  if (cell.isMine && gCountTimesClicked < 2) return
  else if (cell.isMine && gCountTimesClicked >= 2) {
    gameOver()
    gGame.isOn = false
    gElImoji.textContent = '😭'
    openModal(`Game Over`)

    return
  } else onGamePlay(i, j, cell)
}

function gameOver() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        var location = { i, j }
        renderCell(location, MINE)
      }
    }
  }
}

function onGamePlay(i, j, cell) {
  const inCell = cell.minesAroundCount
  if (cell.minesAroundCount !== 0) {
    renderCell({ i, j }, inCell)
    gGame.shownCount++
    cell.isShown = true
  } else if (cell.minesAroundCount === 0) {
    gGame.shownCount++
    cell.isShown = true
    renderCell({ i, j }, 0)
    showNegsAroundZero(i, j)
  }
  console.log(gGame.shownCount)
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
      gGame.shownCount++
    }
  }
}

function checkVictory() {
  const mines = countMinesInBoard()
  if (gBoard.length * gBoard[0].length - mines === gGame.shownCount) {
    gGame.isOn = false
    if (gGame.markedCount !== mines) {
      openModal(`You actually coulve won but didnt mark the mines`)
    } else {
      gElImoji.textContent = '😀'
      openModal('Victory!!!')
    }
  }
}

function openModal(msg) {
  const elModal = document.querySelector('.modal')
  const elSpan = elModal.querySelector('.msg')
  elSpan.innerText = msg
  elModal.style.display = 'block'
}

function closeModal() {
  gGame.isOn = true
  const elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
  gGame.markedCount = 0
  gGame.shownCount = 0
  gCountTimesClicked = 0
  var elTimerDiv = document.querySelector('.timer')
  elTimerDiv.textContent = `00:00`
  gElImoji.textContent = '😶'
}

function createTimer() {
  var elTimerDiv = document.querySelector('.timer')

  var startTime = Date.now() // get the current time in milliseconds
  var timer = setInterval(function () {
    if (!gGame.isOn) {
      // stop the timer if gGame.isOn is false
      clearInterval(timer)
      console.log('Timer stopped.')
      return
    }

    var elapsedTime = Date.now() - startTime
    var seconds = Math.floor(elapsedTime / 1000)
    var minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    var displayMinutes = (minutes < 10 ? '0' : '') + minutes.toString()
    var displaySeconds = (seconds < 10 ? '0' : '') + seconds.toString()
    var displayTime = displayMinutes + ':' + displaySeconds
    elTimerDiv.textContent = displayTime
  }, 1000)
}
