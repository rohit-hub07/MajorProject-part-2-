const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main().then((res)=>{
  console.log("Connected to DB");
}).catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect("mongodb://127.0.0.1/WanderLust");
}

const initDb = async() =>{
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
}

initDb();