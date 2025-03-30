const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Sample JSON data
const servers = [
  { id: 0, full: 0, name: "Multiplayer Test Server", meta: { tag: "fire" } },
  { id: 1, full: 0, name: "Fireplane", meta: { tag: "fire" } },
  { id: 2, full: 0, name: "Waterscape", meta: { tag: "water" } }
];

// Handle WebSocket connections
wss.on("connection", (ws, req) => {
  console.log("📡 Client connected:", req.socket.remoteAddress);

  // Send initial world list data
  ws.send(JSON.stringify({ type: "init", servers }));

  ws.on("message", (message) => {
    console.log("📩 Received:", message);

    try {
      const data = JSON.parse(message);

      if (data.type === "filter" && data.tag) {
        const filtered = servers.filter((s) => s.meta.tag === data.tag);
        ws.send(JSON.stringify({ type: "filtered", servers: filtered }));
      }
    } catch (error) {
      console.error("🚨 Invalid JSON received:", error);
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// Serve `index.html` when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Use Render's assigned port
const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ WebSocket Server running on:`);
  console.log(`   🌍 HTTP: https://your-app-name.onrender.com`);
  console.log(`   🔗 WebSocket: wss://your-app-name.onrender.com`);
});
