const Razorpay = require("razorpay");
const { getDb } = require("../mongodb");
const { ObjectId } = require("mongodb");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentOrder = new Map();

module.exports = {
  paymentOrder: async (req, res) => {
    try {
      let orderG;
      let id = "";
      await getDb()
        .collection("booking")
        .insertOne({ ...req.query.data, payed: false })
        .then((res) => {
          console.log(res);
          id = res.insertedId;
        });
      await instance.orders.create(
        { amount: req.query.amount, currency: "INR" },
        (err, order) => {
          if (err) {
            console.log(err);
            throw Error();
          } else {
            console.log(order);
            paymentOrder.set(id, order);
            orderG = order;
          }
        }
      );
      res.status(200).send({ orderG, id });
    } catch (err) {
      console.log(err);
    }
  },

  paymentSuccess: (req, res) => {
    try {
      const { id, order } = req.body;
      console.log(id,order,paymentOrder.get(id))
        getDb()
          .collection("booking")
          .updateOne({_id:new ObjectId(id)},{$set:{payed:true}})
          console.log("working")
          res.sendStatus(200)
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  roomdetails:async(req,res)=>{
    try {
        const data =await getDb().collection("booking").find({payed:true,room:req.query.type}).toArray()
        let bookedDate = []
        let count = {}
        for(let i=0;i<data.length;i++){
            for(let j=0;j<data[i].rooms;j++){
                bookedDate = [...bookedDate,...data[i].dates]
            }
        }
        for(let i=0;i<bookedDate.length;i++){
            if(count[bookedDate[i]]){
                count[bookedDate[i]] = count[bookedDate[i]]+1
            }else{
                count[bookedDate[i]] = 1
            }
        }
        console.log(count)
        res.status(200).send({count})
        
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
  },
};
