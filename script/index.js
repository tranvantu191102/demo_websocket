let testCases = [
    { name: "Test Case 1", description: "Checks WebSocket wss:// support", run: runTestCase1 },
    { name: "Test Case 2", description: "Checks WebSocket ws:// support", run: runTestCase2 },
    { name: "Test Case 3", description: "Checks click event not working", run: runTestCase3 }
];
let results = [];

function runTestCase1() {
    return new Promise(resolve => {
        let ws = new WebSocket('wss://echo.websocket.org');
        let timeout = setTimeout(() => { ws.close(); resolve("Failed"); }, 10000);
        ws.onopen = () => { clearTimeout(timeout); ws.close(); resolve("Passed"); };
        ws.onerror = () => { clearTimeout(timeout); resolve("Failed"); };
    });
}

function runTestCase2() {
    return new Promise(resolve => {
        let ws = new WebSocket('ws://echo.websocket.org');
        let timeout = setTimeout(() => { ws.close(); resolve("Failed"); }, 10000);
        ws.onopen = () => { clearTimeout(timeout); ws.close(); resolve("Passed"); };
        ws.onerror = () => { clearTimeout(timeout); resolve("Failed"); };
    });
}

function runTestCase3(){
    let timeOut = null
    return new Promise(resolve => {
        if(timeOut) {
            clearTimeout(timeOut);
        }
        let button = document.createElement("button");
        const performance_time = window.performance.now();
        console.log("[Test Case 3] performance_time : ", performance_time);



        button.addEventListener("click", (event) => {
            console.log("[Test Case 3] event timestamp : ", event.timeStamp);

            if(performance_time < event.timeStamp){
                resolve("Passed");
            } else {
                resolve("Failed");
            }
        })

        timeOut = setTimeout(() => {
                button.click();
        }, 500);
    });
}

function runTests() {
    results = [];
    $("#test-status").removeClass().addClass("status running").html('Running tests...<img src="./img/Chasing-arrows.gif" alt="loading">');
    $("#reportTable tbody").html("");
    let index = 0;
    function next() {
        if (index < testCases.length) {
            // window.prompt("Running Test Case : ", testCases[index].name, '  Index:', index);
            let test = testCases[index];
            test.run().then(status => {
                // window.prompt("Test Case : ", test.name, status);
                results.push({ no: index + 1, name: test.name, description: test.description, status });
                updateTable();
                index++;
                next();
            }).catch(error => {
                results.push({ no: index + 1, name: test.name, description: test.description, status: 'Failed' });
                updateTable();
                index++;
                next();
            });
        } else {
            $("#test-status").removeClass("running").addClass("passed").text("All tests completed");
            document.getElementById("rerunButton").disabled = false;
            document.getElementById("sendReportButton").disabled = false;
        }
    }
    next();
}

function sendReport() {
    // let email = $("#receiverEmail").val();
    // let report = results.map(r => `${r.no}. ${r.name} - ${r.description} - ${r.status}`).join("\n");
    // Email.send({
    //     SecureToken: "your-smtp-token-here",
    //     To: email,
    //     From: "your-email@example.com",
    //     Subject: "Test Report",
    //     Body: `Test Results:\n\n${report}`
    // }).then(message => alert("Report Sent Successfully"));
    closeEmailPopup();
}



function rerunTests() { runTests(); }
function openEmailPopup() { $("#emailPopup").show(); }
function closeEmailPopup() { $("#emailPopup").hide(); }
function updateTable() {
    let tbody = results.map(test => `<tr><td>${test.no}</td><td>${test.name}</td><td>${test.description}</td><td class="${test.status.toLowerCase()}">${test.status}</td></tr>`).join("");
    $("#reportTable tbody").html(tbody);
}
$(document).ready(runTests);

