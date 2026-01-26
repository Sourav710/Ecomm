const userController = require('../controllers/userControl');
const auth = require('../middleware/auth');

const router = require('express').Router();

router.post('/register', userController.register);
router.get('/refresh_token', userController.refreshToken);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/info',auth, userController.getUserInfo);

module.exports = router
