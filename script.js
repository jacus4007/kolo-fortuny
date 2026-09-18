const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spinButton");
const result = document.getElementById("result");

let rotation = 0;

spinButton.addEventListener("click", () => {
    spinButton.disabled = true;
    result.textContent = "";

    const randomRotation = 1800 + Math.floor(Math.random() * 360);

    rotation += randomRotation;

    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        result.textContent = "🎉 Gratulacje!";
        spinButton.disabled = false;
    }, 4000);
});
