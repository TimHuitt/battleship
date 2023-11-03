

//! dev tools
let autoSelectPlayerPieces = true
let showOpponentPieces = true
let showGrid = false
let disableComputerPlayer = false
let disableAlerts = false
let disableTimers = false
let disableSounds = false

function dev() {
  autoSelectPlayerPieces = true
  showOpponentPieces = true
  showGrid = true
  disableTimers = true
  init()
}
//!


//*----- constants -----*//

// save all cells and thier state
// save ship locations
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

// list ship types and their cell length
// cell length determines all ship geometry
const ships = {
  destroyer: 2,
  sub: 3,
  cruiser: 3,
  battleship: 4,
  carrier: 5,
}

// player stats
const scores = {
  shots: 0,
  hits: 0,
  misses: 0,
  sunk: 0,
}


//*----- state variables -----*//

let activeBoard // 'player-board'/'opponent-board'
let initialize // skips computer turn on start

let selectedShip // ship placement str
let initialShipCell // ship placement str
let shipDirCell // ship placement str

let playerName // 'name'
let opponentName // 'name'

// timing delays (ms)
let introDelay
let toastDelay
let oneDelay
let twoDelay
let threeDelay
let fourDelay
let sixDelay

// sounds
let tap
let click
let snap
let boom
let splash
let invalid
let win

//*----- cached elements  -----*//

const body = document.querySelector('body')
const opponentBoardEl = document.querySelector('#opponent-board')
const largeBoardEl = document.querySelector('#large-board-wrapper')
const smallBoardEl = document.querySelector('#small-board-wrapper')
const playerBoardEl = document.querySelector('#player-board')
const playerShipsEl = document.querySelector('#player-ships-wrapper')
const playerShips = document.querySelectorAll('#player-ships-wrapper > div')
const toastContainer = document.querySelector('#toast-container')


//*----- event listeners -----*//

function applyListeners() {
  largeBoardEl.addEventListener('click', handleBoardEvent)
  largeBoardEl.addEventListener('mouseover', handleBoardEvent)
  largeBoardEl.addEventListener('mouseleave', handleBoardEvent)
}
function removeListeners() {
  largeBoardEl.removeEventListener('click', handleBoardEvent)
  largeBoardEl.removeEventListener('mouseover', handleBoardEvent)
  largeBoardEl.removeEventListener('mouseleave', handleBoardEvent)
}

function applyShipListeners() {
  playerShipsEl.addEventListener('click', renderShipSelection)
  playerShipsEl.addEventListener('mouseover', handleShipEvent)
  playerShipsEl.addEventListener('mouseleave', handleShipEvent)
}
function removeShipListeners() {
  playerShipsEl.removeEventListener('click', renderShipSelection)
  playerShipsEl.removeEventListener('mouseover', handleShipEvent)
  playerShipsEl.removeEventListener('mouseleave', handleShipEvent)
}

function applySelectionListeners() {
  largeBoardEl.addEventListener('click', renderShipSelection)
  largeBoardEl.addEventListener('mouseup', renderShipSelection)
  largeBoardEl.addEventListener('mousedown', renderShipSelection)
}
function removeSelectionListeners() {
  largeBoardEl.removeEventListener('click', renderShipSelection)
  largeBoardEl.removeEventListener('mouseup', renderShipSelection)
  largeBoardEl.removeEventListener('mousedown', renderShipSelection)
}


//*----- classes -----*//

// create new cells with the passed id, class, and centered
class CreateCell {
  constructor(id, cls, text='') {
    this.el = document.createElement('div')
    if (id) this.el.setAttribute('id', id)
    if (showGrid && !id.includes('_')) this.el.innerText = text
    this.el.classList.add(cls)
    this.el.classList.add('center')
  }
}


// create visual notification containing:
// msg = message to appear inside container
// delay = time before message appears
// timeout = time before message disappears
class Toast {
  constructor() {
    this.el = document.createElement('div')
    this.el.classList.add('toast')
  }

  show(msg, delay = 0, timeout = toastDelay) {
    if (disableAlerts) return
    setTimeout(() => {
      this.el.innerHTML = msg
      this.el.classList.add('show')
      toastContainer.appendChild(this.el)
      setTimeout(() => { this.hide() }, timeout)
    }, delay)
  }

