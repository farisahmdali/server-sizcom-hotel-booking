var express = require('express');
const controller = require('../controller/controller');
var router = express.Router();

/* GET home page. */
router.get('/paymentOrder',controller.paymentOrder);
router.post("/paymentSuccess",controller.paymentSuccess)
router.get("/roomDetails",controller.roomdetails)

module.exports = router;
