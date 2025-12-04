const { WebSocketServer, WebSocket } = require('ws');

const connections = new Map();

function initializeWebsockets(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', (ws) => {
        ws.isAlive = true;
        let username = null;
        
        console.log('New WebSocket connection established.');


        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());

                if (data.type === 'register' && data.username) {
                    username = data.username.toLowerCase();
                    if (!connections.has(username)) {
                        connections.set(username, []);
                    }
                    connections.get(username).push(ws);
                    console.log(`${username} registered with WebSocket. Total connections: ${connections.get(username).length}`);
                }
            } catch (e) {
                console.error("Received non-JSON or invalid message: ", message.toString());
            }
        });

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('close', () => {
            if (username && connections.has(username)) {
                const sockets = connections.get(username);
                const index = sockets.indexOf(ws);
                if (index > -1) {
                    sockets.splice(index, 1);
                    if (sockets.length === 0) {
                        connections.delete(username);
                    }
                    console.log(`Connection for ${username} closed. Remaining: ${connections.has(username) ? connections.get(username).length : 0}`);
                }
            }
        });

        ws.on('error', (err) => console.error('WebSocket error: ', err.message));
    });

    setInterval(() => {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping();
        });
    }, 10000);
}

function notifyUser(username, payload) {
    const userConnections = connections.get(username.toLowerCase());
    if(userConnections) {
        const message = JSON.stringify(payload);
        userConnections.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(message);
                console.log(`Notification sent to ${username}: ${payload.type}`);
            }
        });
    } else {
        console.log(`No active WebSocket connections for ${username}.`);
    }
}

module.exports = { initializeWebsockets, notifyUser };