  hide() {
    this.el.classList.remove('show')
    setTimeout(() => {
      this.el.remove()
    })
  }
}


//*----- initialization -----*//

init()

// set up initial game states
function init() {
  playerName = 'Player'
  opponentName = 'Computer'

  initialize = true;
  if (!activeBoard) activeBoard = 'player-board'

  playerState = {...playerStateTemplate}
  playerState.ships = {...playerStateTemplate.ships}
  opponentState = {...opponentStateTemplate}
  opponentState.ships = {...opponentStateTemplate.ships}

  scores.shots = 0
  scores.hits = 0
  scores.misses = 0
  scores.sunk = 0

  introDelay = 2010
  toastDelay = 3000
  halfDelay = 500
  oneDelay = 1000
  twoDelay = 2000
  threeDelay = 3000
  fourDelay = 4000
  sixDelay = 6000
  
  setShipStatus('', 1)
  renderStats(1)
  clearBoards()
  renderBoard(playerBoardEl)
  renderPlayerShips()
  renderBoard(opponentBoardEl)
  applyShipListeners()

  if (!disableSounds) {
    tap = new Audio('./res/sounds/tap.mp3')
    click = new Audio('./res/sounds/click.mp3')
    snap = new Audio('./res/sounds/snap.mp3')
    boom = new Audio('./res/sounds/boom.mp3')
    sink = new Audio('./res/sounds/sink.mp3')
    splash = new Audio('./res/sounds/splash.mp3')
    splash.volume = 0.6
    invalid = new Audio('./res/sounds/invalid.mp3')
    win = new Audio('./res/sounds/win.mp3')
    lose = new Audio('./res/sounds/lose.mp3')
  }
  

  //! debug
  if (autoSelectPlayerPieces) {
    setShip('carrier', 'b5', 'w')
    setShip('battleship', 'f8', 'n')
    setShip('cruiser', 'g4', 's')
    setShip('sub', 'i9', 'w')
    setShip('destroyer', 'f6', 'n')
  }
  if (disableTimers) {
    introDelay = 0
    toastDelay = 1000
    halfDelay = 0
    oneDelay = 0
    twoDelay = 0
    threeDelay = 0
    fourDelay = 0
    sixDelay = 0
  }
  //!

  // display initial welcome messages
  new Toast().show(`Welcome to Battleship!`, halfDelay, threeDelay)

  new Toast().show(`
    <p>1. Select a ship</p>
    <p>2. Drag to place</p>
    `, introDelay)

  beginTurn()
}

// initialize first turn when all ships have been placed
function beginTurn() {
  if (activeBoard === 'opponent-board') setTurn()

  let shipsLen = 0
  for (const ship in playerState.ships) {
    shipsLen++
  }

  if (shipsLen !== 5) {
    return
  } else {
    clearBoards('ships')
    renderStats()
    removeShipListeners()
    removeSelectionListeners()
    applyListeners()
    setTurn()
    setComputerBoard()
  }  
}

//*----- handlers -----*//

function handleBoardEvent(e) {
  if (e.type === 'click' && 
      !e.target.id.includes('wrapper') &&
      !e.target.id.includes('board')) { fire(e.target) }

  if (e.type === 'mouseover' && !e.target.id.includes('wrapper')) {
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

function playSound(sound, duration) {
  try {
    sound.pause()
    sound.currentTime = 0
    const playPromise = sound.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playback started successfully
        })
        .catch(error => {
          return
        })
    }
  } catch {
    return
  }
}

//*----- rendering -----*//

