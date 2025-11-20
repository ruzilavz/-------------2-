require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const HttpError = require('./utils/httpError');

const app = express();

app.use(cors());
app.use(morgan(process.env.LOG_FORMAT || 'combined'));
app.use(express.json());

// 👉 САМОЕ ГЛАВНОЕ — раздаём фронтенд
app.use(express.static(__dirname));

// 👉 Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 👉 API маршруты
app.use('/api', routes);

// 👉 404 для API
app.use((req, res, next) => {
  // Пропускаем, если это запрос HTML
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  next(new HttpError(404, 'Route not found'));
});

// 👉 Обработчик ошибок
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
  console.log(`🔥 Server running at http://localhost:${port}`);
});
