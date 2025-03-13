import { checkTimeStamp } from './checkTimeStamp.js';
import { checkWebSocketSupport } from './checkWebSocketSupport.js';
import { checkWebGLImage, setImageSampleForTC4 } from './checkWebGLImage.js';
import { allTestsDone } from './allTestsDone.js';
import { checkDecryptCode, checkEncryptCode } from './checkEncryptCode.js';

let testCases = [
    {
        name: "Test case 1🚗🚗",
        description: "Checks WebSocket wss:// support",
        run: checkWebSocketSupport,
        note: '-'
    },
    {
        name: "Test case 2",
        description: "This test case verifies that the event timestamp (event_time) of a button click is greater than the recorded performance time (performance_time) when the event listener is triggered.",
        run: checkTimeStamp,
        note: ''
    },
    {
        name: "Test case 4",
        description: "Verify the webgl images",
        run: checkWebGLImage,
        note: ''
    },
    {
        name: "Test case 5",
        description: "Verify the encryption",
        run: checkEncryptCode,
        note: ''
    },
    {
        name: "Test case 6",
        description: "Verify the decryption",
        run: checkDecryptCode,
        note: ''
    }
];

let results = [];

export function runTests() {
    results = [];
    $("#test-status").removeClass().addClass("status running").html('Running tests...<span class="loader"></span>');
    $("#reportTable tbody").html("");
    document.getElementById("rerunButton").disabled = true;
    document.getElementById("sendReportButton").disabled = true;

    let index = 0;
    function next() {
        if (index < testCases.length) {
            let test = testCases[index];
            test.run().then(res => {
                results.push({ no: index + 1, name: test.name, description: test.description, status: res.status, note: res.note });
                updateTable();
                index++;
                next();
            }).catch(error => {
                results.push({ no: index + 1, name: test.name, description: test.description, status: 'Failed', note: test.note });
                updateTable();
                index++;
                next();
            });
        } else {
            $("#test-status").removeClass("running").addClass("passed").text("All tests completed");
            document.getElementById("rerunButton").disabled = false;
            document.getElementById("sendReportButton").disabled = false;

            allTestsDone(results);
        }
    }
    next();
}

function sendReport() {
    closeEmailPopup();
}

export function rerunTests() {
    $(".report-status.success").removeClass("show");
    $(".report-status.error").removeClass("show");
    runTests();
}
export function openEmailPopup() { $("#emailPopup").show(); }
export function closeEmailPopup() { $("#emailPopup").hide(); }
function updateTable() {
    let tbody = results.map(test => `<tr><td>${test.no}</td><td>${test.name}</td><td>${test.description}</td><td class="${test.status.toLowerCase()}">${test.status}</td><td>${test.note}</td></tr>`).join("");
    $("#reportTable tbody").html(tbody);
}

$(document).ready(function () {
    setImageSampleForTC4();
    runTests();

    $("#rerunButton").click(rerunTests);
    $("#sendReportButton").click(openEmailPopup);

    $(".send-report-btn").click(sendReport);
    $(".cancel-report-btn").click(closeEmailPopup);

});


