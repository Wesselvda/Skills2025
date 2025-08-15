document.addEventListener("DOMContentLoaded", () => {
    const stepOne = document.querySelector(".step-1");
    const stepTwo = document.querySelector(".step-2");
    const stepThree = document.querySelector(".step-3");
    const stepOneNextButton = document.querySelector(".step-1 .next-button");
    const stepTwoBackButton = document.querySelector(".step-2 .back-button");
    const stepTwoNextButton = document.querySelector(".step-2 .next-button");
    const stepThreeBackButton = document.querySelector(".step-3 .back-button");
    const submitButton = document.querySelector(".step-3 .submit-button");
    const form = document.querySelector(".contact-form");
    const result = document.querySelector(".form-result");

    stepTwo.style.display = "none";
    stepThree.style.display = "none";

    stepOneNextButton.addEventListener("click", () => {
        stepOne.style.display = "none";
        stepTwo.style.display = "";
    })
    stepTwoNextButton.addEventListener("click", () => {
        stepTwo.style.display = "none";
        stepThree.style.display = "";
    })
    stepTwoBackButton.addEventListener("click", () => {
        stepTwo.style.display = "none";
        stepOne.style.display = "";
    })
    stepThreeBackButton.addEventListener("click", () => {
        stepThree.style.display = "none";
        stepTwo.style.display = "";
    })
    submitButton.addEventListener("click", () => {
        stepTwo.style.display = "none";
        form.style.display = "none";
        result.style.display = "flex";
    })
});