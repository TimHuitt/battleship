

/*----- constants -----*/
const playerBoard = []

/*----- state variables -----*/


/*----- cached elements  -----*/

const opponentBoardEl = document.querySelector("#opponent-board")
const playerBoardEl = document.querySelector('#player-board')
const playerShipsContainer = document.querySelectorAll('player-ships-wrapper')

/*----- event listeners -----*/


/*----- classes -----*/

class CreateCell {
  constructor(col = '', row = '') {
    this.el = document.createElement('div')
    this.el.setAttribute('id', row + col)
    this.el.innerText = row + col
    this.el.classList.add('cell')
    this.el.classList.add('center')
  }
}

/*----- functions -----*/

init()

function init() {
  renderBoard(opponentBoardEl)
  renderBoard(playerBoardEl)
  renderPlayerShips()
}

function renderPlayerShips() {
  const ships = {
    destroyer: 2,
    sub: 3,
    cruiser: 3,
    battleship: 4,
    carrier: 5,
  }
  for (const ship in ships) {
    
    console.log(ship, ships[ship])
  }
}

function renderBoard(element) {
  row = 97
  currentCol = 1
  for (let i = 1; i <= 100; i++) {
    currentRow = String.fromCharCode(row)
    const cell = new CreateCell(currentCol, currentRow)
    element.appendChild(cell.el)
    if (!(i % 10)) { 
      row++
      currentCol -= 10
    }
    currentCol++
  }
}
