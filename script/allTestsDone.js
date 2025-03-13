export function allTestsDone(results) {
    let socket;
    const reportData = convertResultsToReportData(results);
    console.log("All tests done", reportData);
    connectWebSocket(socket, reportData);
}

function convertResultsToReportData(results) {

    const testCasesLength = results.length;

    let reportData = {
        testCases: results,
        total: testCasesLength,
        passed: results.filter(r => r.status === 'Passed').length,
        failed: results.filter(r => r.status === 'Failed').length,
        allPassed: results.filter(r => r.status === 'Passed').length === testCasesLength,
    };
    return reportData;
}

function connectWebSocket(socket, reportData) {
    socket = new WebSocket("ws://localhost:8080"); // Connect to WebSocket server

    socket.onopen = () => {
        console.log("The socket is opened");
        sendMessage(socket, JSON.stringify(reportData));
    };

    socket.onmessage = (event) => {
        console.log(`Message received on the wire: ${event.data}`);
    };

    socket.onclose = () => {
        console.log("The socket is closed");
    };

    socket.onerror = (error) => {
        console.log("The error: ",error);
        $(".report-status.error").addClass("show");
    }
}

function sendMessage(socket, msg) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(msg);
        $(".report-status.success").addClass("show");
    } else {
        alert("WebSocket is not connected.");
        $(".report-status.error").addClass("show");
    }
}
