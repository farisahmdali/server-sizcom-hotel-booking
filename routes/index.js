var express = require('express');
const controller = require('../controller/controller');
const { verify } = require('../middleware');
var router = express.Router();

/* GET home page. */
router.get('/paymentOrder',controller.paymentOrder);
router.post("/paymentSuccess",controller.paymentSuccess)
router.get("/roomDetails",controller.roomdetails)
router.get("/search",controller.search)
router.get("/login",controller.login)
router.get("/data",verify,controller.data)
router.delete("/delete/:_id",verify,(req,res)=>{
    controller.delete(req.params._id)
    res.sendStatus(200)
})

module.exports = router;
