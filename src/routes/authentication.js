/**Módulo encargado de manejar el proceso de autenticación de usarios 
 *y recuperación de contraseñas para la plataforma
 *la vistas controladas por este modulo se encuentran en la carptea views/employees
 *
 * @todo falta generar la contraseña aleatoriamente y probar todo el metodo
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
const passport=require('passport');
const nodemailer=require('nodemailer')
const {isNotLoggedIn}= require('../lib/auth')


/**Metodo encargado de renderizar la pagina de login
 * 
 */
router.get('/employees/login',isNotLoggedIn, (req,res)=>{
    
    res.render('employees/login');
    
}); 

/**Metodo encargado de validar la autenticacíon
 * en caso de que sea exitosa enruta hacia la pagina de animales
 * en caso contrario redirige hacia el login
 * 
 */
router.post('/employees/login', isNotLoggedIn,(req,res,next)=>{

    passport.authenticate('local.login',{
        successRedirect:'/animals',
        failureRedirect: '/employees/login',
        failureFlash: true

    })(req,res,next);
    
});

/**Método que cierra la sesion del usuario
 * y lo redirige a una pagina intermedia 
 * desde la cual la cual no se puede volver hacia atras
 * 
 */
router.get('/employees/logout', async (req,res)=>{

    req.logOut();

    await pool.query('DELETE FROM sessions');
    res.redirect('/employees/logout_page');    
});

/**Método que renderiza la página de confirmación de cierre de sesion
 * desde esta pagina no se puede volver hacia atras 
 */
router.get('/employees/logout_page', async (req,res)=>{

    res.render('employees/logout');    
});


/**Metodo que sirve para reestablecer la contraseña 
 * de acceso a la plataforma y posteriormente
 * enviarla al correo del colaborador
 */
router.post('/employees/restore_password', async (req,res)=>{

    const {email}=req.body;

    const employees=await pool.query('SELECT * FROM Empleado WHERE email=?',[email]);
    
    if(employees[0]!=null){
        const transporter=nodemailer.createTransport({
            host: "server.hostingbricks.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL, 
              pass: process.env.EMAIL_PASSWORD, 
            },
          });
    
        const info = await transporter.sendMail({
            from: `"Plataforma Adopcion" ${process.env.EMAIL}`, // sender address
            to: `${email}`, // list of receivers
            subject: "Recuperacion de contraseña", // Subject line
            text: ("Hola ?",employees[0].nombre), // plain text body
            html: `<b> Hola ${employees[0].nombre} su contraseña es: ...</b>`, // html body
        });
    
        console.log("Message sent: %s", info.messageId);
        req.flash('success','Se ha enviado la contraseña a su correo electronico') ;
        
    }else{
        req.flash('error','El correo ingresado no se encuentra registrado') ;
    }
    res.redirect('/employees/login')

});

module.exports=router;