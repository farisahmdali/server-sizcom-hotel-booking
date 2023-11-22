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
  search:async(req,res)=>{
    try{
        function parseDate(dateString) {
            const [mm, dd, yyyy] = dateString.split('/');
            return new Date(`${yyyy}-${mm}-${dd}`);
          }
          
          function formatDate(date) {
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${mm}/${dd}/${yyyy}`;
          }
          
          function getDates(startDateStr, endDateStr) {
            const startDate = parseDate(startDateStr);
            const endDate = parseDate(endDateStr);
            const dates = [];
            let currentDate = new Date(startDate);
          
            while (currentDate <= endDate) {
              dates.push(formatDate(new Date(currentDate)));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          
            return dates;
          }
          
          
          
          const allDates = getDates(req.query.checkin, req.query.checkout);
          console.log(allDates);
          
        
        const data =await getDb().collection("booking").find({payed:true,dates:{$in:allDates}}).toArray()
        let bookedDatePool = []
        let bookedDateApart = []
        let bookedDateSmall = []
        let bookedDateBig = []
        console.log(data)


        const enable = {pool:true,big:true,small:true,apart:true}
        let count = {}
        for(let i=0;i<data.length;i++){
            for(let j=0;j<data[i].rooms;j++){
                if(data[i].room==="Pool Suite"){
                    bookedDatePool = [...bookedDatePool,...data[i].dates]
                }else if(data[i].room==="Small Room"){
                    bookedDateSmall = [...bookedDateSmall,...data[i].dates]

                }else if(data[i].room==="Big Room"){
                    bookedDateBig = [...bookedDateBig,...data[i].dates]

                }else if(data[i].room==="Apartment"){
                    bookedDateApart = [...bookedDateApart,...data[i].dates]
                }
            }
        }
        for(let i=0;i<bookedDatePool.length;i++){
            if(count[bookedDatePool[i]]){
                count[bookedDatePool[i]] = count[bookedDatePool[i]]+1
                if(count[bookedDatePool[i]]>=10){
                    enable.pool = false
                    break
                }
            }else{
                count[bookedDatePool[i]] = 1
            }
        }

        for(let i=0;i<bookedDateApart.length;i++){
            if(count[bookedDateApart[i]]){
                count[bookedDateApart[i]] = count[bookedDateApart[i]]+1
                if(count[bookedDateApart[i]]>=10){
                    enable.apart = false
                    break
                }
            }else{
                count[bookedDateApart[i]] = 1
            }
        }
        for(let i=0;i<bookedDateBig.length;i++){
            if(count[bookedDateBig[i]]){
                count[bookedDateBig[i]] = count[bookedDateBig[i]]+1
                if(count[bookedDateBig[i]]>=10){
                    enable.big= false
                    break
                }
            }else{
                count[bookedDateBig[i]] = 1
            }
        }
        for(let i=0;i<bookedDateSmall.length;i++){
            if(count[bookedDateSmall[i]]){
                count[bookedDateSmall[i]] = count[bookedDateSmall[i]]+1
                if(count[bookedDateSmall[i]]>=10){
                    enable.small= false
                    break
                }
            }else{
                count[bookedDateSmall[i]] = 1
            }
        }
        console.log(enable)
        res.status(200).send({enable})
    }catch(err){

    }
  },
};
