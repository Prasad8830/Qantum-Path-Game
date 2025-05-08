class Tile {
  constructor() {
    this.revealed = false;
    this.type = null;
  }

  reveal() {
    if (!this.revealed) {
      const rand = Math.random();
      if (rand < 0.5) this.type = 'Path';
      else if (rand < 0.75) this.type = 'Wall';
      else this.type = 'Coin';
      this.revealed = true;
    }
    return this.type;
  }
}

module.exports = Tile;
