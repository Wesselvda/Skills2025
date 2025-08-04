const darkModeToggle = document.getElementById('darkModeToggle');
const contrastToggle = document.getElementById('contrastToggle');
const increaseText = document.getElementById('increaseText');
const decreaseText = document.getElementById('decreaseText');
const speakButton = document.getElementById('speak');
const bio = document.getElementById('bio');
const name = document.getElementById('name');

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("light")) {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark")
    } else if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        localStorage.setItem("theme", "light")
    } else {
        if (window.getComputedStyle(document.body).backgroundColor === "rgb(255, 255, 255)") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.add("light");
        }
    }
});


// Text size
class TextSize {
    static minValue = .3;
    static maxValue = 2.5;
    static stepSize = .1;

    static get current() {
        let parsedTextSize = parseFloat(document.body.style.getPropertyValue("--text-size"));
        return (parsedTextSize ? parsedTextSize : 1);
    }

    static set current(value) {
        if (value >= TextSize.minValue && value <= TextSize.maxValue) {
            localStorage.setItem("textSize", value);
            document.body.style.setProperty("--text-size", value);
        }
    }

    static increase() {
        console.log(TextSize.stepSize);
        TextSize.current += TextSize.stepSize;
    }

    static decrease() {
        TextSize.current -= TextSize.stepSize;
    }
}

increaseText.addEventListener("click", TextSize.increase);
decreaseText.addEventListener("click", TextSize.decrease)


// Speech
speakButton.addEventListener("click", () => {
    let textToSpeak = new SpeechSynthesisUtterance(name.innerText + "\n" + bio.innerText);
    speechSynthesis.speak(textToSpeak);
})

// High contrast
contrastToggle.addEventListener("click", () => {
    if (document.body.classList.contains("high-contrast")) {
        document.body.classList.remove("high-contrast");
        localStorage.setItem("highContrast", false);
    } else {
        document.body.classList.add("high-contrast");
        localStorage.setItem("highContrast", true);
    }
})


// Loading saved states
document.addEventListener("DOMContentLoaded", () => {
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        if (savedTheme === "light") {
            document.body.classList.add("light");
        } else if (savedTheme === "dark") {
            document.body.classList.add("dark");
        }
    }

    let savedTextSize = localStorage.getItem("textSize");

    if (savedTextSize) TextSize.current = savedTextSize;

    let highContrast = localStorage.getItem("highContrast");
    
    if (highContrast) {
        document.body.classList.add("high-contrast");
    }
});