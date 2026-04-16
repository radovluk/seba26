const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'scores.json');

const INITIAL_SCORES = {
  participants: [
    { name: 'Seba', emoji: '🎂', beers: 0 },
    { name: 'Anicka A.', emoji: '🌸', beers: 0 },
    { name: 'Vojta L.', emoji: '⚡', beers: 0 },
    { name: 'Vojta N.', emoji: '🔥', beers: 0 },
    { name: 'Peta', emoji: '🎸', beers: 0 },
    { name: 'Anicka M.', emoji: '💫', beers: 0 },
    { name: 'Tomas', emoji: '🚀', beers: 0 }
  ],
  goal: 100,
  lastUpdated: new Date().toISOString()
};

function readScores() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SCORES, null, 2));
    return INITIAL_SCORES;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeScores(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/scores', (req, res) => {
  res.json(readScores());
});

app.post('/api/beer/:name', (req, res) => {
  const data = readScores();
  const person = data.participants.find(p => p.name === req.params.name);
  if (!person) return res.status(404).json({ error: 'Not found' });
  person.beers += 1;
  writeScores(data);
  res.json(data);
});

app.delete('/api/beer/:name', (req, res) => {
  const data = readScores();
  const person = data.participants.find(p => p.name === req.params.name);
  if (!person) return res.status(404).json({ error: 'Not found' });
  if (person.beers > 0) person.beers -= 1;
  writeScores(data);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🍺 Sebova party běží na http://localhost:${PORT}`);
});
