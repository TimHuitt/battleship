# Battleship

**Battleship** is a classic strategy guessing game that has been played worldwide for over a century. Though it's exact origins are unknown, it has evolved into various board games and digital versions. This version is meant to emulate the gameplay of the traditional table top game.
<br>
### Features
* Advanced computer opponent
* Customizable ship placement
* Turn based tactical game play
* Game Stats
* Pop-up notifications
</p>
<br>

---

![](./docs/sinksanksunk.png)

<br>

---
---
## [&#8680; Play Battleship! &#8678;](https://timhuitt.github.io/battleship/) &nbsp;&nbsp;&nbsp;Javascript &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; HTML &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; CSS

---
---
<br>

## Game Overview
  * ### How to Begin
    1. Begin by clicking a ship in the bottom left
    2. To place a ship, do either within the board grid space:
        * Click a starting cell
        * Click any cell in the desired direction
        <br>OR
        * Click and drag in any direction
    3. The game will begin once all pieces have been placed
      ```
      Ships must be placed within empty cells and must not exceed the grid space boundried
      ```
  * ### How to Play
    1. After all ships have been placed, you will see an indicator begin following your mouse within the grid
    2. Select any cell
    3. After your turn is complete, the computer will take a turn
    4. This process repeats until one play has lost all of their ships
  * ### Advanced Computer Opponent
    1. The computer opponent will begin by randomly firing until a ship is found

    2. Once found, the computer will search the area until a pattern is found
    
    3. Next, the computer will attempt to follow that pattern in each possible direction

    4. If the ship is reported as destroyed, the computer will restart the search
      ```
      All computer selections are generated at random based only on the data that would be available to a player
      ```


# Rules Overview
  - **Players**: 2
  - **Game Board**: 10x10 grid
    - Rows: A - J
    - Columns: 1 - 10

    ## Game Setup
    - Each player places five different ships on their own grid:
      1. Destroyer: 1 x 2 cells
      2. Submarine: 1 x 3 cells
      3. Cruiser: 1 x 3 cells
      4. Battleship: 1 x 4 cells
      5. Carrier: 1 x 5 cells

    ## Gameplay
    - Players take turns guessing a single cell (e.g., G8) on the opponent's grid.
    - A "shot" can either hit:
      1. An opponent's ship, resulting in a "hit."
      2. An empty cell, resulting in a "miss."

    ## Winning
    - When all cells occupied by a ship are hit, the ship is "sunk."
    - The first player to sink all of the opponent's ships wins the game.

---
<br>

## Completion Goals
* Add board switch animation
* Fade in/out messages

## Future Implementation Goals
- A more diverse toast system
- Actual ships