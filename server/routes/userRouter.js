const userController = require('../controllers/userControl');

const router = require('express').Router();

router.post('/register', userController.register);

module.exports = router
