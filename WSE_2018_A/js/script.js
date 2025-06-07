let currentEasingFunction = null;

document.addEventListener("DOMContentLoaded", () => {
    fetch('data/easing-functions-subset-3.json').then(res => {
        return res.json();
    }).then(data => {
        parseData(data);
    }).catch(err => {
        console.error(err);
    })
});

function parseData(data) {
    const easingFunctions = Object.values(data.easingFunctions);

    const optionsElement = document.getElementById("options");

    for (let i = 0; i < easingFunctions.length; i++) {
        const easingFunction = easingFunctions[i];

        const wrapper = document.createElement("div");
        wrapper.className = "option-wrapper";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = easingFunction.text + "-input";
        radio.name = "easingoption";
        radio.addEventListener("change", (e) => { selectEasingFunction(e, easingFunction) })
        wrapper.appendChild(radio);
        const label = document.createElement("label");
        label.htmlFor = radio.id;
        label.innerText = easingFunction.text;
        wrapper.appendChild(label);

        optionsElement.appendChild(wrapper);
    }

    const sliderElement = document.getElementById("slider");
    sliderElement.addEventListener("input", (e) => {
        updateCanvas();
    })
    updateCanvas();

    const playButton = document.getElementById("playbutton");
    playButton.addEventListener("click", () => {
        playAnimation();
    });
}

function selectEasingFunction(e, easingFunction) {
    currentEasingFunction = easingFunction;
    updateCanvas();
}

function drawCanvasLines(ctx) {
    ctx.reset();
    ctx.beginPath();

    if (currentEasingFunction) {
        ctx.moveTo(100, 1100);
        ctx.lineWidth = 15;

        for (let i = 0; i < 1000; i++) {
            const nextStep = i / 1000;
            const nextYPos = 1100 - (eval(`let t = ${nextStep}; ${currentEasingFunction.equation}`) * 1000);
            ctx.lineTo(i + 100, nextYPos)
        }
        ctx.stroke();
    }

    ctx.lineWidth = 5;
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 1100);
    ctx.lineTo(1100, 1100);
    ctx.stroke();

    ctx.font = "bold 50px sans-serif";
    ctx.fillText("100%", 25, 75);
    ctx.fillText("3s", 1100, 1150);
}

function updateCanvas() {
    const canvas = document.getElementById("easing-canvas");
    const ctx = canvas.getContext("2d");

    drawCanvasLines(ctx);

    if (currentEasingFunction) {
        let sliderValue = document.getElementById("slider").value;

        const circleX = 100 + (sliderValue * 10);
        const YPercentage = (eval(`let t = ${sliderValue / 100}; ${currentEasingFunction.equation}`) * 100);
        const circleY = 1100 - (YPercentage * 10);

        ctx.beginPath();
        ctx.arc(circleX, circleY, 50, 0, 2 * Math.PI);
        ctx.lineWidth = 15;
        ctx.fillStyle = "#fff"
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = "#000"
        ctx.font = "bold 50px sans-serif";
        ctx.textAlign = "center"
        ctx.fillText(Math.round(YPercentage), circleX, circleY + 15);
    }
}

function playAnimation() {
    const sliderElement = document.getElementById("slider");

    sliderElement.value++;
    updateCanvas();

    if (sliderElement.value < 100) setTimeout(playAnimation, 30);
}