var express = require('express');
var controller = require('../Controller/dashboard');

var router = express.Router();

router.get('/dashboard/getCustomer', controller.getCustomers)

router.get('/dashboard', controller.getDashboardPage);

module.exports = router;