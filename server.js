const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);


const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Un joueur est connecté :', socket.id);


  socket.on('message', (data) => {
  });

  socket.on('disconnect', () => {
    console.log('Joueur déconnecté :', socket.id);
  });
});

app.use(express.static(path.join(__dirname, 'front')));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

