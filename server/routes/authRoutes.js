const express = require('express');
const router = express.Router();
const { login, addUser } = require('../controllers/authController');

router.post('/login', login);
router.get('/add', addUser);

module.exports = router;