// select and place ship on board
function renderShipSelection(e) {

  // if selecting a ship
  if (e.target.id.includes('player') && !e.target.id.includes('wrapper')) {
    playSound(click, 500)

    selectedShip = e.target.id.split('-')[1]
    removeListeners()
    applySelectionListeners()

  // select ship starting position
  } else if (selectedShip && !initialShipCell && !e.target.id.includes('wrapper')) {
    initialShipCell = e.target.id

  // select ship end position
  // determine direction
  } else if (!shipDirCell && !e.target.id.includes('wrapper')) {
    // return for 'click'
    if (!initialShipCell || initialShipCell === e.target.id) return

    // get selection direction
    shipDirCell = e.target.id
    let startRow = initialShipCell.split('')[0]
    let startCol = parseInt(initialShipCell.slice(1))
    startRow = startRow.charCodeAt(0) // a - j: 97 - 106

    let endRow = shipDirCell.split('')[0]
    let endCol = parseInt(shipDirCell.slice(1))
    endRow = endRow.charCodeAt(0) // a - j: 97 - 106

    if (endRow - startRow < 0) {
      dir = 'n'
    } else if (endRow - startRow > 0) {
      dir = 's'
    } else if (endCol - startCol < 0) {
      dir = 'w'
    } else if (endCol - startCol > 0) {
      dir = 'e'
    }
    
    // ship placement success
    if (selectedShip && initialShipCell && setShip(selectedShip, initialShipCell, dir)) {
      playSound(snap, 500)
      new Toast().show(`${selectedShip} assigned`)
      switchHighlight()  
      shipEl = document.querySelector(`#player-${selectedShip}`)
      clearBoards(shipEl)

    // ship placement failure
    } else {
      playSound(invalid, 500)
      switchHighlight()
      new Toast().show('invalid placement. try again')
    }

    largeBoardEl.removeEventListener('click', renderShipSelection)
    selectedShip = ''
    initialShipCell = ''
    shipDirCell = ''
    beginTurn()
  }

  if (e.target.parentNode.id.includes('ships-wrapper')) {
    switchHighlight(e)
    new Toast().show(`placing ${selectedShip}`, 0, twoDelay)
  }
  
  // add/remove ship highlight during selection
  function switchHighlight(e) {
    const ships = document.querySelectorAll('#player-ships-wrapper div')
    ships.forEach((el) => {
      el.classList.remove('selected')
    })
    if (e) e.target.classList.add('selected')
  }
}

// add player ships to player ship container
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

// add 100 cells to passed element
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
        playSound(tap, 500)
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

// add hit or miss 'peg' to selected cell
function renderShot(cell, type) {
  if (type === 'hit') {
    const peg = new CreateCell('', 'hit')
    cell.appendChild(peg.el)
  } else if (type === 'miss') {
    const peg = new CreateCell('', 'miss')
    cell.appendChild(peg.el)
  }
}

// setup player stats in ship container
// 1 = reset
function renderStats(reset) {
  var children = playerShipsEl.querySelectorAll('div')
  if (reset) {
    children.forEach((child, index) => {
      child.innerHTML = ''
    })
  } else {
    const text = [`Player Stats`, 
                  `<div class="stats">Shots</div> <div id="shots">${scores.shots}</div>`, 
                  `<div class="stats">Hits</div> <div id="hits">${scores.hits}</div>`, 
                  `<div class="stats">Misses</div> <div id="misses">${scores.misses}</div>`, 
                  `<div class="stats">Ships Sunk</div> <div id="sunk">${scores.sunk}</div>`
                ]
    children.forEach((child, index) => {
      child.innerHTML = text[index]
    })
    const shots = document.querySelector('#shots')
    const hits = document.querySelector('#hits')
    const misses = document.querySelector('#misses')
    const sunk = document.querySelector('#sunk')
  }
}


//*----- getters -----*//

// check for end game conditions
function getGameState() {
  let gameState = 0
  
  for (let ship in getBoard().ships) {
    const shipState = getBoard().ships[ship].every((cell) => getBoard()[cell] === -1)
    if (shipState) gameState++
  }

  if (gameState === 5) {
    return true
  }
  return false
}

// returns struck ship and whether it is hit or destroyed
function getShipState(e) {
  const ships = getBoard().ships

  // search active user ships for existing ship
  // return ship name and status
  for (const ship in ships) {
    if (ships[ship].includes(e.id)) {
      const isSunk = ships[ship].every(cell => getBoard()[cell] === -1)
      return [ship, isSunk ? 'destroyed' : 'hit']
    }
  }
}

// get random computer choice and
// determine validity
function getComputerChoice() {
  let valid = false

  while (!valid) {
    let input = getRandomData()
    let row = String.fromCharCode(input[0])
    let col = input[1]
    output = row + col
    if (playerState[output] === 1 || 
        playerState[output] === 0) {
      valid = true
    }
  }
  return output
}

