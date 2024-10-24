const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://th.bing.com/th/id/OIP.mURrmR_uNDX74zSE3_tbwAHaFj?w=229&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  },
  price: Number,
  location: String,
  country:String,
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
  }
]
})

//middle to delete reviews with listings
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;