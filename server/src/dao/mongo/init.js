import mongoose from "mongoose";
import config from "config";
import { createMongoUri } from "./../../utils/URIUtil";

mongoose.Promise = global.Promise;
// const mongoConfig = config.get('mongo');
let url = 'mongodb://admin:admin123@cluster0-shard-00-00.pwbhw.mongodb.net:27017,cluster0-shard-00-01.pwbhw.mongodb.net:27017,cluster0-shard-00-02.pwbhw.mongodb.net:27017/ewarehouse-db?ssl=true&replicaSet=atlas-qtvky8-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(url, function (err) {
    console.log("MongoDB Connection URI: ", url);
    if (err) {
        console.log("Failed to connect to MongoDB");
        console.error(err);
    } else {
        console.log("Successfully connected to MongoDB");
    }
});

// var connect = mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   }); //added
  
//   connect.then(
//     (db) => {
//       //added
//       console.log("Berhasil connect Mongo DB");
//     },
//     (err) => {
//       console.log("Error DB: " + err);
//     }
//   );
