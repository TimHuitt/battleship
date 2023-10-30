

//*----- constants -----*//

// list all player cells and thier state
// 1 = occupied
// 0 = empty
// -1 = hit
const playerState = {
  // active ships and their location
  ships: {}
}

// list all opponent cells and thier state
const opponentState = {
  ships: {}
}

// list of ship types and their cell length
const ships = {
  destroyer: 2,
  sub: 3,
  cruiser: 3,
  battleship: 4,
  carrier: 5,
}

//*----- state variables -----*//

let activeBoard
let isWinner

//*----- cached elements  -----*//

const opponentBoardEl = document.querySelector('#opponent-board')
const largeBoardEl = document.querySelector('#large-board-wrapper')
const playerBoardEl = document.querySelector('#player-board')
const playerShipsEl = document.querySelector('#player-ships-wrapper')
const playerShips = document.querySelectorAll('#player-ships-wrapper > div')


//*----- event listeners -----*//

largeBoardEl.addEventListener('click', handleBoardEvent)
largeBoardEl.addEventListener('mouseover', handleBoardEvent)
largeBoardEl.addEventListener('mouseleave', handleBoardEvent)

playerShipsEl.addEventListener('click', handleShipEvent)
playerShipsEl.addEventListener('mouseover', handleShipEvent)
playerShipsEl.addEventListener('mouseleave', handleShipEvent)

//*----- classes -----*//

// create new cells with the passed id, class, and inner text
class CreateCell {
  constructor(id, cls, text='') {
    this.el = document.createElement('div')
    this.el.setAttribute('id', id)
    this.el.classList.add(cls)
    this.el.classList.add('center')
  }
}

//*----- initialization -----*//

init()

function init() {
  activeBoard = 'player-board'
  isWinner = false;
  // render player
  renderBoard(playerBoardEl)
  renderPlayerShips()
  // render opponent
  renderBoard(opponentBoardEl)


  // todo: remove manual gameplay
  setShip('carrier', 'b5', 'w')
  setShip('battleship', 'f8', 'n')
  setShip('cruiser', 'g4', 's')
  setShip('sub', 'i9', 'w')
  setShip('destroyer', 'f6', 'n')

  setTurn()
  
  setComputerBoard()

}



function setTurn() {
  activeBoard = (activeBoard === 'player-board') ? 'opponent-board' : 'player-board'
}

function renderPlayerShips() {
  let count = 0
  for (const ship in ships) {
    parent = playerShips[count]
    id = ship
    cells = ships[ship]
    
    for (let i = 0; i < cells; i++) {
      const cell = new CreateCell(ship + '_' + id, 'ship')
      parent.appendChild(cell.el)
    }

    count++
  }
}

function renderBoard(e) {
  row = 97
  currentCol = 1
  for (let i = 1; i <= 100; i++) {
    currentRow = String.fromCharCode(row)
    let pos = currentRow + currentCol
    const cell = new CreateCell(pos, 'cell', pos)
    e.appendChild(cell.el)

    if (e.id === 'player-board') {
      playerState[pos] = 0
    } else if (e.id === 'opponent-board') {
      opponentState[pos] = 0
    }
    if (!(i % 10)) { 
      row++
      currentCol -= 10
    }
    currentCol++
  }
}

//*----- handlers -----*//

function handleBoardEvent(e) {
  if (e.type === 'click') fire(e) // !
  if (e.type === 'mouseover' && !e.target.id.includes('board')) {
    renderCellHighlights(1, e)
  }
  if (e.type === 'mouseleave') {
    renderCellHighlights(0, e)
  }
  
}

function handleShipEvent(e) {
  if (!e.target.id.includes('wrapper')) {
    if (e.type === 'mouseover') {

      clearShipHighlights()

      const el = document.querySelector(`#${e.target.id}`)
      el.classList.add('over')
    }
    if (e.type === 'click') {
      console.log(e.target.id)
    }
  }

  if (e.type === 'mouseleave') {
    clearShipHighlights()
  }

  function clearShipHighlights() {
    for (const ship in ships) {
      const el = document.querySelector(`#player-${ship}`)
      el.classList.remove('over')
    }
  }
}

//*----- rendering -----*//

// row and column highlight on hover
// type: 1/0 = add/remove
// e = event
function renderCellHighlights(type, e) {
  const boardCells = document.querySelectorAll('.cell')
  const currentRow = e.target.id.split('')[0]
  const currentCol = e.target.id.slice(1)

  // type = 1: add row/col highlighting
  if (type) {
    renderCellHighlights(0, e)
    boardCells.forEach((cell) => {
      if (cell.parentElement.id === activeBoard &&
          (cell.id.includes(currentRow) ||
          cell.id.includes(currentCol))) {

        // exclude col 10 highlighting if currencol is 1
        if (cell.id.slice(1) === '10' &&
            currentCol === '1' &&
            cell.id.split('')[0] !== currentRow) {
              return
        }
        cell.classList.add('row-col-highlight')
      }
    })

  // type = 0: remove all row/col highlighting
  } else {
    boardCells.forEach((cell) => {
      cell.classList.remove('row-col-highlight')
    })
  }
}

