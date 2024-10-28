const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const reviewSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,    ref: "User",
  },
})
const Review = mongoose.model("Review", reviewSchema);

// const delMany = async()=>{
//   await Review.deleteMany({});
//   console.log("Deleted")
// }

// delMany();
module.exports = Review;