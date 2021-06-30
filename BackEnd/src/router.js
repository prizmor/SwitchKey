const Router = require('express');
const router = new Router();
const controller = require('./controllers/controller');
const AuthController = require('./controllers/authController/index');
const HistoryController = require('./controllers/historyController/index');
const TextController = require('./controllers/textController/index');
const FriendsController = require('./controllers/friendsController/index');
const MessageController = require('./controllers/messageController/index');
const ProfileController = require('./controllers/profileController/index');
const { check } = require('express-validator');
const loginMiddleware = require('./middleware/loginMiddleware');

//логинизация
router.post('/auth/register', [
  check('login', 'Ваш логин не прошел проверку на коректность').notEmpty(),
  check('password', 'Пороль должен быть не меньше 4 символов').isLength({min: 4})
], AuthController.register);//
router.post('/auth/login', AuthController.login);//
router.get('/auth/passwordRecovery', AuthController.getIdUserPasswordRecovery)
router.post('/auth/passwordRecovery', AuthController.passwordRecovery)
//истроия
router.post('/history', loginMiddleware, HistoryController.postHistory);//
router.delete('/history/:id', loginMiddleware, HistoryController.deleteHistory);//
router.get('/history', loginMiddleware, HistoryController.getHistory);//
//текст
router.get('/text/:id', loginMiddleware, TextController.getTextById);//
router.get('/text', loginMiddleware, TextController.getAllText);//
router.post('/text', loginMiddleware, TextController.postAddText);//
router.put('/text', loginMiddleware, TextController.putText);//
router.delete('/text/:id', loginMiddleware, TextController.deleteText);//
//друзья
router.get('/friends/requests', loginMiddleware, FriendsController.friendRequests);
router.get('/friends', loginMiddleware, FriendsController.getFriends);
router.get('/friends/blocked', loginMiddleware, FriendsController.getBlocked)
//Уведомления
router.get('/message', loginMiddleware, MessageController.getMessage);
//профиль
router.get('/profile/:login', loginMiddleware, ProfileController.getProfile)

module.exports = router;
