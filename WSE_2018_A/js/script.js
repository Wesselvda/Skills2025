let selectedEasingFunctions = [];

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

    for (let easingFunction of easingFunctions) {
        const wrapper = document.createElement("div");
        wrapper.className = "option-wrapper";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${easingFunction.text}-input`;
        checkbox.addEventListener("change", (e) => toggleEasingFunction(e, easingFunction));
        wrapper.appendChild(checkbox);

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.innerText = easingFunction.text;
        wrapper.appendChild(label);

        optionsElement.appendChild(wrapper);
    }

    document.getElementById("slider").addEventListener("input", updateCanvas);
    document.getElementById("playbutton").addEventListener("click", playAnimation);

    updateCanvas();
}

function toggleEasingFunction(event, easingFunction) {
    if (event.target.checked) {
        selectedEasingFunctions.push(easingFunction);
    } else {
        selectedEasingFunctions = selectedEasingFunctions.filter(fn => fn.text !== easingFunction.text);
    }
    updateCanvas();
}

function drawCanvasLines(ctx) {
    ctx.reset();
    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 1100);
    ctx.lineTo(1100, 1100);
    ctx.stroke();

    ctx.font = "bold 50px sans-serif";
    ctx.fillText("100%", 25, 75);
    ctx.fillText("3s", 1100, 1150);
    
    selectedEasingFunctions.forEach((fn, index) => {
        ctx.beginPath();
        ctx.moveTo(100, 1100);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 10;

        for (let i = 0; i < 1000; i++) {
            const t = i / 1000;
            const y = eval(`let t = ${t}; ${fn.equation}`) * 1000;
            ctx.lineTo(i + 100, 1100 - y);
        }
        ctx.stroke();
    });
}

function updateCanvas() {
    const canvas = document.getElementById("easing-canvas");
    const ctx = canvas.getContext("2d");

    drawCanvasLines(ctx);

    const sliderValue = document.getElementById("slider").value;

    selectedEasingFunctions.forEach((fn, index) => {
        const t = sliderValue / 100;
        const YPercentage = eval(`let t = ${t}; ${fn.equation}`) * 100;
        const circleX = 100 + (sliderValue * 10);
        const circleY = 1100 - (YPercentage * 10);

        ctx.beginPath();
        ctx.arc(circleX, circleY, 30, 0, 2 * Math.PI);
        ctx.lineWidth = 10;
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = "#000"
        ctx.font = "bold 50px sans-serif";
        ctx.textAlign = "center"
        ctx.fillText(Math.round(YPercentage), circleX, circleY + 15);
    })
}

function playAnimation() {
    const sliderElement = document.getElementById("slider");

    sliderElement.value++;
    updateCanvas();

    if (sliderElement.value < 100) setTimeout(playAnimation, 30);
}