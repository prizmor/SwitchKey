const Router = require('express');
const router = new Router();
const controller = require('./controller/controller');
const { check } = require('express-validator');
const loginMiddleware = require('./middleware/loginMiddleware');

//логинизация
router.post('/register', [
  check('login', 'Ваш логин не прошел проверку на коректность').notEmpty(),
  check('password', 'Пороль должен быть не меньше 4 символов').isLength({min: 4})
], controller.register);//
router.post('/login', controller.login);//
router.get('/passwordRecovery', controller.getIdUserPasswordRecovery)
router.post('/passwordRecovery', controller.passwordRecovery)
//истроия
router.post('/history', loginMiddleware, controller.postHistory);//
router.delete('/history/:id', loginMiddleware, controller.deleteHistory);//
router.get('/history', loginMiddleware, controller.getHistory);//
//текст
router.get('/text/:id', loginMiddleware, controller.getTextById);//
router.get('/text', loginMiddleware, controller.getAllText);//
router.post('/text', loginMiddleware, controller.postAddText);//
router.put('/text', loginMiddleware, controller.putText);//
router.delete('/text/:id', loginMiddleware, controller.deleteText);//
//друзья
router.get('/friendRequests', loginMiddleware, controller.friendRequests);
router.get('/friends', loginMiddleware, controller.getFriends);
router.get('/blocked', loginMiddleware, controller.getBlocked)
//Уведомления
router.get('/message', loginMiddleware, controller.getMessage);
//профиль
router.get('/profile/:login', loginMiddleware, controller.getProfile)

module.exports = router;
