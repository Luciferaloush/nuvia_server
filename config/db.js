const mongoose = require('mongoose');

const connectDB = async () => {
          try{
                    await mongoose.connect(process.env.MONGO_URL)
                    console.log(`Connected To Database ${mongoose
                              .connection.host}`);
                              console.log(mongoose.modelNames()); 

          }catch(e){
                    console.log("DB error", e);
          }
};
 module.exports = connectDB;