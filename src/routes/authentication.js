const express = require("express");
const { Store } = require("express-session");
const router= express.Router();
const pool= require('../database');
const passport=require('passport')
const {isNotLoggedIn}= require('../lib/auth')

router.get('/employees/login',isNotLoggedIn, (req,res)=>{

    res.render('employees/login');
    
}); 

router.post('/employees/login', isNotLoggedIn,(req,res,next)=>{

    passport.authenticate('local.login',{
        successRedirect:'/animals',
        failureRedirect: '/employees/login',
        failureFlash: true

    })(req,res,next);
    
});



router.get('/employees/logout', async (req,res)=>{

    req.logOut();
   
   // res.header('Cache-Control','no-cache,private,no-store','must-revalidate ,max-stale=0, post-check=0,pre-check=0'); 

   // res.setHeader('cache-control', 'no-cache', 'no-store', 'must-revalidate');
   await pool.query('DELETE FROM sessions');
    res.redirect('/')
   
   
    
});

module.exports=router;