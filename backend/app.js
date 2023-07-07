const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

const mainRouter = require('./routes/index');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const responseHandler = require('./middlewares/response-handler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Автоматически проставлять заголовки безопасности
app.use(express.json());
app.use(limiter);
app.use(helmet());

// Основные рабочие роуты
app.use(mainRouter);

// Обработчик ответов
app.use(errors());
app.use(responseHandler);

// Служебная информация: адрес запущенного сервера
app.listen(PORT, () => {
  console.log(`Адрес сервера — ${PORT}`);
});
