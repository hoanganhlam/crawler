const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/ctrlCampaign');
const {CampaignModel} = require('core-model');
const auth = require('./auth');

router.param('id', function (req, res, next, id) {
    CampaignModel.findById(id)
        .then(function (instance) {
            if (!instance) {
                return res.sendStatus(404);
            }
            req.instance = instance;
            return next();
        }).catch(next);
});

/* GET home page. */
router.get('/', auth.optional, taskCtrl.list);
router.post('/', auth.required, taskCtrl.create);
router.get('/:id', auth.optional, taskCtrl.retrieve);
router.put('/:id', auth.optional, taskCtrl.update);
router.delete('/:id', auth.optional, taskCtrl.delete);
router.delete('/:id/data/', auth.optional, taskCtrl.deleteData);
module.exports = router;
