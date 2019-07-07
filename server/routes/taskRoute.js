const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskCtrl');
const {TaskModel} = require('core-model');

router.param('task', function (req, res, next, id) {
    TaskModel.findById(id)
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
router.get('/:task', taskCtrl.retrieve);
router.put('/:task', taskCtrl.update);
router.delete('/:task', taskCtrl.delete);
router.post('/:task/run', taskCtrl.run);

module.exports = router;
