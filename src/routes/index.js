const express = require("express");
const router= express.Router();

router.get('/',(req,res)=>{
    res.send('hello world5555');
})


module.exports=router;