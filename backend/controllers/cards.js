const mongoose = require('mongoose');

const Card = require('../models/card');

const { ValidationError, CastError } = mongoose.Error;

/* 404 */
const NotFound = require('../utils/response-errors/NotFound');
/* 400 */
const BadRequests = require('../utils/response-errors/BadRequest');
/* 403 */
const Forbidden = require('../utils/response-errors/Forbidden');
/* 201 */
const { SUCCESS_CREATED } = require('../utils/response-status');

/* Получение списка карточек */
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cardList) => res.send({ data: cardList }))
    .catch((error) => next(error));
};

/* Создание карточки */
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardObject) => res.status(SUCCESS_CREATED).send({ data: cardObject }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequests('Переданы некорректные данные при создании карточки'));
      } else { next(error); }
    });
};

/* Удаление карточки */
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((selectedCard) => {
      if (!selectedCard) { return next(new NotFound('Карточка по указанному _id не найдена')); }
      if (!selectedCard.owner.equals(req.user._id)) { return next(new Forbidden('Вы не являетесь автором карточки, удаление невозможно')); }
      /* Удаление создателем */
      return Card.findByIdAndDelete(req.params.cardId)
        .orFail(() => new NotFound('Карточка по указанному _id не найдена'))
        .then(() => { res.send({ message: 'Карточка успешно удалена с сервера' }); });
    })
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequests('Переданы некорректные данные карточки'));
      } else { next(error); }
    });
};

/* Like карточки */
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else { next(new NotFound('Карточка по указанному _id не найдена')); }
    })
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequests('Переданы некорректные данные для постановки лайка'));
      } else { next(error); }
    });
};

/* Dislike карточки */
const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else { next(new NotFound('Карточка по указанному _id не найдена')); }
    })
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequests('Переданы некорректные данные для снятии лайка'));
      } else { next(error); }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, removeLike,
};
