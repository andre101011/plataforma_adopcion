const passport = require('passport');
const LocalStrategy =require('passport-local').Strategy;
const helpers=require('../lib/helpers');
const pool= require('../database');


passport.use('local.login', new LocalStrategy({
    
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true

}, async (req,email,password,done)=>{
   

    const employees=await pool.query('SELECT * FROM Empleado WHERE email=?',[email]);
    if(employees.length > 0){

        const employee=employees[0];

        const validPassword = await helpers.comparePassword(password,employee.password);
       
        if(validPassword){

            done(null,employee,req.flash('success','Bienvenido '+ employee.nombre));
        }else{
            done(null,false,req.flash('error','La contraseña no coincide con el email'))
        }

    }else{
       return done(null,false,req.flash('error','Este email no esta registrado en la plataforma'))
    }

    
}));


passport.serializeUser((empleado,done)=>{

    done(null,empleado.cedula);

});

passport.deserializeUser(async (cedula,done)=>{

   
    const employees = await pool.query('SELECT * FROM Empleado WHERE cedula=?',[cedula]); 

    done(null,employees[0]);

});