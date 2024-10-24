const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next)=>{
  let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
      let errMsg = error.details.map((er) => er.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
}

//all listings route
router.get("/", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// show route
router.get("/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let details = await Listing.findById(id).populate("reviews");
  if(!details){
    req.flash("error", "Listing doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { details });
}));

//create route
router.post(
  "/",validateListing,
  wrapAsync(async (req, res, next) => {
    // let listing = req.body.listing;
    // console.log(listing);
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Lsiting created!")
    res.redirect("/listings");
  })
);

//edit route
router.get("/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  let info = await Listing.findById(id);
  // console.log(info);
  if(!info){
    req.flash("error","Listing doesn't exist!");
    res.redirect("/listings");
  }
  res.render("listings/update.ejs", { info });
}));

//update route
router.put("/:id",validateListing,wrapAsync( async (req, res) => {
  if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing")
  }
  let { id } = req.params;
  let listing = req.body.listing;
  let updateVal = await Listing.findByIdAndUpdate(id, { ...listing });
  req.flash("success", "Listing updated")
  res.redirect("/listings");
}));

//delete route
router.delete("/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let destory = await Listing.findByIdAndDelete(id);
  console.log(destory);
  req.flash("success", "Listing deleted!")

  res.redirect("/listings");
}));

module.exports = router;