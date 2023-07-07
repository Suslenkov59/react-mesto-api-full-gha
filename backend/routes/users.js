const userRouter = require('express').Router();

const {
  getUsers,
  getUserId,
  updateUserData,
  updateUserAvatar,
  getUserProfile,
} = require('../controllers/users');

/* Валидация */
const {
  validateUserId, validateUserUpdate, validateUserAvatar,
} = require('../utils/data-validation');

/* возвращает всех пользователей/по _id/создать */
userRouter.get('/', getUsers);
userRouter.get('/me', getUserProfile);
userRouter.get('/:userId', validateUserId, getUserId);
/* Обновить профиль/аватар */
userRouter.patch('/me', validateUserUpdate, updateUserData);
userRouter.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = userRouter;
