require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Автоматически проставлять заголовки безопасности
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

// CORS
app.use(cors);

// Crash test endpoint
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

const mainRouter = require('./routes/index');

// Основные рабочие роуты
app.use(mainRouter);

app.use(errorLogger);

// Обработчик ошибок от celebrate и других источников
app.use(errors());

const responseHandler = require('./middlewares/response-handler');
app.use(responseHandler);

// Служебная информация: адрес запущенного сервера
app.listen(PORT, () => {
  console.log('Сервер успешно запущен');
});
