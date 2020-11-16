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
const helpers=require('../lib/helpers');

/**Método que renderiza la página con los procesos de adopción
 * 
 */
router.get("/", isLoggedIn, async (req, res) => {
    
  
    const adoptions = await pool.query("SELECT * FROM Adopcion");
  
    for(var i in adoptions){
        if(adoptions.hasOwnProperty(i)){
        
           adoptions[i].fecha_estudio=helpers.formatDate(adoptions[i].fecha_estudio);
           adoptions[i].fecha_entrega=helpers.formatDate(adoptions[i].fecha_entrega);
        }
    }

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
    var adoptante=await pool.query('SELECT * FROM Adoptante WHERE documento_identidad=?',[id_adoptante]);

    if (adoptante!=null){
        const newAdoption={
            id_animal,
            id_adoptante,
            fecha_estudio,
            fecha_entrega,
            Empleado_cedula,
            estado,
            observaciones,
            
        };
    
        
        await pool.query('INSERT into Adopcion set ?',[newAdoption]);
    
        req.flash('success','El nuevo proceso de adopción ha sido creado con exito') ;
        
        res.redirect('/adoptions')
   
    }else{
        req.flash('error','El adoptante no está registrado') ;
        res.redirect(`/adoptions/add/${id_animal}`)
    }

   
})


router.get("/tracings/:id", isLoggedIn, async (req, res) => {
    
    const {id}=req.params
    const adoption = await pool.query("SELECT * FROM Adopcion WHERE id_adopcion=?",[id]);
    const tracings = await pool.query("SELECT * FROM Seguimiento WHERE id_adopcion=?",[id]);

    for(var i in tracings){
        if(tracings.hasOwnProperty(i)){
            console.log(tracings[i]);
            tracings[i].fecha_hora=helpers.formatDate(tracings[i].fecha_hora);
            
        }
    }
    res.render("adoptions/tracings", {adoption: adoption[0],tracings:tracings});
});

router.get("/delete_tracing/:id", isLoggedIn, async (req, res) => {
    
    const {id}=req.params;
    var id_tracing=id.split('&')[0];
    var id_adoption=id.split('&')[1];
    await pool.query('DELETE FROM Seguimiento WHERE id_seguimiento=?',[id_tracing]); 
    req.flash('success','El seguimiento fue removido exitosamente') ;
    res.redirect(`/adoptions/tracings/${id_adoption}`);
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
  
    res.redirect(`/adoptions/tracings/${id_adopcion}`);
});

router.get('/detail/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    var adoption=await pool.query('SELECT * FROM Adopcion WHERE id_adopcion=?',[id]);

    var animal=await pool.query('SELECT * FROM Animal WHERE id_animal=?',[adoption[0].id_animal]);

    adoption[0].fecha_estudio=helpers.formatDate(adoption[0].fecha_estudio);
    adoption[0].fecha_entrega=helpers.formatDate(adoption[0].fecha_entrega);
    
    res.render('adoptions/detail', {adoption:adoption[0], animal:animal[0]});
})

module.exports = router;