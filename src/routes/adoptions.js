/**Modulo que maneja todas las operaciones y transacciones relacionadas
 * con los procesos de adopcion de la fundación, las vistas controladas por este modulo
 * se encuentran en la carpeta views/adoptions
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
const router = express.Router(); 
const pool = require("../database"); //conexión con la bd
const { isLoggedIn } = require("../lib/auth"); //validación de acceso


/**Método que renderiza la página con los procesos de adopción
 * 
 */
router.get("/", isLoggedIn, async (req, res) => {
    
  
    const adoptions = await pool.query("SELECT * FROM Adopcion");
  
    res.render("adoptions/list", { adoptions: adoptions });
});

/**Método que renderiza la página para crear un nuevo proceso
 * 
 */

router.get('/add/:id_animal', isLoggedIn, async (req,res)=>{
    const { id_animal } = req.params;
    var persons=await pool.query('SELECT * FROM Adoptante');
    var animal=await pool.query('SELECT * FROM Animal WHERE id_animal=?',[id_animal]);
    res.render('adoptions/add', { persons: persons, animal:animal[0]});
})

router.post('/add',isLoggedIn,async (req,res)=>{
   
    const {email, password,passwordConfirm,cedula,nombre}= req.body;

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

    res.redirect('/adoptions')

   
})





module.exports = router;