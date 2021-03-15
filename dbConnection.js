const config = require('./src/global/config');
const mongoose = require('mongoose');


async function mongooseCommection(mongoURL) {
    await mongoose.connect(mongoURL, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('Connected to the server!!!');
        }
    });
}


module.exports.startDB = async () => {
    try{
        if (process.env.NODE_ENV === 'test') {
            console.log(mongoose.connection.readyState);
            if(mongoose.connection.readyState == 0){
                await mongooseCommection(global.__MONGO_URI__);
            }
        }
        else {
            await mongooseCommection(config.mongoUrl);
        }
    }
    catch(e){
        console.log(e);
    }
}

module.exports.stopDB = async () => {
    try{
        await mongoose.connection.close(true);
        console.log("mongodb closed!!!")
    }
    catch(e){
        console.log(e);
    }
}