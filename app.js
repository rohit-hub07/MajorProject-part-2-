const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//public folder
app.use(express.static(path.join(__dirname,"/public")))

//ejs engine
app.engine("ejs",ejsMate);

//method override
app.use(methodOverride("_method"))

//view engine
app.set("view engine", "ejs");
//views folder
app.set("views",path.join(__dirname,"views"));
//middleware
app.use(express.urlencoded({ extended: true}));

main().then((res)=>{
  console.log("Connected to DB");
}).catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect("mongodb://127.0.0.1/WanderLust");
}

//all listings route
app.get("/listings",async (req,res)=>{
  let allListings = await Listing.find({});
  res.render("listings/index.ejs",{ allListings})
});

// new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id",async (req,res)=>{
  let { id } = req.params;
  let details = await Listing.findById(id);
  res.render("listings/show.ejs",{ details});
})

//create route
app.post("/listings",async (req,res)=>{
  let listing = req.body.listing;
  // console.log(listing);
  let newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings");
});


//edit route
app.get("/listings/:id/edit",async (req,res)=>{
  let { id } = req.params;
  let info = await Listing.findById(id);
  // console.log(info);
  res.render("listings/update.ejs", { info })
})

//update route
app.put("/listings/:id",async(req,res)=>{
  let { id } = req.params;
  let listing = req.body.listing;
  let updateVal = await Listing.findByIdAndUpdate(id,{...listing});
  res.redirect("/listings");
})

//delete route
app.delete("/listings/:id",async (req,res)=>{
  let { id } = req.params;
  let destory = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// main route
app.get("/",(req,res)=>{
  res.send("App is in the main route");
});

app.listen(8080,()=>{
  console.log("App is listening to port: 8080");
})