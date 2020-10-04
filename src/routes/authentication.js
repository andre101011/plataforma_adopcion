const express = require("express");
const { Store } = require("express-session");
const router= express.Router();
const pool= require('../database');
const passport=require('passport')

router.get('/employees/login',(req,res)=>{

    res.render('employees/login');
    
}); 

router.post('/employees/login',(req,res,next)=>{

    passport.authenticate('local.login',{
        successRedirect:'/platform',
        failureRedirect: '/employees/login',
        failureFlash: true

    })(req,res,next);
    
});

router.get('/platform',(req,res)=>{

    res.render('platform');
    
});

router.get('/employees/logout', async (req,res)=>{

    req.logOut();
    await pool.query('DELETE FROM sessions'); 
    res.redirect('/')
    
});

module.exports=router;