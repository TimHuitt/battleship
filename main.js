

/*----- constants -----*/
const playerBoard = []

/*----- state variables -----*/


/*----- cached elements  -----*/

const opponentBoardEl = document.querySelector("#opponent-board")
const playerBoardEl = document.querySelector('#player-board')
const playerShips = document.querySelectorAll('#player-ships-wrapper > div')

/*----- event listeners -----*/

playerBoardEl.addEventListener('click', handleClick)

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
  const ships = {
    destroyer: 2,
    sub: 3,
    cruiser: 3,
    battleship: 4,
    carrier: 5,
  }
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

function handleClick(e) {
  console.log(e.target)
}