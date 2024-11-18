// Récupérer le canvas et le contexte de dessin
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuster la taille du canvas à la taille de la fenêtre
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Charger l'image de fond
const backgroundImage = new Image();
backgroundImage.src = 'background2.jpeg'; // Chemin de l'image

// Informations du joueur
let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: 'blue',
  speed: 5,
};

// Gestion des touches
let keys = {};

// Écouteurs d'événements pour les touches
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Mettre à jour la position du joueur
function updatePlayer() {
  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  // Empêcher le joueur de sortir du canvas
  if (player.x - player.radius < 0) player.x = player.radius;
  if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
  if (player.y - player.radius < 0) player.y = player.radius;
  if (player.y + player.radius > canvas.height) player.y = canvas.height - player.radius;
}

// Dessiner le joueur
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

// Boucle de jeu principale
function gameLoop() {
  // Dessiner l'image de fond
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Mettre à jour et dessiner le joueur
  updatePlayer();
  drawPlayer();

  requestAnimationFrame(gameLoop); // Continuer la boucle
}

// Démarrer la boucle de jeu
backgroundImage.onload = () => {
  gameLoop();
};
