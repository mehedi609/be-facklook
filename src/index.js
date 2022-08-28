require('dotenv').config();
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('welcome from home');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:8000`);
});
