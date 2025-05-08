const express = require('express');
const router = express.Router();
const { startGame, movePlayer, getState } = require('../controllers/gameController');

router.post('/start', (req, res) => {
  res.json(startGame());
});

router.post('/move', (req, res) => {
  const { direction } = req.body;
  res.json(movePlayer(direction));
});

router.get('/state', (req, res) => {
  res.json(getState());
});

module.exports = router;
