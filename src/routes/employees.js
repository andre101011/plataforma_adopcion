const express = require("express");
const router= express.Router();

const pool= require('../database');

const helpers=require('../lib/helpers');

const {isLoggedIn}= require('../lib/auth')


router.get('/add',(req,res)=>{

    res.render('employees/add');
    
})

router.post('/add', async (req,res)=>{
   
    const {email, password,passwordConfirm,cedula,nombre}= req.body;

    if(password!==passwordConfirm){
        console.log('las contraseñas son diferentes')
        res.redirect('/employees/add')
    }else{

     const newPerson={
        email,
        password,
        cedula,
        nombre,
        fundacion: 'fundamor'
    };
    newPerson.password= await helpers.encryptPassword(password)

    await pool.query('INSERT into Empleado set ?',[newPerson]);

    req.flash('success','Registro de empleado exitoso') ;

    res.redirect('/employees')
}
   
})

router.get('/', async (req,res)=>{

    const empleados = await pool.query('SELECT * FROM Empleado'); 
    
    res.render('employees/list',{empleados:empleados});

})


router.get('/delete/:id', async (req,res)=>{

    const {id}=req.params;
    pool.query('DELETE FROM Empleado WHERE cedula=?',[id]); 
    req.flash('success','El empleado fue removido exitosamente') ;
    res.redirect('/employees');

})


router.get('/update/:id', async (req,res)=>{

    const {id}=req.params;
    const empleado=await pool.query('SELECT * FROM Empleado WHERE cedula=?',[id]);
    
    console.log(empleado)
    
    res.render('employees/edit',{empleado:empleado[0]});

})

router.post('/update/:id', async (req,res)=>{

    const {id}=req.params;
    await pool.query('UPDATE FROM Empleado WHERE cedula=?',[id]); 
    
    res.redirect('/employees');

})

module.exports=router;