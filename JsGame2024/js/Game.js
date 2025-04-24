import Square from "./Square.js";

export default class Game {
    constructor (_element, _turnElement, _timeElement, _sizeSelectElement, _colorCountSelectElement, _usernameInputElement, _scoreBoardElement) {
        this.element = _element;
        this.turnElement = _turnElement;
        this.timeElement = _timeElement;
        this.usernameInputElement = _usernameInputElement;
        this.scoreBoardElement = _scoreBoardElement
        this.sizeSelectElement = _sizeSelectElement;
        this.sizeSelectElement.addEventListener("input", (e) => {
            this.size = parseInt(e.target.value);
            this.reset();
        })
        
        this.colorCountSelectElement = _colorCountSelectElement;
        this.colorCountSelectElement.addEventListener("input", (e) => {
            this.colorCount = parseInt(e.target.value);
            this.reset();
        })

        this.colorCount = parseInt(this.colorCountSelectElement.value);
        this.size = parseInt(this.sizeSelectElement.value);
        this.turnCount = 12;

        this.reset();
        this.displayScores();
    }

    get size() {
        return parseInt(this.element.style.getPropertyValue("--size"));
    }

    set size(value) {
        this.element.style.setProperty("--size", value);
    }

    reset() {
        this.wonGame = false;
        this.lostGame = false;
        this.turnsMade = 0;
        this.updateTurnElement();
        this.finishTime = 0;
        this.startTime = Date.now();
        this.squares = [];
        window.requestAnimationFrame((e) => {this.updateTime()});

        for (let x = 0; x < (this.size); x++) {
            for (let y = 0; y < (this.size); y++) {
                this.squares.push(new Square(x, y, (e) => {this.onSquareClicked(e)}, this.colorCount));
            }
        }

        this.element.replaceChildren(...this.squares.map(square => square.element));
    }

    getScores() {
        let data = localStorage.getItem("game-data");
        if (data) {
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    insertScore(username, time, turns) {
        let scores = this.getScores();

        scores.push({
            'user': username,
            'time': time,
            'turns': turns
        })

        localStorage.setItem('game-data', JSON.stringify(scores));
    }

    displayScores() {
        let scores = this.getScores();

        scores.sort((a, b) => {
            if (a.turns === b.turns) {
                return a.time < b.time;
            } else {
                return a.turns < b.turns;
            }
        });

        this.scoreBoardElement.replaceChildren(...scores.splice(0, 4).map((score) => {
            let elm = document.createElement("li");
            elm.innerText = `${score.user} - ${score.turns} beurten (${this.formatTime(score.time)})`;

            return elm;
        }))
    }

    onSquareClicked(square) {
        if (!this.wonGame && !this.lostGame) {
            const firstSquare = this.getSquareByLocation(0, 0);
            let colorAttachedSquares = this.getColorAttachedSquares(firstSquare);

            colorAttachedSquares.forEach(colorAttachedSquare => {
                colorAttachedSquare.color = square.color;
            });

            this.wonGame = true;

            this.squares.forEach(square => {
                if (square.color !== firstSquare.color) {
                    this.wonGame = false;
                }
            })

            if (this.wonGame) {
                this.finishTime = Date.now() - this.startTime;
                this.showText("You've won!");
                this.turnsMade++;
                this.updateTurnElement();
                this.insertScore(this.usernameInputElement.value.length > 0 ? this.usernameInputElement.value : "Anonymous", this.finishTime, this.turnsMade);
                this.displayScores();
            } else {
                if (this.turnsMade == this.turnCount) {
                    this.lostGame = true;
                    this.showText("Game over!");
                } else {
                    this.turnsMade++;
                    this.updateTurnElement();
                }
            }
        }
    }

    updateTurnElement() {
        this.turnElement.innerText = this.turnsMade;
    }

    getSquareByLocation(x, y) {
        return this.squares[(x * this.size) + y];
    }

    getColorAttachedSquares(square) {
        let foundSquares = new Set([square]);
        let squaresToCheck = [square]

        for (let i = 0; i < squaresToCheck.length; i++) {
            const square = squaresToCheck[i];

            let collidingSquares = this.getCollidingSquares(square);

            collidingSquares.forEach((collidingSquare) => {
                if (collidingSquare.color === square.color) {
                    if (!foundSquares.has(collidingSquare)) {
                        foundSquares.add(collidingSquare);
                        squaresToCheck.push(collidingSquare);
                    }
                }
            })
        }

        return foundSquares;
    }

    getCollidingSquares(square) {
        let collidingSquares = [];

        if (square.x > 0) collidingSquares.push(this.getSquareByLocation(square.x - 1, square.y));
        if (square.x < this.size - 1) collidingSquares.push(this.getSquareByLocation(square.x + 1, square.y));
        if (square.y > 0) collidingSquares.push(this.getSquareByLocation(square.x, square.y - 1));
        if (square.y < this.size - 1) collidingSquares.push(this.getSquareByLocation(square.x, square.y + 1));

        return collidingSquares
    }

    showText(text) {
        let currentElement = document.querySelector("p.overlay-text");
        if (currentElement) currentElement.remove();

        let textElement = document.createElement("p");
        textElement.innerText = text;
        textElement.classList = "overlay-text";

        this.element.appendChild(textElement);
    }

    updateTime() {
        if (this.wonGame) {
            this.timeElement.innerText = this.formatTime(this.finishTime);
        } else if (this.lostGame) {
            this.timeElement.innerText = "";
        } else {
            this.timeElement.innerText = this.formatTime(Date.now() - this.startTime);
            window.requestAnimationFrame((e) => {this.updateTime()});
        }
    }

    formatTime(time) {
        let minutes = Math.floor(time / 60000);
        let seconds = Math.floor((time / 1000) % 60);
        let milliseconds = (time % 1000);

        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}:${milliseconds}`;
    }
}