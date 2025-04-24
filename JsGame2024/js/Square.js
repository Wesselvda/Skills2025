export default class Square {
    constructor(_x, _y, _onClick, _colorCount) {
        this.element = document.createElement("div");
        this.element.className = "square";
        this.element.addEventListener("click", (e) => {this.squareClicked()});
        this.onClick = _onClick;
        this.colorCount = _colorCount;

        this.colors = [
            "#00008b",
            "#0f8015",
            "#ffff11",
            "#ff0015",
            "#fec1cb",
            "#800f80",
            "#f0ba06"
        ]

        this.color = this.randomColor();

        this.x = _x;
        this.y = _y;
    }

    randomColor() {
        return this.colors[Math.floor(Math.random() * this.colorCount)];
    }

    get x() {
        return parseInt(this.element.style.getPropertyValue("--x"));
    }

    set x(value) {
        this.element.style.setProperty("--x", value);
    }

    get y() {
        return parseInt(this.element.style.getPropertyValue("--y"));
    }

    set y(value) {
        this.element.style.setProperty("--y", value);
    }

    get color() {
        return this.element.style.getPropertyValue("--color");
    }

    set color(value) {
        this.element.style.setProperty("--color", value);
    }

    squareClicked() {
        this.onClick(this)
    }
}