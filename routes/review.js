const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next)=>{
  let { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
      let errMsg = error.details.map((er) => er.message).join(",");
      throw new ExpressError(400,errMsg)
      
    }else{
      next();
    }
}

//reviews route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  let { id } = req.params;
  //finding the listing by the id
  let listing = await Listing.findById(id);
  //extracting the values of the reviews from the form
  let newReview = new Review(req.body.review);
  //pushing the review in the listings
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`)
}));

//delete reviews
router.delete("/:reviewId",async(req,res)=>{
  let { id, reviewId } = req.params;
  //to delete the reviews from the listing we have to use $pull 
  await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!")
  res.redirect(`/listings/${id}`);

  // let { id } = req.params;
  // let listing = req.params.id;
  // console.log(listing);
  // await Review.findById(req.params.id);
  // res.redirect("/listings/<%listing._id%>");
  
});

module.exports = router;