const userRouter = require('./src/modules/user/router');
const cardRouter = require('./src/modules/cards/router');
const transactionRouter = require('./src/modules/transactions/router');
const pingRouter = require('./src/modules/ping/router');
exports.initialise = async (app)=>{
    app.get("/api",function(req,res){res.send(200)})
    app.use("/api/ping", pingRouter);
    app.use("/api/user",userRouter)
    app.use("/api/card",cardRouter)
    app.use("/api/transactions", transactionRouter);
}