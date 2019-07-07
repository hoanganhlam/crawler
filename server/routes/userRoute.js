const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');

/* GET home page. */
router.get('/', userCtrl.getAllUsers);
router.get('/:username', userCtrl.getUserDetail);
router.put('/:username', userCtrl.updateUser);
router.post('/create', userCtrl.createUser);

module.exports = router;
