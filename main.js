// todo: Functionality
  // add player ship select/placement
  // todo: detect overlapping ship placement
  // computer plays automatically
  // add end game function to finanlize/call init
  // todo: simplify all functions with if(player)else(opponent)

// todo: DOM
  // add player ship selection/placement actions
  // switch main board based on active board
  // todo: on player/computer action
    // white = miss, red = hit
      // todo: display hit/miss message
    // todo: if ship destroyed, red border
      // todo: add red bg to computer/player ships preview
      // todo: reduce computer ships remaining count
      // todo: destruction message
  // todo: display turn message
  // todo: display end game message
  // todo: add player stats after ship selection setStats

// todo: Styling
  // todo: add board switch animation
  // todo: fade in/out messages (player select, turn, sink, win)

// todo: Bugs
  // todo: dragging bubbles
  // todo: clicking board name bubbles
  // todo: computer goes first after reinit

//*----- constants -----*//

// list all player cells and thier state
// 1 = occupied
// 0 = empty
// -1 = hit
const playerStateTemplate = {
  // active ships and their location
  ships: {}
}

// list all opponent cells and thier state
const opponentStateTemplate = {
  ships: {}
}

// list of ship types and their cell length
// cell length determines all ship geometry
const ships = {
  destroyer: 2,
  sub: 3,
  cruiser: 3,
  battleship: 4,
  carrier: 5,
}

//*----- state variables -----*//

let activeBoard
let winner
let initialize

let selectedShip
let initialShipCell
let shipDirCell

let shots
let hits
let misses
let sunk

//! debug
let showOpponentPieces = true
let enableComputer = true
//!


//*----- cached elements  -----*//

const opponentBoardEl = document.querySelector('#opponent-board')
const largeBoardEl = document.querySelector('#large-board-wrapper')
const smallBoardEl = document.querySelector('#small-board-wrapper')
const playerBoardEl = document.querySelector('#player-board')
const playerShipsEl = document.querySelector('#player-ships-wrapper')
const playerShips = document.querySelectorAll('#player-ships-wrapper > div')


//*----- event listeners -----*//

function applyListeners() {
  largeBoardEl.addEventListener('click', handleBoardEvent)
  largeBoardEl.addEventListener('mousedown', handleBoardEvent)
  largeBoardEl.addEventListener('mouseup', handleBoardEvent)
  largeBoardEl.addEventListener('mouseover', handleBoardEvent)
  largeBoardEl.addEventListener('mouseleave', handleBoardEvent)
}
function applyShipListeners() {
  playerShipsEl.addEventListener('click', selectShip)
  playerShipsEl.addEventListener('mouseover', handleShipEvent)
  playerShipsEl.addEventListener('mouseleave', handleShipEvent)
}
function removeListeners() {
  largeBoardEl.removeEventListener('click', handleBoardEvent)
  largeBoardEl.removeEventListener('mouseover', handleBoardEvent)
  largeBoardEl.removeEventListener('mouseleave', handleBoardEvent)
}
function removeShipListeners() {
  playerShipsEl.removeEventListener('click', selectShip)
  playerShipsEl.removeEventListener('mouseover', handleShipEvent)
  playerShipsEl.removeEventListener('mouseleave', handleShipEvent)
}

function addInitListeners() {
  largeBoardEl.addEventListener('click', selectShip)
  largeBoardEl.addEventListener('mousedown', selectShip)
  largeBoardEl.addEventListener('mouseup', selectShip)
}
function removeInitListeners() {
  largeBoardEl.removeEventListener('click', selectShip)
  largeBoardEl.removeEventListener('mousedown', selectShip)
  largeBoardEl.removeEventListener('mouseup', selectShip)
}
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
  winner = false;
  initialize = true;
  playerState = {...playerStateTemplate}
  opponentState = {...opponentStateTemplate}
  shots = 0
  hits = 0
  misses = 0
  sunk = 0
  clearBoards()
  renderBoard(playerBoardEl)
  renderPlayerShips()
  renderBoard(opponentBoardEl)
  
  applyShipListeners()


  //! debug
  // setShip('carrier', 'b5', 'w')
  // setShip('battleship', 'f8', 'n')
  // setShip('cruiser', 'g4', 's')
  // setShip('sub', 'i9', 'w')
  // setShip('destroyer', 'f6', 'n')
  //!

  beginTurn()
}

