const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/response-errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Для доступа необходимо выполнить авторизацию'));
  }

  let payload;
  const userToken = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(userToken, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (_) {
    return next(new Unauthorized('Для доступа необходимо выполнить авторизацию'));
  }

  req.user = payload;
  next();
};
