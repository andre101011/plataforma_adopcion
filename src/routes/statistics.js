const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get('/', async (req,res)=>{

    //const empleados = await pool.query('SELECT * FROM Empleado'); 
    const data=[15,10,30]

    
    
    res.render('statistics/test',{data:data});

})


module.exports = router;