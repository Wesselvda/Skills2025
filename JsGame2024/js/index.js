import Game from './Game.js';

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game(
        document.getElementById("game-container"),
        document.getElementById("turn"),
        document.getElementById("time"),
        document.getElementById("size-select"),
        document.getElementById("colorcount-select"),
        document.getElementById("username-input"),
        document.getElementById("scoreboard")
    );

    const startButton = document.getElementById("start-button");

    startButton.addEventListener("click", () => {
        game.reset();
    })
})