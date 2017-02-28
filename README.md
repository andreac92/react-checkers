# React Checkers
Classic checkers game made with React/JS.

## Code
* Initialized with create-react-app
* React components are in src/App.js
* Checkers game logic is in src/board.js
* Tests in src/App.test.js

## Details
* Game is between two players
* Players select a checker by clicking it. Clicking on an empty square moves the checker if it is a legal move.
* Game switches player turn after player has completed all legal moves for that turn
* Game ends when one player no longer has any moves (and thus the other player wins)
* When a player's checker reaches the last row of the opposite end of the board this results in a King checker, which can move forwards and backwards. Kings are indicated by a crown icon.

## Future features
* Ability to name each player
* Ability to drag checkers
* Ability to play a "computer" opponent
