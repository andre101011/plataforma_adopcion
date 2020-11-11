/**Modulo que maneja todas las operaciones y transacciones relacionadas
 * con los colaboradores de la fundacion de la fundación, las vistas controladas por este modulo
 * se encuentran en la carpeta views/employees
 *
 *
 * @todo 
 *
 *
 * @author Neyder Figueroa
 * @author Andrés Llinás
 * @since 2020 Universidad del Quindío
 * @copyright Todos los derechos reservados
 *
 */



const express = require("express");
const router= express.Router();

const pool= require('../database');

const helpers=require('../lib/helpers');

const {isLoggedIn,isAdmin}= require('../lib/auth')

/**Metodo encargado de renderizar la pagina con
 * la lista de colaboradores que tienen acceso a
 * la plataforma
 * solo puede ser accedida por un administrador
 */
router.get('/', isLoggedIn, isAdmin, async (req,res)=>{

    const employees = await pool.query('SELECT * FROM Empleado'); 
    
    res.render('employees/list',{employees:employees});

})

/**Metodo get que renderiza la página
 * para registrar un nuevo colaborador
 * solo puede ser accedida por un administrador
 * 
 */
router.get('/add', isLoggedIn,isAdmin,(req,res)=>{

    res.render('employees/add');
    
})

/**Método que permite agregar un colaborador a la bd
 * 
 */
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

/**Método get que permite renderizar una pagina con los
 * datos de determinado empleado
 * 
 */
router.get('/update/:id', isLoggedIn,async (req,res)=>{

    const {id}=req.params;
    const employee=await pool.query('SELECT * FROM Empleado WHERE cedula=?',[id]);
    

    
    res.render('employees/edit',{employee:employee[0]});

})
/**Método que permite actualizar los datos de un colaborador a la bd
 * 
 */
router.post('/update', isLoggedIn , async (req,res)=>{

    const {cedula,email,password,nombre,fundacion,rol}=req.body
   
    const employee={
        cedula,
        email,
        password:await helpers.encryptPassword(password),
        nombre,
        fundacion,
        

    }  
    
    await pool.query(`UPDATE Empleado SET ? WHERE cedula=${cedula}`,[employee]); 
    
    res.redirect('/employees');

})


router.get('/delete/:id', isLoggedIn,async (req,res)=>{

    const {id}=req.params;
    await pool.query('DELETE FROM Empleado WHERE cedula=?',[id]); 
    req.flash('success','El colaborador fue removido exitosamente') ;
    res.redirect('/employees');

})

module.exports=router;