const userController = require('../controllers/userControl');

const router = require('express').Router();

router.post('/register', userController.register);
router.get('/refresh_token', userController.refreshToken);

module.exports = router
