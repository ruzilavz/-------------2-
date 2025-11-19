require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const HttpError = require('./utils/httpError');

const app = express();

app.use(cors());
app.use(morgan(process.env.LOG_FORMAT || 'combined'));
app.use(express.json());

app.use('/api', routes);

app.use((req, res, next) => {
  next(new HttpError(404, 'Route not found'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
