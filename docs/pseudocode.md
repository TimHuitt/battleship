
[Return to Planning](./planning.md)

---
- [ ] 1. **Initialize Game**
  - [ ] a. Player
    - [ ] 1. Use createCell class to set up and render empty player board
    * 10 x 10, 100 cells, empty
  - [ ] b. Computer
    - [ ] 1. Create computer card
    * Title
    * Ships remaining number
    * Ships remaining graphic
    - [ ] 2. Use createCell class to create the computer board
    * 10 x 10 grid, 100 cells, empty
  - [ ] c. Save all cells to playerBoard array and computerBoard array
---
- [ ] 2. **Player Setup**
  - [ ] a. Player selects a ship and position on the board
    * Select a ship from the player ship container
    * Click and hold the starting cell on the board
    * Drag in the direction the ship should be placed
    * Release to confirm
    * OR
    * Attach the ship to the mouse
    * Right-click to rotate
    * Click a cell to place
  - [ ] b. Player continues placing ships until all 5 ships have been added to the player board
  - [ ] c. Update playerBoard with ship locations
---
- [ ] 3. **Computer Setup**
  - [ ] a. Assign randomly selected ship locations to computerBoard array (not displayed)
---
- [ ] 4. **Begin Game**
  - [ ] a. Randomly select the first player
  - [ ] b. Alert the player which player goes first
  - [ ] c. Player Turn
    * Computer board is expanded to fit the right section
    * Player board shrinks to fit the left section
    * The player selects a cell on the computer board
    * The selected cell updates to display a hit (red) or miss (white)
      * If a hit occurs, check if hit destroys ship
      * If ship destroyed, outline all hit cells to indicate destruction
    * Check if computer has ships remaining
      * If not, end game
      * Else end turn
  - [ ] d. Computer Turn
    * Player board is expanded to fit the right section
    * Computer board shrinks to fit the left section
    * The computer selects a cell on the player board
    * The selected cell updates to display a hit (red) or miss (white)
      * If a hit occurs, check if hit destroys ship
      * If ship destroyed, outline all hit cells to indicate destruction
    * Check if player has ships remaining
      * If not, end game
      * Else end turn
---
- [ ] 5. **End Game**
  - [ ] a. If either player has lost all ships, the game is over
  - [ ] b. Winning board is enlarged to right section
  - [ ] c. Display end game message
  - [ ] d. Restart game


