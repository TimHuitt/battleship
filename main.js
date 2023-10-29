

/*----- constants -----*/
const playerBoard = []

const ships = {
  destroyer: 2,
  sub: 3,
  cruiser: 3,
  battleship: 4,
  carrier: 5,
}

/*----- state variables -----*/


/*----- cached elements  -----*/

const opponentBoardEl = document.querySelector("#opponent-board")
const playerBoardEl = document.querySelector('#player-board')
const playerShipsEl = document.querySelector('#player-ships-wrapper')
const playerShips = document.querySelectorAll('#player-ships-wrapper > div')

/*----- event listeners -----*/

playerBoardEl.addEventListener('click', handleBoardClick)
playerShipsEl.addEventListener('click', handleShipEvent)
playerShipsEl.addEventListener('mouseover', handleShipEvent)
playerShipsEl.addEventListener('mouseleave', handleShipEvent)

/*----- classes -----*/

// create new cells with the passed id, class, and inner text
class CreateCell {
  constructor(id, cls, text='') {
    this.el = document.createElement('div')
    this.el.setAttribute('id', id)
    this.el.classList.add(cls)
    this.el.classList.add('center')
  }
}

/*----- functions -----*/

init()

function init() {
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

function renderBoard(element) {
  row = 97
  currentCol = 1
  for (let i = 1; i <= 100; i++) {
    currentRow = String.fromCharCode(row)
    const cell = new CreateCell(currentRow + currentCol, 'cell', currentRow + currentCol)
    element.appendChild(cell.el)
    if (!(i % 10)) { 
      row++
      currentCol -= 10
    }
    currentCol++
  }
}

function handleBoardClick(e) {
  console.log(e.target)
}

function handleShipEvent(e) {
  if (!e.target.id.includes('wrapper')) {
    if (e.type === 'mouseover') {

      clearHighlights()

      const el = document.querySelector(`#${e.target.id}`)
      el.classList.add('over')
    }
    if (e.type === 'click') {
      console.log(e.target.id)
    }
  }
  if (e.type === 'mouseleave') {
    console.log('leave')
    clearHighlights()
  }

  function clearHighlights() {
    for (const ship in ships) {
      const el = document.querySelector(`#player-${ship}`)
      el.classList.remove('over')
    }
  }
}