// breaks down selected cell element
// row, column, row ASCII code
function getGrid(cell) {
  let currentRow = cell.split('')[0]
  let currentCol = parseInt(cell.slice(1))
  let currentChar = currentRow.charCodeAt(0)
  return [currentRow, currentCol, currentChar]
}

// create random cell and direction data
function getRandomData() {
  let randomRow = Math.floor(Math.random() * (107-97) + 97)
  let randomCol = Math.floor(Math.random() * (11 - 1) + 1)
  let randomDir = ['n', 'e', 's', 'w'][Math.floor(Math.random() * 4)]
  return [randomRow, randomCol, randomDir]
}

function getBoard() {
  return (activeBoard === 'player-board') ? playerState : opponentState
}


//*----- setters -----*//

// set set board ship data
// directions: n, e, s, w
// ([ship name], [grid position], [direction letter])
// (str, str, str)
// ('battleship', 'i9', 'n')
function setShip(ship, cell, direction) {
  const currentCell = document.querySelector(`#${activeBoard} #${cell}`)
  let currentRow = getGrid(cell)[0]
  let currentCol = getGrid(cell)[1]
  let currentChar = getGrid(cell)[2]
  let cellRange = []
  let nextCellEl
  let nextCell

  const overlap = isOverlap(ship, cell, direction)
  const valid = isValid(ship, direction, currentChar, currentCol)

  if (!valid || overlap) return false

  // set up initial cell
  getBoard()[cell] = 1
  if (activeBoard === 'player-board') {
    currentCell.classList.add('placed')
  } else {
    if (showOpponentPieces) currentCell.classList.add('placed')
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

    getBoard()[nextCell] = 1
    nextCellEl = document.querySelector(`#${activeBoard} #${nextCell}`)
    
    if (activeBoard === 'player-board') {
      nextCellEl.classList.add('placed')
    } else {
      if (showOpponentPieces) nextCellEl.classList.add('placed')
    }
  }
  getBoard()['ships'][ship] = cellRange
  return true
}

// randomly search ship starting positions
// set ship if position is valid
function setComputerBoard() {
  let posArr = []
  for (let ship in ships) {
    let valid = false
    let overlap = true

    while (!valid || overlap) {
      let randomRow = getRandomData()[0]
      let randomCol = getRandomData()[1]
      let randomDir = getRandomData()[2]
      let rowChar = String.fromCharCode(randomRow)
      valid = isValid(ship, randomDir, randomRow, randomCol)
      overlap = isOverlap(ship, rowChar + randomCol, randomDir)

      
      if (valid && !overlap) {
        setShip(ship, rowChar + randomCol, randomDir)
      }
    }
  }
  initialize = false
}

// toggle current turn
function setTurn() {
  activeBoard = (activeBoard === 'player-board') ? 'opponent-board' : 'player-board'

  if (activeBoard === 'player-board') {
    smallBoardEl.appendChild(opponentBoardEl)
    largeBoardEl.appendChild(playerBoardEl)
    if (!disableComputerPlayer) {
      setTimeout(() => {
        const targetCell = playerBoardEl.querySelector(`#${getComputerChoice()}`)
        if (!initialize) fire(targetCell)
      }, oneDelay)
      setTimeout(() => {
        disable(0)
      }, fourDelay)
    } else {
      disable(0)
    }
  } else {
    new Toast().show(`PLAYER'S TURN`)
    smallBoardEl.appendChild(playerBoardEl)
    largeBoardEl.appendChild(opponentBoardEl)
    if (disableComputerPlayer) disable(0)
  }
}

// set/reset opponent ship data
function setShipStatus(ship, reset) {
  const remainingEl = document.querySelector('#opponent-remaining')
  if (reset) {
    const ships = document.querySelectorAll('#opponent-ships div div')
    for (let shipEl of ships) {
      shipEl.classList.remove('sunk')
    }
    remainingEl.innerText = "Ships Remaining: 5"
  } else {
    const shipEl = document.querySelector(`#opponent-${ship}`)
    shipsLeft = remainingEl.innerText.split(': ')[1] - 1
    remainingEl.innerText = `Ships Remaining: ${shipsLeft}`
    shipEl.classList.add('sunk')
  }
}

