var express = require('express');
var controller = require('../Controller/dashboard');
const { route } = require('./edit');

var router = express.Router();

router.get('/dashboard/getCustomer', controller.getCustomers)

router.get('/dashboard', controller.getDashboardPage);

module.exports = router;