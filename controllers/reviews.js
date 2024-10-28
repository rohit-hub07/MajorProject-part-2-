const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res)=>{
  let { id } = req.params;
  //finding the listing by the id
  let listing = await Listing.findById(id);
  // if(!listing.owner.equals(res.locals.currUser)){
  //   req.flash("error","You are not the owner of this listing");
  //   return res.redirect(`/listings/${id}`)
  // }

  //extracting the values of the reviews from the form
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  // console.log(req.user._id);
  // console.log(newReview)

  //pushing the review in the listings
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`)
}


module.exports.destroyReview = async(req,res)=>{
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
  
}