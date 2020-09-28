const express = require("express");
const router= express.Router();

const pool= require('../database');

router.get('/add',(req,res)=>{
    res.render('empleados/add');
})

router.post('/add', async (req,res)=>{
   
    const {email, password}= req.body;

    const nuevaPersona={
        email,
        password
    };

    console.log(nuevaPersona);
    await pool.query('INSERT into persona set ?',[nuevaPersona]); 
    res.redirect('/empleados')
})

router.get('/', async (req,res)=>{

   
    const personas= await pool.query('SELECT * FROM persona'); 
    console.log(personas)
    res.send('listas');

})
module.exports=router;