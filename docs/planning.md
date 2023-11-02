
# Project: Battleship
* Initial Style
![](./wireframe-initial.png)
* Final Style (if time permits)
![](./wireframe-final.png)
---
[View Psuedocode](./pseudocode.md)

---
## Gameplay
1. **Game Setup**
    * Player selects and places ships
2. **Player Turn**
    * Player select a cell on the computer board
        * Player hits or misses enemy ship
3. **Computer Turn**
    * Computer selects a cell on the player board
        * Computer hits or misses player ship
4. **Game End**
    * Game ends when one player has lost all of their battleships
---

## Requirements
- [ ] Render to browser
- [ ] Win/Loss logic and rendering
- [ ] Separate HTML/CSS/JS
- [ ] Vanilla JS
- [ ] Properly formatted (indentation/spacing)
- [ ] No unused code
- [ ] Sensible function/variable naming
- [ ] Consistent code structure
- [ ] Deployed on GitHub Pages
---
## Schedule
- [ ] 1. Friday/Saturday - Setup + UI

   - [x] Project Setup (Github)
     - [x] Add planning notes to planning.md
     - [x] Create pseudocode.md document in docs folder and link in planning.md
     - [x] Create static HTML / CSS / JS boilerplate

   - [x] Build primary game board
     - [x] Build dynamic elements (headings / labels)
     - [x] Build interactive elements (buttons / radios)
     - [x] Provide layout CSS

   - [ ] Stretch / Planning
     - [ ] Elaborate existing pseudocode to identify changes to the DOM
     - [ ] Experiment with audio playback (JS Sandbox)

- [ ] 2. Saturday/Sunday - Initial State + Render

   - [x] Create & Display State
     - [x] Identify DOM elements that will need to be updated
     - [x] Create and set starting values for each state
     - [x] Create render() and verify the DOM shows state in the browser

   - [x] Invoke render() in init()
     - [x] Create helper functions to control changes in state / browser

   - [ ] Manually update state to play the game (start -> end game)
     - [x] Call helper functions() in the order they would be triggered
     - [x] Testing may be manual (invoking them after init() or using the browser console
     - [] Verify the game can be played through manually

   - [x] Stretch / Planning
     - [x] Link your UI interactive elements to the handler functions
     - [x] Research advanced CSS features for future development

- [ ] 3. Monday/Tuesday - Interactions + Advanced UI Updates

   - [x] Link Interactive elements to callback functions (if not previously done)
     - [x] Each handler will call one or more helper functions that will change state
     - [x] After all helper functions execute, call the render() function
     - [x] The user should see feedback about the game state after each interaction

   - [x] Continue working on controller functions to account for game logic
     - [x] Identify which state values determine a ‘game over’ 
     - [x] Verify that the game can be played from start to ‘game over’
     - [x] Implement a ‘game over’ message and play again option
     - [ ] Remove any non-restart related handlers
     - [x] Reset the state if play again is selected.

   - [ ] Stretch: Begin building gameplay ‘quality of life’ features:
     - [ ] Start buttons
     - [ ] CSS Animations (Flip, Hide/Fade Effects)
     - [ ] Informational cards / discrete about pages to describe the rules of the game

- [ ] 4. Tuesday/Wednesday - Refine Gameplay + Stretch goals
   * Deploy application on Github

   - [x] Testing local and deployed codebase
     - [x] Verify MVP code runs without error start to finish
     - [x] Verify no debugging console.logs appear in the deployed game

   - [ ] Add stretch goals from the feature list
     - [ ] Examples include (choosing one)
       - [ ] Refactors syntax to use classes
       - [ ] Add CSS Animations
       - [ ] Add an audio player
       - [ ] Create a scoreboard, storing top scores using localStorage
       - [ ] API call for expanded content

- [ ] 5. Wednesday/Thursday - Stretch goals + Additional Styling

   - [ ] Refinement of CSS + Stretch Features
   - [ ] Explore media queries + responsive layout changes
   - [ ] Customize header / body fonts
   - [ ] Add a color theme, image assets, icons

- [ ] 6. Thursday/Friday Final Day - Documentation

   - [ ] Provide a feature freeze at 10 PM EST the night before presentations

   - [ ] Review Documentation Guidelines and update Readme.md

   - [ ] Test code on GH pages to verify desired MVP functionality is present

- [ ] 7. README.md file with these sections:

   - [ ] Game Title: A description of your game. Background info of the game is a nice touch.

   - [ ] Screenshot(s): Images of your actual game.

   - [ ] Technologies: List of the technologies used, e.g., JavaScript, HTML, CSS...

   - [ ] Getting Started: In this section include the link to your deployed game and any instructions you deem important.

   - [ ] Next Steps: Planned future enhancements (icebox items).