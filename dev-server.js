import WebSocket, { WebSocketServer } from "ws";
import chokidar from "chokidar";

const wss = new WebSocketServer({ port: 8081 });

let clients = new Set();

const watcher = chokidar.watch(["content.js", "popup.html", "popup.js"], {
  ignored: /node_modules/,
  persistent: true,
});

watcher.on("change", (path) => {
  console.log("change!!", path);
  const message = JSON.stringify({
    type: "fileChanged",
    path: path,
    timestamp: Date.now(),
  });

  // Notify all connected clients
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

wss.on("connection", (ws) => {
  console.log("connected!");
  clients.add(ws);
  console.log(clients);
  ws.on("close", () => {
    clients.delete(ws);
  });
});

console.log("Dev server running on ws://localhost:8081");
