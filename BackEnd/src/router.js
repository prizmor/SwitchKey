const Router = require('express');
const router = new Router();
const controller = require('./controller');
const { check } = require('express-validator');
const loginMiddleware = require('./middleware/loginMiddleware');

//логинизация
router.post('/register', [
  check('login', 'Ваш логин не прошел проверку на коректность').notEmpty(),
  check('password', 'Пороль должен быть не меньше 4 символов').isLength({min: 4})
], controller.register);//
router.post('/login', controller.login);//
//истроия
router.post('/history', loginMiddleware, controller.postHistory);//
router.delete('/history', loginMiddleware, controller.deleteHistory);//
router.get('/history', loginMiddleware, controller.getHistory);//
//текст
router.get('/text/:id', loginMiddleware, controller.getTextById);//
router.get('/text', loginMiddleware, controller.getAllText);//
router.post('/text', loginMiddleware, controller.postAddText);//
router.put('/text', loginMiddleware, controller.putText);//
router.delete('/text', loginMiddleware, controller.deleteText);//


module.exports = router;
