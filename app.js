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
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//flash- use to display certain message and this message is stroed in temporary memory

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


//session- used to save user credentials in the webssite
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 + 60 * 60 * 1000,
    httpOnly: true,
  },
};

// main route
app.get("/", (req, res) => {
  res.send("App is in the main route");
});

//middle to to define sessions
app.use(session(sessionOptions));
//middleware for flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//accessing the message that I have defined in the listing.js
//Defining middleware to use the flash
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get("/demouser", async(req,res) =>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "rohit",
//   });
  
//   let registered = await User.register(fakeUser, "helloworld");
//   res.send(registered);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
