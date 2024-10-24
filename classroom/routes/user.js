const express = require("express");
const router = express.Router();

//index- user
router.get("/",(req,res)=>{
  res.send("Index route for user")
})

//show- users
router.get("/:id",(req,res)=>{
  res.send("Show route for user")
})

//post -users
router.post("/:id",(req,res)=>{
  res.send("Post for user")
})

//delete
router.delete("/:id",(req,res)=>{
  res.send("Delete for user")
});

module.exports = router;