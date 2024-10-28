const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const { isLoggedIn } = require("../middleware.js");
const { isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

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
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;