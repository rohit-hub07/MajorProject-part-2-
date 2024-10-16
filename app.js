const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");


//public folder
app.use(express.static(path.join(__dirname, "/public")));

//ejs engine
app.engine("ejs", ejsMate);

//method override
app.use(methodOverride("_method"));

//view engine
app.set("view engine", "ejs");
//views folder
app.set("views", path.join(__dirname, "views"));
//middleware
app.use(express.urlencoded({ extended: true }));

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1/WanderLust");
}

const validateListing = (req, res, next)=>{
  let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
      let errMsg = error.details.map((er) => er.message).join(",");
      throw new ExpressError(400,errMsg)
    }else{
      next();
    }
}

//all listings route
app.get("/listings", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let details = await Listing.findById(id);
  res.render("listings/show.ejs", { details });
}));

//create route
app.post(
  "/listings",validateListing,
  wrapAsync(async (req, res, next) => {
    // let listing = req.body.listing;
    // console.log(listing);
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//edit route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  let info = await Listing.findById(id);
  // console.log(info);
  res.render("listings/update.ejs", { info });
}));

//update route
app.put("/listings/:id",validateListing,wrapAsync( async (req, res) => {
  if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing")
  }
  let { id } = req.params;
  let listing = req.body.listing;
  let updateVal = await Listing.findByIdAndUpdate(id, { ...listing });
  res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let destory = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// main route
app.get("/", (req, res) => {
  res.send("App is in the main route");
});

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"))
})

app.use((err, req, res, next) => {
  let { status=500, message="Something went wrong"} = err;
  res.status(status).render("error.ejs",{message})
});

app.listen(8080, () => {
  console.log("App is listening to port: 8080");
});
