const Tile = require('../models/Tile');

let game = null;

function initGame() {
  const grid = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => new Tile()));
  const startType = grid[1][1].reveal();
const player = {
  x: 1,
  y: 1,
  stamina: 6,
  coins: startType === 'Coin' ? 1 : 0, 
};
  return { grid, player, status: 'playing' };
}

function isBoundary(x, y) {
  return x === 0 || x === 3 || y === 0 || y === 3;
}

function hasAnyValidMoves(x, y, grid) {
  const directions = [
    [0, 1],  
    [0, -1], 
    [1, 0],  
    [-1, 0], 
  ];
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4) {
      if (!grid[nx][ny].revealed) {
        return true;
      }
    }
  }
  return false;
}

function movePlayer(direction) {
  if (!game || game.status !== 'playing') return { error: 'Game not started or already ended.' };

  if (!hasAnyValidMoves(game.player.x, game.player.y, game.grid)) {
    game.status = 'lost';
    return {
      message: 'No valid moves left. Game over.',
      game,
    };
  }

  const dirMap = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };

  if (!(direction in dirMap)) return { error: 'Invalid direction' };

  const [dx, dy] = dirMap[direction];
  const nx = game.player.x + dx;
  const ny = game.player.y + dy;

  if (nx < 0 || nx > 3 || ny < 0 || ny > 3) {
    return { error: 'Out of bounds', game };
  }
  if (game.grid[nx][ny].revealed) {
    return {
      message: 'You cannot move to a tile that is already revealed.',
      game,
    };
  }

  const tile = game.grid[nx][ny];
  const type = tile.reveal();

  if (type === 'Wall') return { message: 'Hit a wall. Move blocked.', stamina: game.player.stamina, game };

  game.player.x = nx;
  game.player.y = ny;
  game.player.stamina -= 1;

  if (type === 'Coin') game.player.coins += 1;

  if (isBoundary(nx, ny) && game.player.coins >= 2) {
    game.status = 'won';
    return {
      message: 'You reached the boundary with enough coins. You win!',
      game,
    };
  }

  if (game.player.stamina === 0) {
    game.status = 'lost';
    return { message: 'Out of stamina. Game over.', game };
  }

  return { message: `Moved to (${nx}, ${ny})`, tileType: type, game };
}

module.exports = {
  startGame: () => {
    game = initGame();
    return { message: 'Game started', game };
  },
  movePlayer,
  getState: () => {
    if (!game) return { error: 'No game in progress.' };
    return game;
  },
};
