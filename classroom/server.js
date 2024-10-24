const express = require("express");
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("views","ejs");
app.set("views",path.join(__dirname,"views"));


//session is to stroed cookies so that when you go to other web page then you don't loose the information that is already saved in the website
const sessionoptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};


app.use(session(sessionoptions));

//flas is used to display a message for some tasks and it is stored temporarily in the storage
app.use(flash());

app.use((req,res,next)=>{
  res.locals.messages = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/register",(req,res)=>{
  let { name="mysterio" } = req.query;
  //adding a new field name in the session object
  req.session.name = name;
  // console.log(req.session.name);
  // console.log(req.session);

  //flash takes two parameters one is the key and other one is the message that you want to display
  
  if(name === "mysterio"){
    req.flash("error","User not registered");
  }else{
    req.flash("success","User registered successfully");
  }

  res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
  // let user = req.session.name;
  // console.log(req.flash());
  // let msg = req.flash();
  // console.log(user)
  // res.send(`Hello ${user}`);
  
  // res.locals.messages = req.flash("success");
  // res.locals.error = req.flash("error");
  res.render("page.ejs",{ user: req.session.name });
})

// app.get("/reqCount", (req, res) => {
//   if (req.session.count){
//     req.session.count++;
//   }else{
//     req.session.count = 1;
//   }
//   res.send(`You send a request ${req.session.count} times`);
// });

// app.get("/test",(req,res)=>{
//   res.send("test is successful");
// })

app.listen(3000, () => {
  console.log("App is listening to port: 3000");
});
