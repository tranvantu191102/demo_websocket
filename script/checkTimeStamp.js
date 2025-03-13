export function checkTimeStamp() {
    let timeOut = null;
    return new Promise(resolve => {
        if (timeOut) {
            clearTimeout(timeOut);
        }
        let button = document.createElement("button");
        const performance_time = window.performance.now();
        console.log("[Test Case - CheckTimeStamp] performance_time : ", performance_time);

        button.addEventListener("click", (event) => {
            console.log("[Test Case - CheckTimeStamp] event timestamp : ", event.timeStamp);

            resolve({
                status: performance_time < event.timeStamp ? "Passed" : "Failed",
                note: `
                    <div class="time-cell">
                    <div class="time-cell-item-title">EXPECT(performancetime < event.timeStampe)</div>
                    <div class="time-cell-item">
                        <div class="time-cell-item-title">[Performance Time]: </div>
                        <div class="time-cell-item-value">${Math.floor(performance_time)}</div>
                    </div>
                    <div class="time-cell-item">
                        <div class="time-cell-item-title">[Event timestamp]: </div>
                        <div class="time-cell-item-value">${Math.floor(event.timeStamp)}</div>
                    </div>
                    </div>
                `
            });
        });

        timeOut = setTimeout(() => {
            button.click();
        }, 500);
    });
}