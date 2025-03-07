# Snake 🐍

### Description

A simple Snake game built in React and Typescript

### How to install
Download the repo, then `cd` into the `snake` folder. Run `npm install` to install the packages, then run `npm dev` to start the app. 

### How to play
Start / pause the game with the space bar. Direct the snake with the arrow keys. Try to eat the food without hitting a wall or yourself (the snake).

### How it works
* The board state is a 2D array representing the content of each square on the board.
* Game state is a Typescript enum with four possibilities
* When the game starts, the location of the snake and the food are updated on a recurring interval. Updating the game state rerenders the board and moves the snake in the current direction of travel.
* Functions within the `useGameLogic` custom hook handle the various game play events, including snake, food, and game state management
* An HTML `audio` element plays the background music (all sounds come from [Pixabay](https://pixabay.com/)), while the food and game over sound effects are triggered using the Web Audio API