export function checkWebSocketSupport() {
    return new Promise(resolve => {
        let ws = new WebSocket('wss://echo.websocket.org');
        let timeout = setTimeout(() => {
            ws.close();
            resolve({
                status: "Failed",
                note: "Connection Failed"
            });
        }, 10000);
        ws.onopen = () => {
            clearTimeout(timeout);
            ws.close();
            resolve({
                status: "Passed",
                note: "Websocket Connected"
            });
        };
        ws.onerror = () => {
            clearTimeout(timeout);
            resolve({
                status: "Failed",
                note: "Connection Timeout"
            });
        };
    });
}