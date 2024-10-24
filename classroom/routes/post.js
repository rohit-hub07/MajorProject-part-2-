const express = require("express");
const router = express.Router();

//post route

//index- user
router.get("/",(req,res)=>{
  res.send("Index route for post")
})

//show- users
router.get("/:id",(req,res)=>{
  res.send("Show route for post")
})

//post -users
router.post("/:id",(req,res)=>{
  res.send("Post for post")
})

//delete
router.delete("/:id",(req,res)=>{
  res.send("Delete for post")
});

module.exports = router;