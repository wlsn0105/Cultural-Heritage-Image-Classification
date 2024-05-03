import "./scroll-timeline.js";

const progress = document.querySelector(".progress");
const targetBoxes = document.querySelectorAll(".color-box");

progress.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
    timeline: new ScrollTimeline({
        scrollOffsets: [
            // body 전체 높이에 대한 게이지 바
            { target: document.body, edge: "start", threshold: 1 },
            { target: document.body, edge: "end", threshold: 1 },
        ],
    }),
});

targetBoxes.forEach((box) => {
    const boxTop = box.offsetTop;
    const boxHeight = box.offsetHeight;
    console.log(boxTop);
    console.log(boxHeight);

    const offset1 = boxTop + boxHeight - window.innerHeight;
    const offset2 = boxTop;

    // 내가 짠 이미지 등장하자마자 opacity 변경
    const offset3 = boxTop - window.innerHeight + 600;
    // 기준이 bottom
    const offset4 = boxTop + boxHeight - window.innerHeight + 1040;

    // 스크롤 시 이미지 opacity 변경
    box.animate(
        [
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: "scale(2)" },
        ],
        {
            timeline: new ScrollTimeline({
                scrollOffsets: [new CSSUnitValue(offset3, "px"), new CSSUnitValue(offset4, "px")],
            }),
        }
    );
});