// sets score in player board
// type = hit/miss/shipname
function setScore(type) {
  if (activeBoard !== 'player-board') {
    
    switch (type) {
      case 'hit':
        scores.shots++
        scores.hits++
        break
      case 'miss':
        scores.shots++
        scores.misses++
        break
      default:
        scores.sunk++
        break
    }
  }
  updateScores()
}

// set toasts from grid event handling
function setToast(type, ship, e) {
  const thisPlayer = (activeBoard.split('-')[0] === 'player') ? opponentName : playerName
  const otherPlayer = (thisPlayer === 'player') ? playerName : opponentName

  if (type === 'fire') {
    new Toast().show(`${thisPlayer} fires!`)

  } else if (type === 'hit') {
    new Toast().show('HIT!', oneDelay, twoDelay)

  } else if (type === 'miss') {
    new Toast().show('MISS!', oneDelay, twoDelay)

  } else if (type === 'destroy') {
    new Toast().show(`${otherPlayer}:<br> You sunk my ${ship}!`, twoDelay, threeDelay)

  } else if (type === 'win') {
    new Toast().show(`${thisPlayer} WINS!`, threeDelay)
    setTimeout(() => {
      if (activeBoard === 'opponent-board') {
        playSound(win, 500)
      } else {
        playSound(lose, 500)
      }
    }, oneDelay)

  } else {
    playSound(invalid, 500)
    new Toast().show(`Invalid Selection:<br>Try again...`, oneDelay, twoDelay)
  }
}

// fire on target
// check if hit or miss
// check for destruction
// check for win
function fire(e) {
  //disable interaction
  disable(1)
  playSound(click, 500)

  // computer turn
  setToast('fire')

  // if selection is a hit
  if (getBoard()[e.id] === 1) {

    getBoard()[e.id] = -1
    setToast('hit')
    setTimeout(() => {
      playSound(boom, 500)
      renderShot(e, 'hit')
      setScore('hit')
    }, oneDelay)

    // if hit destroys a ship
    const getShip = getShipState(e)
    if (getShip[1] === 'destroyed') {
      setToast('destroy', getShip[0])
      setTimeout(() => {
        playSound(sink, 500)
        setScore('destroy')
        setTimeout(() => {
          if (activeBoard === 'opponent-board') setShipStatus(getShip[0])
        }, 1000)
      }, oneDelay)
    }

    // if destruction wins game
    if (getGameState()) {
      setToast('win')
    }

  // if already selected
  } else if (getBoard()[e.id] === -1 || 
  getBoard()[e.id] === 2) {
      playSound(invalid, 500)
      setToast('Invalid selection... Try again')
      disable(0)
    return false

  // if unoccupied
  } else {
    getBoard()[e.id] = 2
    setToast('miss')
    setTimeout(() => {
      playSound(splash, 500)
      renderShot(e, 'miss')
      setScore('miss')
    }, oneDelay)
  }

  // if win
  if (getGameState()) {
    setTimeout(() => {
      init()
    }, sixDelay)

  // if not win
  } else {
    setTimeout(() => {
      setTurn()
    }, threeDelay)
  }
  return true
}


//*----- tools -----*//

// check if ship location and orientation is valid
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

// check current ship location for overlap if placed
function isOverlap(ship, cell, direction) {
  let currentRow = getGrid(cell)[0]
  let currentCol = getGrid(cell)[1]
  let currentChar = getGrid(currentRow)[2]
  let currentPos = [cell]

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
    currentPos.push(String.fromCharCode(currentChar) + currentCol)
  }
  
  const noOverlap = currentPos.every((currentCell) => {
    return getBoard()[currentCell] === 0 && 
    getBoard()[currentCell] !== undefined
  })

  return (noOverlap) ? false : true
}

// remove added elements from boards and score card
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

// set updated values to score card
function updateScores() {
  shots.innerText = scores.shots
  hits.innerText = scores.hits
  misses.innerText = scores.misses
  sunk.innerText = scores.sunk
}

// toggle interaction disabling
function disable(toggle) {
  if (toggle) {
    body.classList.add('disable')
  } else {
    body.classList.remove('disable')
  }
}