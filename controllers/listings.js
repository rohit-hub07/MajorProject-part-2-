const Listing = require("../models/listing.js");
const mbxGEocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGEocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let details = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!details) {
    req.flash("error", "Listing doesn't exist");
    return res.redirect("/listings");
  }
  // console.log(details);
  res.render("listings/show.ejs", { details });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();


  let url = req.file.path;
  let filename = req.file.filename;
  // let listing = req.body.listing;
  // console.log(listing);
  let newListing = new Listing(req.body.listing);
  //to store the information of the new user
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  // console.log(url);
  // console.log(filename);
  let savedListing = await newListing.save();
  // console.log(savedListing);
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let info = await Listing.findById(id);
  // console.log(info);
  if (!info) {
    req.flash("error", "Listing doesn't exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = info.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/update.ejs", { info, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  // let listing = await Listing.findById(id);
  // if(!listing.owner.equals(res.locals.currUser._id)){
  //   req.flash("error","You don't have persmission to edit!");
  //   return res.redirect(`/listings/${id}`)
  // }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // console.log(req.file);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let destory = await Listing.findByIdAndDelete(id);
  console.log(destory);
  req.flash("success", "Listing deleted!");

  res.redirect("/listings");
};
