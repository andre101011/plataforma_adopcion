const express = require("express");
const router= express.Router();

const pool= require('../database');

router.get('/add',(req,res)=>{
    res.render('employees/add');
})

router.post('/add', async (req,res)=>{
   
    const {email, password}= req.body;

    const newPerson={
        email,
        password
    };

    console.log(nuevaPersona);
    await pool.query('INSERT into persona set ?',[newPerson]); 
    res.redirect('/employees')
})

router.get('/', async (req,res)=>{

   
    const persons= await pool.query('SELECT * FROM persona'); 
    console.log(persons)
    res.send('list');

})
module.exports=router;