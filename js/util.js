'use strict'

function renderBoard(mat) {
  var strHTML = '<table border="0"><tbody>'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      const cell = mat[i][j]
      const className = getClassName({ i, j })
      // var mineClass = cell.isMine ? ' mine' : ''
      strHTML += `<td  onclick="onCellClicked(this,${i},${j})" oncontextmenu=" onCellRightClicked(this, ${i}, ${j});return false;" class=" ${className}">${EMPTY}</td>`
      // const elCell = document.querySelector(`.${className}`)
      // console.log(elCell)
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'
  const elContainer = document.querySelector(`.board-container`)
  elContainer.innerHTML = strHTML
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
function getClassName(position) {
  // {i:2 , j:5}
  const cellClass = `cell cell-${position.i}-${position.j}` // 'cell-2-5'
  return cellClass
}
