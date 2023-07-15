require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());

const mainRouter = require('./routes/index');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const responseHandler = require('./middlewares/response-handler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Автоматически проставлять заголовки безопасности
app.use(express.json());
app.use(helmet());

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(limiter);

// Основные рабочие роуты
app.use(mainRouter);
app.use(errorLogger);
// Обработчик ответов
app.use(errors());
app.use(responseHandler);

// Служебная информация: адрес запущенного сервера
app.listen(PORT, () => {
  console.log('Сервер успешно запущен');
});
