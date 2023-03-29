'use strict'
const EMPTY = ''
const MINE = '💣'
var gBoard
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

function onInit() {
  gGame.isOn = true
  gBoard = createBoard(4, 4)
  renderBoard(gBoard)
  gLevel.SIZE = gBoard.length
  gLevel.MINES = gBoard.length / 2
  console.log(gBoard)
}

function renderBoard(mat) {
  var strHTML = '<table border="0" ><tbody>'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      const cell = mat[i][j]
      var inCell = cell.isMine ? MINE : cell.minesAroundCount
      const className = `cell-hidde cell-${i}-${j}`

      strHTML += `<td class="${className}" onClick="select(${i},${j})" >${inCell}</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'
  const elContainer = document.querySelector(`.board-container`)
  elContainer.innerHTML = strHTML
}

// function renderBoard(board) {
//   var strHTML = ''
//   for (var i = 0; i < board.length; i++) {
//     strHTML += '<tr>\n'
//     for (var j = 0; j < board[0].length; j++) {
//       const currCell = board[i][j]

//       var cellClass = getClassName({ i, j }) // 'cell-3-4'

//       if (currCell.isMine) cellClass += ' mine'
//       else if (!currCell.isMine) cellClass += ` num`

//       strHTML += `\t<td class="cell ${cellClass}"
//                                 onclick="moveTo(${i},${j})">`

//       if (!currCell.isMine) {
//         strHTML += currCell.minesAroundCount
//       } else if (currCell.isMine) {
//         strHTML += MINE
//       }
//       strHTML += '</td>\n'
//     }
//     strHTML += '</tr>\n'
//     // console.log('strHTML is:')
//     // console.log(strHTML)
//   }
//   const elBoard = document.querySelector('.board')
//   elBoard.innerHTML = strHTML
// }

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
function getClassName(position) {
  // {i:2 , j:5}
  const cellClass = `cell-${position.i}-${position.j}` // 'cell-2-5'
  return cellClass
}
