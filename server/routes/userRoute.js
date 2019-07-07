const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
var auth = require('./auth');

/* GET home page. */
router.get('/', userCtrl.list);
router.post('/', userCtrl.create);
router.get('/me', auth.required, userCtrl.me);
router.get('/:username', userCtrl.retrieve);
router.put('/:username', userCtrl.update);
router.delete('/:username', userCtrl.delete);
router.post('/login', userCtrl.login);

module.exports = router;
