

//*----- constants -----*//

// list all player cells and thier state
// 1 = occupied
// 0 = empty
// -1 = hit
const playerState = {
  // active ships and their location
  playerShips: {}
}

// list all opponent cells and thier state
const opponentState = {
  opponentShips: {}
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

let currentPlayer

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
  currentPlayer = 'player-board'
  // render player
  renderBoard(playerBoardEl)
  renderPlayerShips()
  // render opponent
  renderBoard(opponentBoardEl)
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
  if (e.type === 'click') {
  }
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
      if (cell.parentElement.id === currentPlayer &&
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


handleShipPlacement('carrier', 'b5', 'w')
handleShipPlacement('battleship', 'f8', 'n')
handleShipPlacement('cruiser', 'g4', 's')
handleShipPlacement('sub', 'i9', 'w')
handleShipPlacement('destroyer', 'f6', 'n')

function handleShipPlacement(ship, cell, direction) {
  const currentCell = document.querySelector(`#${currentPlayer} #${cell}`)
  let currentRow = cell.split('')[0]
  let currentCol = parseInt(cell.slice(1))
  let currentChar = currentRow.charCodeAt(0) // a - j: 97 - 106
  let valid = true
  let cellRange = []
  let nextCellEl
  let nextCell

  currentCell.classList.add('placed')
  playerState[cell] = 1
  cellRange.push(cell)

  // check if ship fits within boundries
  if (direction === 'n' && currentChar - ships[ship] + 1 < 97) {
    valid = false
  }
  if (direction === 'e' && currentCol + ships[ship] - 1 > 10) {
    valid = false
  }
  if (direction === 's' && currentChar + ships[ship] - 1 > 106) {
    valid = false
  }
  if (direction === 'w' && currentCol - ships[ship] + 1 < 1) {
    valid = false
  }

  // add each new cell to board state 
  // based on selected ship, start cell, and direction
  for (let i = 0; i < ships[ship] - 1; i++) {
    if (direction === 'n') {
      if (currentChar > 97) {
        currentChar -= 1
      }
    } else if (direction === 'e') {
      if (currentCol < 10) {
        currentCol += 1
      }
    } else if (direction === 's') {
      if (currentChar + 1 <= 106) {
        currentChar += 1
      }
    } else if (direction === 'w') {
      if (currentCol - 1 >= 1) {
        currentCol -= 1
      }
    }

    currentRow = String.fromCharCode(currentChar)
    nextCell = `${currentRow}${currentCol}`
    playerState[nextCell] = 1
    cellRange.push(nextCell)

    nextCellEl = document.querySelector(`#${currentPlayer} #${nextCell}`)
    nextCellEl.classList.add('placed')
  }
  playerState['playerShips'][ship] = cellRange
}

function setBoardState(player, cell) {

}