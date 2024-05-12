const fundingItem = document.querySelector(".funding-item");

for (let i = 0; i < 30; i++) {
    let box = document.createElement("div");
    box.classList.add("box");
    fundingItem.appendChild(box);
}
