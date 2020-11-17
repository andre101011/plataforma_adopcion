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
    var adoption=await pool.query('SELECT * FROM Adopcion WHERE id_adoptante=?',[id_adoptante]);
    
    if (adoptante[0]!=null && adoption[0]==null){
        const newAdoption={
            id_animal,
            id_adoptante,
            fecha_estudio,
            fecha_entrega,
            Empleado_cedula,
            estado,
            observaciones,
            
        };
        
        var animal_state="";

        if(estado=="Aceptada"){
            animal_state="Adoptado";
        }else if(estado=="Denegada"){
            animal_state="Sin Adoptar";
        }else{
            animal_state="En proceso";
        }
    
        await pool.query(`UPDATE Animal SET estado="${animal_state}" WHERE id_animal=${id_animal}`); 
        await pool.query('INSERT into Adopcion set ?',[newAdoption]);

        req.flash('success','El nuevo proceso de adopción ha sido creado con exito') ;
    
        res.redirect('/adoptions')
   
    }else{
        
        if(adoptante[0]==null){
            req.flash('error','El adoptante no está registrado');
        }else if(adoption[0]!=null){
            req.flash('error',`El adoptante ya esta viculado al adopción "${adoption[0].id_adopcion}"`) ;
        }
        
        res.redirect(`/adoptions/add/${id_animal}`)
    }

   
});


router.post('/update',isLoggedIn,async (req,res)=>{
   
    const { 
        id_adopcion,
        id_animal,
        fecha_estudio,
        fecha_entrega,
        Empleado_cedula,
        estado,
        observaciones,
        id_adoptante}= req.body;

 
    const newAdoption={
            id_animal,
            id_adoptante,
            fecha_estudio,
            fecha_entrega,
            Empleado_cedula,
            estado,
            observaciones,
            
        };
    var animal_state="";
    console.log(estado);
    if(estado=="Aprobada"){
        animal_state="Adoptado";

    }else if(estado=="Denegada"){
        animal_state="Sin Adoptar";
    }else{
        animal_state="En proceso";
    }
  
    await pool.query(`UPDATE Animal SET estado="${animal_state}" WHERE id_animal=${id_animal}`); 
    await pool.query(`UPDATE Adopcion SET ? WHERE id_adopcion=${id_adopcion}`,[newAdoption]);

    req.flash('success','Los datos de la adopción se han actualizado correctamente') ;
    
    res.redirect('/adoptions'); 
   
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
    
    const {id}=req.params;
    var adopcion=await pool.query('SELECT * FROM Adopcion WHERE id_adopcion=?',[id]);
    var animal= await pool.query('SELECT * FROM Animal WHERE id_animal=?',[adopcion[0].id_animal]);

    console.log(animal[0]);

    if((adopcion[0].estado=="Denegada" || adopcion[0].estado=="En proceso") && animal[0].estado!="Adoptado"){
        await pool.query(`UPDATE Animal SET estado="Sin Adoptar" WHERE id_animal="${adopcion[0].id_animal}"`); 
    }
    
    //var animal=await pool.query('SELECT * FROM Animal INNER JOIN Adopcion ON Adopcion.id_animal=Animal.id_animal where Adopcion.id_adopcion=?',[id]);

    //const { especie}=animal[0];
    await pool.query('DELETE FROM Adopcion WHERE id_adopcion=?',[id]); 
    req.flash('success','El proceso de adopcion fue removido exitosamente');
    
    res.redirect(`/adoptions`);
});


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
    req.flash('success','Se ha agregado un nuevo segumiento') ;
    await pool.query('INSERT into Seguimiento set ?',[newTracing]);
  
    res.redirect(`/adoptions/tracings/${id_adopcion}`);
});

router.get('/detail/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    var adoption=await pool.query('SELECT * FROM Adopcion WHERE id_adopcion=?',[id]);

    var animal=await pool.query('SELECT * FROM Animal WHERE id_animal=?',[adoption[0].id_animal]);

    adoption[0].fecha_estudio=helpers.formatDate(adoption[0].fecha_estudio);
    adoption[0].fecha_entrega=helpers.formatDate(adoption[0].fecha_entrega);
    if(adoption[0].Empleado_cedula==null){
        adoption.Empleado_cedula="NO EXISTE";
    }
    
    res.render('adoptions/detail', {adoption:adoption[0], animal:animal[0]});
});

router.get('/detail_adoption/:id', isLoggedIn, async (req,res)=>{
    
    const { id } = req.params;
    var id_animal=id.split('&')[0];
    var state=id.split('&')[1];
    if(state=="Adoptado"){
        state="Aprobada";
    }
   
    var adoption=await pool.query(`SELECT * FROM Adopcion WHERE id_animal="${id_animal}" and estado="${state}"`);

    if(adoption[0]!=null){
        var animal=await pool.query('SELECT * FROM Animal WHERE id_animal=?',[id_animal]);
        adoption[0].fecha_estudio=helpers.formatDate(adoption[0].fecha_estudio);
        adoption[0].fecha_entrega=helpers.formatDate(adoption[0].fecha_entrega);
        if(adoption[0].Empleado_cedula==null){
            adoption.Empleado_cedula="NO EXISTE";
        }
    
        res.render('adoptions/detail', {adoption:adoption[0], animal:animal[0]});
    }else{
        req.flash('error','El proceso de adopción vinculado con este animal no existe') ;
        res.redirect("/animals")
    }
})

module.exports = router;