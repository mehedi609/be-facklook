require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { readdirSync } = require('fs');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//routes
readdirSync('./src/routes').map((r) =>
  app.use('/api/v1', require('../src/routes/' + r)),
);

// connect mongodb database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('database connected successfully'))
  .catch((err) => console.log('error connecting to mongodb', err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
