require('dotenv').config();
const mongoose = require('mongoose');


function connectdb(){
    //Database connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology: true });
    const connection = mongoose.connection;
   //this once use for when db is connected the once is run and otherwise on is run
    connection.once('open', function () {
        console.log('MongoDB running');
      })
      .on('error', function (err) {
        console.log(err);
      });

}

// mongoose.connect(URI, {

//     useNewUrlParser: true, 
    
//     useUnifiedTopology: true 
    
//     }, err => {
//     if(err) throw err;
//     console.log('Connected to MongoDB!!!')
//     });


module.exports = connectdb;