//*----- setters -----*//



// set set board ship data
// directions: n, e, s, w
// ([ship name], [grid position], [direction letter])
// (str, str, str)
// ('battleship', 'i9', 'n')
function setShip(ship, cell, direction) {
  const currentCell = document.querySelector(`#${activeBoard} #${cell}`)
  let currentRow = cell.split('')[0]
  let currentCol = parseInt(cell.slice(1))
  let currentChar = currentRow.charCodeAt(0) // a - j: 97 - 106
  let cellRange = []
  let nextCellEl
  let nextCell

  let valid = isValid(ship, direction, currentChar, currentCol)
  if (!valid) return console.log(activeBoard, ship, direction, String.fromCharCode(currentChar) + currentCol, "invalid placement")

  if (activeBoard === 'player-board') {
    currentCell.classList.add('placed')
    playerState[cell] = 1
  } else {
    currentCell.classList.add('placed')
    opponentState[cell] = 1
  }

  cellRange.push(cell)

  // check if ship fits within boundries
  // add each new cell to board state 
  // based on selected ship, start cell, and direction
  for (let i = 0; i < ships[ship] - 1; i++) {
    if (direction === 'n') {
        currentChar -= 1
    } else if (direction === 'e') {
        currentCol += 1
    } else if (direction === 's') {
        currentChar += 1
    } else if (direction === 'w') {
        currentCol -= 1
    }

    currentRow = String.fromCharCode(currentChar)
    nextCell = `${currentRow}${currentCol}`
    cellRange.push(nextCell)

    if (activeBoard === 'player-board') {
      playerState[nextCell] = 1
      nextCellEl = document.querySelector(`#${activeBoard} #${nextCell}`)
      nextCellEl.classList.add('placed')
    } else {
      opponentState[nextCell] = 1
      nextCellEl = document.querySelector(`#${activeBoard} #${nextCell}`)
      nextCellEl.classList.add('placed')
    }

  }
  if (activeBoard === 'player-board') {
    playerState['ships'][ship] = cellRange
  } else {
    opponentState['ships'][ship] = cellRange
  }
}

// check if ship orientation is valid
// ([ship name], [direction letter], [row char number], [column number])
// (str, str, int, int)
// ('battleship', 's', 97, 4)
function isValid(ship, dir, row, col) {
  if (!ship || !dir || !row || !col) return false

  if (dir == 'n' && row - ships[ship] + 1 < 97) {
    return false
  } else if (dir == 'e' && col + ships[ship] - 1 > 10) {
    return false
  } else if (dir == 's' && row + ships[ship] - 1 > 106) {
    return false
  } else if (dir == 'w' && col - ships[ship] + 1 < 1) {
    return false
  }

  return true
}

// todo: complete function
// check current ship location for overlap
// ([ship name], [direction letter], [row char number], [column number])
// (str, str, int, int)
// ('battleship', 's', 97, 4)
function isOverlap(ship, dir, row, col) {
  const cell = row + col
  for (let i = 0; i < ships[ship]; i++) {
  }

  if (activeBoard === 'player-board') {
    if (playerState[cell] > 0) return false
  } else {
    if (opponentState[cell] > 0) return false
  }
}



// randomly search ship starting positions
// set ship if position is valid
function setComputerBoard() {
  for (let ship in ships) {
    let valid = false
    let overlap = false

    while (!valid && !overlap) {
      let randomRow = Math.floor(Math.random() * (106-97) + 97)
      let randomCol = Math.floor(Math.random() * (10 - 1) + 1)
      let randomDir = ['n', 'e', 's', 'w'][Math.floor(Math.random() * 4)]
      valid = isValid(ship, randomDir, randomRow, randomCol)
      overlap = isOverlap(ship, randomRow, randomCol)
      if (valid) {
        setShip(ship, String.fromCharCode(randomRow) + randomCol, randomDir)
      }
    }
  }
}

function fire(e) {
  console.log(e.target.id)
  if (activeBoard === 'player-board') {
    console.log('computer fires!')
    console.log(playerState[e.target.id])
    setTurn()
  } else {
    console.log('player fires!')
    console.log(opponentState[e.target.id])
    setTurn()
  }
}

function setBoardState(player, cell) {

}

