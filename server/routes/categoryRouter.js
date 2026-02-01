const Router = require('express').Router();
const categoryRouter = require('../controllers/categoryctrl');

Router.route('/category')
.get(require('../controllers/categoryctrl').getCategories)
.post(require('../controllers/categoryctrl').createCategory);
