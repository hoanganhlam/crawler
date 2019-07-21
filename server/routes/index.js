var router = require('express').Router();

router.use('/users', require('./routeUser'));
router.use('/tasks', require('./routeTask'));
router.use('/campaigns', require('./routeCampaign'));
router.use('/dataset', require('./routeData'));
module.exports = router;
