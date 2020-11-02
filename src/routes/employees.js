const express = require("express");
const router= express.Router();

const pool= require('../database');

const helpers=require('../lib/helpers');

const {isLoggedIn,isAdmin}= require('../lib/auth')


router.get('/', isLoggedIn, isAdmin, async (req,res)=>{

    const empleados = await pool.query('SELECT * FROM Empleado'); 
    
    res.render('employees/list',{empleados:empleados});

})


router.get('/add', isLoggedIn,isAdmin,(req,res)=>{

    res.render('employees/add');
    
})

router.post('/add',isLoggedIn, isAdmin,async (req,res)=>{
   
    const {email, password,cedula,nombre}= req.body;

    const newPerson={
        email,
        password,
        cedula,
        nombre,
        fundacion: 'fundamor'
    };

    newPerson.password= await helpers.encryptPassword(password)

    await pool.query('INSERT into Empleado set ?',[newPerson]);

    req.flash('success','Registro de colaborador exitoso') ;

    res.redirect('/employees')

   
})


router.get('/update/:id', isLoggedIn,async (req,res)=>{

    const {id}=req.params;
    const empleado=await pool.query('SELECT * FROM Empleado WHERE cedula=?',[id]);
    

    
    res.render('employees/edit',{empleado:empleado[0]});

})

router.post('/update', isLoggedIn , async (req,res)=>{
console.log('##')
    const {cedula,email,password,nombre,fundacion,rol}=req.body
   
    const employee={
        cedula,
        email,
        password:await helpers.encryptPassword(password),
        nombre,
        fundacion,
        

    }

  
    
    console.log(employee)
    await pool.query(`UPDATE Empleado SET ? WHERE cedula=${cedula}`,[employee]); 
    
    res.redirect('/employees');

})


router.get('/delete/:id', isLoggedIn,async (req,res)=>{

    const {id}=req.params;
    pool.query('DELETE FROM Empleado WHERE cedula=?',[id]); 
    req.flash('success','El colaborador fue removido exitosamente') ;
    res.redirect('/employees');

})

module.exports=router;