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
    var animal=await pool.query('SELECT * FROM Animal WHERE id_animal=?',[id_animal]);
    res.render('adoptions/add', {animal:animal[0]});
})

router.post('/add',isLoggedIn,async (req,res)=>{
   
    const { id_animal,
        fecha_estudio,
        fecha_entrega,
        Empleado_cedula,
        estado,
        observaciones,
        id_adoptante}= req.body;
    var adoptante=await pool.query('SELECT * FROM Animal WHERE id_animal=?',[id_adoptante]);

    if (adoptante!=null){
        const newAdoption={
            id_animal,
            fecha_estudio,
            fecha_entrega,
            Empleado_cedula,
            estado,
            observaciones,
            id_adoptante
        };
    
        
        await pool.query('INSERT into Adopcion set ?',[newAdoption]);
    
        req.flash('success','El nuevo proceso de adopción ha sido creado con exito') ;
    
        res.redirect('/adoptions')
   
    }else{
        req.flash('error','El adoptante no está registrado') ;
        res.redirect(`/adoptions/add/${id_animal}`)
    }

   
})


router.get("/tracing_list", isLoggedIn, async (req, res) => {
    
    const tracings = await pool.query("SELECT * FROM Seguimiento");
  
    res.render("adoptions/tracing_list", { tracings: tracings });
});


router.get("/add_tracing/:id", isLoggedIn, async (req, res) => {
    
    const {id}=req.params
    const adoption = await pool.query("SELECT * FROM Adopcion WHERE id_adopcion=?",[id]);
    res.render("adoptions/add_tracing", {adoption: adoption[0]});
});

router.post("/add_tracing", isLoggedIn, async (req, res) => {
    
    const { id_adopcion,
        id_adoptante,
        id_animal,
        fecha_hora,
        anotaciones,
        }= req.body;

    const newTracing={
        id_adopcion,
        id_adoptante,
        id_animal,
        fecha_hora,
        anotaciones
    };
    
     await pool.query('INSERT into Seguimiento set ?',[newTracing]);
  
    res.redirect("/adoptions/tracing_list");
});

module.exports = router;