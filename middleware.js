const jwt = require("jsonwebtoken")
module.exports = {
    verify:(req,res,next)=>{
        try {
            const user = jwt.verify(req.query.token,process.env.KEY)
            if(user){
                next()
            }
        } catch (error) {
            res.sendStatus(403)
        }
    }
}