const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

const worlds = [
  { id: 0, name: "Fireplane", path: "/worlds/fireplane", icon: "fire", full: 0 },
  { id: 1, name: "Waterscape", path: "/worlds/waterscape", icon: "water", full: 0 }
];

// Serve world list API
app.get('/game-api/v2/worlds', (req, res) => {
  res.json(worlds);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Map world IDs to namespaces dynamically
const namespaces = {};
const userMaps = {}; // Store player data per namespace (worldId)

worlds.forEach(world => {
  const ns = io.of(world.path); // use world path as namespace
  namespaces[world.id] = ns;
  userMaps[world.id] = new Map();

  ns.on('connection', (socket) => {
    // Extract query params from socket.handshake
    const { userId, worldId, userToken, zone } = socket.handshake.query;

    // Basic validation
    if (!userId || !userToken || Number(worldId) !== world.id) {
      console.log(`❌ Rejecting connection: invalid userId, token, or worldId for socket ${socket.id}`);
      socket.disconnect(true);
      return;
    }

    console.log(`✅ Player connected: socket ${socket.id} in worldId ${worldId} (${world.name})`);

    // Save user data on connection (could be extended to real auth)
    userMaps[world.id].set(socket.id, {
      userId,
      userToken,
      zone,
      socketId: socket.id,
      wizardName: 'unknown wizard', // default, updated later
      wizardData: null
    });

    // Listen for wizard-update event from client
    socket.on('wizard-update', (payload) => {
      const userData = userMaps[world.id].get(socket.id);
      if (!userData) return;

      userData.wizardName = payload.wizard?.appearance?.name || 'unknown wizard';
      userData.wizardData = payload.wizard || null;

      console.log(`📡 Wizard update from ${socket.id} in worldId ${worldId}:`, userData.wizardName);
    });

    // Listen for messages and broadcast them
    socket.on('message', (message) => {
      const userData = userMaps[world.id].get(socket.id) || {};
      console.log(`💬 Message from ${socket.id} (${userData.userId || 'unknown'}) in worldId ${worldId}:`, message);

      ns.emit('message', {
        id: socket.id,
        userID: userData.userId,
        wizardName: userData.wizardName,
        message
      });
    });

    // Send player list to the newly connected socket
    const players = Array.from(ns.sockets.keys());
    socket.emit('playerList', players);

    // Notify others that a player joined
    socket.broadcast.emit('playerJoined', { id: socket.id });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userData = userMaps[world.id].get(socket.id) || {};
      console.log(`❌ Player disconnected from worldId ${worldId}: socket ${socket.id}`);
      console.log(`   UserID: ${userData.userId || 'unknown'}`);
      console.log(`   Wizard Name: ${userData.wizardName || 'unknown wizard'}`);

      userMaps[world.id].delete(socket.id);

      ns.emit('playerLeft', { id: socket.id });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`World list API at http://localhost:${PORT}/game-api/v2/worlds`);
});
