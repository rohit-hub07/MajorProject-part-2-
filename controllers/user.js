const User = require("../models/user.js");

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);

    //to login the the user authomatically after sign up
    req.login(registeredUser,  (err)=>{
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (er) {
    req.flash("error", er.message);
    res.redirect("/signup");
    // console.log(er);
  }
}

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.RenderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to WanderLust: You are logged in!");
  //if the redirect url is empty then show listings route
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  })
}