
async function startGame() {
  const res = await fetch('/api/game/start', { method: 'POST' });
  const data = await res.json();
  window.gameState = data.game;
  updateUI("Game started");
}

async function move(dir) {
  if (!window.gameState) return;

  const res = await fetch('/api/game/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction: dir })
  });

  const data = await res.json();

  if (data.game) {
    window.gameState = data.game;
  }

  const msg =
    data.message ||
    (data.error === 'Out of bounds' ? 'Cannot move further!' : data.error) ||
    'Unknown response';
  updateUI(msg);
}



function updateUI(msg) {
  document.getElementById('status').innerText = msg;
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  if (!window.gameState) return;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = window.gameState.grid[i]?.[j];
      if (!tile) continue; 

      const div = document.createElement('div');
      div.className = 'tile ' + (tile.revealed ? tile.type : '');
      if (tile.revealed) {
        if (tile.type === 'Path') div.innerText = '⬜';      
        else if (tile.type === 'Wall') div.innerText = '🧱'; 
        else if (tile.type === 'Coin') div.innerText = '💰'; 
      } else {
        div.innerText = '?';
      }
      
      grid.appendChild(div);
    }
  }
}

