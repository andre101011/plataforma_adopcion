const express = require("express");
const router= express.Router();

const pool= require('../database');

router.get('/', async (req,res)=>{

    const {id}=req.params;
    const animales=await pool.query('SELECT * FROM Animal');
    res.render('animals/list',{animales:animales});
})

router.get('/add',(req,res)=>{
    res.render('animals/add');
})

router.post('/add',(req,res)=>{
    res.send('ok');
    
    console.log(req.file)
    

})

router.get('/update:id', async (req,res)=>{
    
    const {id}=req.params;
    const animal=await pool.query('SELECT * FROM Animal WHERE id=?',[id]);
    
    res.render('animals/edit',{animal:animal[0]});
})

router.post('/update:id', async(req,res)=>{
    const {id}=req.params;
    await pool.query('UPDATE FROM Animal WHERE id=?',[id]); 
    
    res.redirect('/animals');
})


module.exports=router;
