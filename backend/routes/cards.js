const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
} = require('../controllers/cards');

const {
  validateCreateCard, validateCardId,
} = require('../utils/data-validation');

/* возвращает все карточки/создать/удалить */
cardRouter.get('/', getCards);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.delete('/:cardId', validateCardId, deleteCard);
/* Поставить/ убрать лайк */
cardRouter.put('/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/:cardId/likes', validateCardId, removeLike);

module.exports = cardRouter;
