const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const logger = require('../middlewares/logger.middleware');
router.use(logger);
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;
