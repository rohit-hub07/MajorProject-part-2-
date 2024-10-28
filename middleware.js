const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next)=>{
  // console.log(req.user);
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
}

//to save the url that the user is trying to access to have to have it to the locals because authenticate deletes the session if the user logged in successfully

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req, res, next)=>{
  let { id } = req.params
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`)
  }
  next();
}


// for check the owner of the reviews
module.exports.isReviewAuthor = async(req, res, next)=>{
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}