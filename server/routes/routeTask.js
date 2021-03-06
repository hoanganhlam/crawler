const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskCtrl');
const {TaskModel} = require('core-model');

router.param('id', function (req, res, next, id) {
    TaskModel.findById(id)
        .populate('campaign')
        .then(function (instance) {
            if (!instance) {
                return res.sendStatus(404);
            }
            req.instance = instance;
            return next();
        }).catch(next);
});

/* GET home page. */
router.get('/', taskCtrl.list);
router.post('/', taskCtrl.create);
router.get('/:id', taskCtrl.retrieve);
router.put('/:id', taskCtrl.update);
router.delete('/:id', taskCtrl.delete);

module.exports = router;