function beginTurn() {
  if (activeBoard === 'opponent-board') setTurn()
  console.log('place your ships')

  let shipsLen = 0
  for (ship in playerState.ships) {
    shipsLen++
  }

  if (shipsLen !== 5) {
    return
  } else {
    clearBoards('ships')
    setStats()
    removeShipListeners()
    removeInitListeners()
    applyListeners()
    setTurn()
    setComputerBoard()
  }  
}

//*----- handlers -----*//

function handleBoardEvent(e) {
  if (e.type === 'click') fire(e.target)

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
      console.log(e.target)
      e.target.classList.add('selected')
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


function selectShip(e) {
  if (e.target.id.includes('player')) {
    removeListeners()
    addInitListeners()
    selectedShip = e.target.id.split('-')[1]

  } else if (!initialShipCell) {
    initialShipCell = e.target.id

  } else if (!shipDirCell) {
    shipDirCell = e.target.id

    let startRow = initialShipCell.split('')[0]
    let startCol = parseInt(initialShipCell.slice(1))
    startRow = startRow.charCodeAt(0) // a - j: 97 - 106

    let endRow = shipDirCell.split('')[0]
    let endCol = parseInt(shipDirCell.slice(1))
    endRow = endRow.charCodeAt(0) // a - j: 97 - 106
    console.log(startRow, endRow, startCol, endCol) // e2 e3 -> 101 101 2 3

    if (endRow - startRow < 0) {
      dir = 'n'
    } else if (endRow - startRow > 0) {
      dir = 's'
    } else if (endCol - startCol < 0) {
      dir = 'w'
    } else if (endCol - startCol > 0) {
      dir = 'e'
    }
    
    if (setShip(selectedShip, initialShipCell, dir)) {
      console.log(`${selectedShip} assigned to board`)
      shipEl = document.querySelector(`#player-${selectedShip}`)
      clearBoards(shipEl)
    } else {
      console.log('invalid placement. try again')
    }

    largeBoardEl.removeEventListener('click', selectShip)
    selectedShip = ''
    initialShipCell = ''
    shipDirCell = ''
    beginTurn()
  }

}



function setStats() {
  var children = playerShipsEl.querySelectorAll('div')
  const text = [`Player Stats`, 
                `Shots <span>${shots}</span>`, 
                `Hits <span>${hits}</span>`, 
                `Misses <span>${misses}</span>`, 
                `Ships Sunk <span>${sunk}</span>`]
  children.forEach((child, index) => {
    child.innerHTML = text[index]
  })
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
  if (!valid) return false

  // set up initial cell
  if (activeBoard === 'player-board') {
    currentCell.classList.add('placed')
    playerState[cell] = 1
  } else {
    if (showOpponentPieces) currentCell.classList.add('placed')
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
      if (showOpponentPieces) nextCellEl.classList.add('placed')
    }

  }
  if (activeBoard === 'player-board') {
    playerState['ships'][ship] = cellRange
  } else {
    opponentState['ships'][ship] = cellRange
  }
  return true
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
// ([ship name], [row char number], [column number])
// (str, int, int)
// ('battleship', 97, 4)
function isOverlap(posArr) {
  // console.log(posArr)
}


function getRandomData() {
  let randomRow = Math.floor(Math.random() * (106-97) + 97)
  let randomCol = Math.floor(Math.random() * (10 - 1) + 1)
  let randomDir = ['n', 'e', 's', 'w'][Math.floor(Math.random() * 4)]
  return [randomRow, randomCol, randomDir]
}

// randomly search ship starting positions
// set ship if position is valid
function setComputerBoard() {
  let posArr = []
  for (let ship in ships) {
    let valid = false
    let overlap = false

    while (!valid && !overlap) {
      let randomRow = getRandomData()[0]
      let randomCol = getRandomData()[1]
      let randomDir = getRandomData()[2]
      valid = isValid(ship, randomDir, randomRow, randomCol)
      overlap = isOverlap(posArr)
      if (valid && !overlap) {
        setShip(ship, String.fromCharCode(randomRow) + randomCol, randomDir)
      }
    }
    posArr = posArr.concat(opponentState.ships[ship])
  }
  // console.log(posArr)
  initialize = false
}

// todo: simplify
// check if game has ended
function getGameState() {
  let gameState = 0
  
  if (activeBoard === 'opponent-board') {
    for (let ship in opponentState.ships) {
      const shipState = opponentState.ships[ship].every((cell) => opponentState[cell] === -1)
      if (shipState) gameState++
    }
  } else {
    for (let ship in playerState.ships) {
      const shipState = playerState.ships[ship].every((cell) => playerState[cell] === -1)
      if (shipState) gameState++
    }
  }

  if (gameState === 5) {
    init()
    return true
  }

  return false
}

// todo: simplify
function clearBoards(element) {
  if (element === 'ships') {
    playerShips.forEach((cell) => {
      var child = cell.lastElementChild
      while (child) {
        cell.removeChild(child);
        child = cell.lastElementChild
      }
    })
  } else if (element) {
    var child = element.lastElementChild
      while (child) {
        element.removeChild(child);
        child = element.lastElementChild
      }
  } else {
    playerBoardEl.innerHTML = ''
    opponentBoardEl.innerHTML = ''
    playerShips.forEach((cell) => {
      var child = cell.lastElementChild
      while (child) {
        cell.removeChild(child);
        child = cell.lastElementChild
      }
    })
  }
}

// todo: simplify
// returns struck ship and whether it is hit or destroyed
function getShipState(e) {
  if (activeBoard === 'player-board') {
    for (let ship in playerState.ships) {
      if (playerState.ships[ship].includes(e.id)) {
        const isSunk = playerState.ships[ship].every((cell) => playerState[cell] === -1)

        if (isSunk) {
          return [ship, 'destroyed']
        }
        return [ship, 'hit']
      }
    }   
  } else {
    for (let ship in opponentState.ships) {
      const isSunk = opponentState.ships[ship].every((cell) => opponentState[cell] === -1)
      
      if (opponentState.ships[ship].includes(e.id)) {
        if (isSunk) {
          return [ship, 'destroyed']
        }
        return [ship, 'hit']
      }
      
    }
  }
}

function renderShot(cell, type) {
  if (type === 'hit') {
    cell.classList.remove('placed')
    cell.style.background = 'red'
  } else if (type === 'miss') {
    cell.style.background = 'white'
  }
}

function sinkShip() {
  
}

// todo: simplify
// todo: replace console logs with renders
// todo: separate concerns
// fire on target
// check if hit or miss
// check for destruction
function fire(e) {

  // computer turn
  if (activeBoard === 'player-board') {
    console.log('computer fires!')
    if (playerState[e.id] === 1) {
      playerState[e.id] = -1

      const getShip = getShipState(e)
      if (getShip[1] === 'destroyed') {
        console.log(`player: you sunk my ${getShip[0]}`)
      } else {
        console.log('HIT!')
      }
      renderShot(e, 'hit')

    } else if (playerState[e.id] === -1 || 
      playerState[e.id] === 2) {
      console.log('Try Again...') 
      return false
    } else {
      playerState[e.id] = 2
      console.log('MISS!')
      renderShot(e, 'miss')
    }

    if (getGameState()) console.log('Computer Wins!')

  // player turn
  } else {
    console.log('player fires!')

    // if cell is occupied
    if (opponentState[e.id] === 1) {
      opponentState[e.id] = -1
      console.log('HIT!')
      renderShot(e, 'hit')

      const getShip = getShipState(e)
      if (getShip[1] === 'destroyed') {
        console.log(`computer: you sunk my ${getShip[0]}`)
      }

    } else if (opponentState[e.id] === -1 || 
              opponentState[e.id] === 2) {
      console.log('Try Again...') 
      return false

    } else {
      opponentState[e.id] = 2
      console.log('MISS!')
      renderShot(e, 'miss')
    }
    if (getGameState()) console.log('player Wins!')
  }
  setTurn()
  return true
}

// toggle current turn
function setTurn() {
  activeBoard = (activeBoard === 'player-board') ? 'opponent-board' : 'player-board'
  if (activeBoard === 'player-board') {
    smallBoardEl.appendChild(opponentBoardEl)
    largeBoardEl.appendChild(playerBoardEl)
    if (enableComputer) {
      const targetCell = playerBoardEl.querySelector(`#${computerChoice()}`)
      if (!initialize) fire(targetCell)
    }
  } else {
    smallBoardEl.appendChild(playerBoardEl)
    largeBoardEl.appendChild(opponentBoardEl)
  }
}



function computerChoice() {
  let valid = false

  while (!valid) {
    let input = getRandomData()
    let row = String.fromCharCode(input[0])
    let col = input[1]
    output = row + col
    if (playerState[output] === 1 || playerState[output] === 0) valid = true
  }
  return output
}


