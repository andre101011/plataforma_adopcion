const express = require("express");
const router= express.Router();

const pool= require('../database');

router.get('/',(req,res)=>{
    res.render('animals/list');
})

router.post('/',(req,res)=>{
    res.render('animals/list');
})

router.get('/add',(req,res)=>{
    res.render('animals/add');
})

router.post('/add',(req,res)=>{
    res.send('ok');
    console.log(req.file)
})

module.exports=router;
