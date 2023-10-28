

/*----- constants -----*/
const playerBoard = []

/*----- state variables -----*/


/*----- cached elements  -----*/
const opponentBoardEl = document.querySelector("#opponent-board")
const playerBoardEl = document.querySelector('#player-board')
/*----- event listeners -----*/


/*----- classes -----*/

class CreateCell {
  constructor(id) {
    this.el = document.createElement('div')
    this.el.setAttribute('id', id)
    this.el.classList.add('cell')
  }
}


/*----- functions -----*/

init()

function init() {
  renderComputerBoard()
  renderPlayerBoard()
}

function renderComputerBoard() {
  currentRow = 'a'
  for (let i = 0; i < 100; i++) {
    const cell = new CreateCell()
    opponentBoardEl.appendChild(cell.el)
  }
}

function renderPlayerBoard() {
  for (let i = 0; i < 100; i++) {
    const cell = new CreateCell()
    playerBoardEl.appendChild(cell.el)
  }
}

function renderShip(type) {

}