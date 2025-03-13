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
                note: {
                    performance_time: performance_time,
                    event_time: event.timeStamp
                }
            });
        });

        timeOut = setTimeout(() => {
            button.click();
        }, 500);
    });
}