document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const menu = document.getElementById('menu');
  const playerNameInput = document.getElementById('playerName');
  const startGameButton = document.getElementById('startGame');


  const socket = io();

  socket.on('userConnected', (data) => {
  const message = document.createElement('p');
  message.textContent = `Un joueur s'est connecté : ${data.id}`;
  document.body.appendChild(message);
  });

  socket.on('userDisconnected', (data) => {
  const message = document.createElement('p');
  message.textContent = `Un joueur s'est déconnecté : ${data.id}`;
  document.body.appendChild(message);
  });


  const mapWidth = 5000; ///largeur
  const mapHeight = 5000;///hauteur

  const backgroundImage = new Image();
  backgroundImage.src = 'background2.jpeg';

  //Utilisation de l'IA pour intégrer la musique 
  const backgroundMusic = new Audio('audio/background-music.mp3'); // Mettez le chemin correct vers votre fichier audio
  backgroundMusic.loop = true; // Pour que la musique se répète en boucle
  backgroundMusic.volume = 0.5; // Réglez le volume (entre 0.0 et 1.0) 

  backgroundMusic.addEventListener('error', (e) => {
    console.error('Erreur lors du chargement de la musique de fond :', e);
  });

  let player = {
    x: mapWidth / 2,
    y: mapHeight / 2,
    radius: 20,
    color: 'blue',
    speed: 5,
    points: 0,
    name: '',
  };

  let food = [];
  let keys = {};

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  function generateFood(amount = 200) {
    for (let i = 0; i < amount; i++) {
      food.push({
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight,
        radius: 5,
        color: 'green',
      });
    }
  }

  function eatFood() {
    for (let i = 0; i < food.length; i++) {
      const dx = player.x - food[i].x;
      const dy = player.y - food[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.radius + food[i].radius) {
        player.points++;
        player.radius++;
        food.splice(i, 1);
        i--;
      }
    }
  }

  function updatePlayer() {
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > mapWidth) player.x = mapWidth - player.radius;
    if (player.y - player.radius < 0) player.y = player.radius;
    if (player.y + player.radius > mapHeight) player.y = mapHeight - player.radius;

    eatFood();
  }

  function drawGame() {
    const offsetX = Math.min(
      Math.max(player.x - canvas.width / 2, 0),
      mapWidth - canvas.width
    );
    const offsetY = Math.min(
      Math.max(player.y - canvas.height / 2, 0),
      mapHeight - canvas.height
    );

    if (backgroundImage.complete) {
      ctx.drawImage(backgroundImage, -offsetX, -offsetY, mapWidth, mapHeight);
    }

    for (let i = 0; i < food.length; i++) {
      const f = food[i];
      ctx.beginPath();
      ctx.arc(f.x - offsetX, f.y - offsetY, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = f.color;
      ctx.fill();
      ctx.closePath();
    }

    ctx.beginPath();
    ctx.arc(
      player.x - offsetX,
      player.y - offsetY,
      player.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    ctx.font = '14px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, player.x - offsetX, player.y - player.radius - offsetY - 15);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Points: ${player.points}`, 600, 30);
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    drawGame();
    requestAnimationFrame(gameLoop);
  }
  
  startGameButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (!name) {
      alert('Veuillez entrer votre prénom');
      return;
    }
    player.name = name;
    menu.style.display = 'none';
    canvas.style.display = 'block';

    backgroundMusic.play().catch((e) => {
      console.error('La musique n\'a pas pu démarrer automatiquement :', e);
    });

    generateFood(500);
    gameLoop();
  });
});
