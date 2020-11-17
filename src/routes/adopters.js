/**Modulo que maneja todas las operaciones y transacciones relacionadas
 * con los interesados en realizar una adopcion, las vistas controladas por este modulo
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

var req1_add;
var req2_add;


router.get("/", isLoggedIn, async (req, res) => {
    const adopters = await pool.query("SELECT * FROM Adoptante");  
    res.render("adopters/list", { adopters: adopters });
});

router.get("/add", isLoggedIn, async (req, res) => {
    
    res.render("adopters/form_add_1");
});

router.post("/form_part1", isLoggedIn, async (req, res) => {
    
    const {nombre,
        apellido,
        tipo_documento,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        direccion,
        ocupacion,
        correo}=req.body;

    req1_add={
        nombre,
        apellido,
        tipo_documento,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        ocupacion,
        direccion,
        correo,
        referencias:null,
        cuestionario:null,
    };
     
    //console.log(req1_add);
    res.render("adopters/form_add_2");
});


router.post("/form_part2", isLoggedIn, async (req, res) => {
    
    const {nombreApellido,
        parentesco,
        direccion,
        ciudad,
        tel_casa,
        celular,
        nombreApellido1,
        parentesco1,
        direccion1,
        ciudad1,
        tel_casa1,
        celular1}=req.body;

    req2_add={
        nombreApellido,
        parentesco,
        direccion,
        ciudad,
        tel_casa,
        celular,
        nombreApellido1,
        parentesco1,
        direccion1,
        ciudad1,
        tel_casa1,
        celular1
    };
     
    //console.log(req2_add);
    res.render("adopters/form_add_3");
});

router.post("/form_part3", isLoggedIn, async (req, res) => {
    const {
        nombre,
        pregunta1,
        pregunta2,
        q2cuales,
        pregunta3,
        q3cuales,
        pregunta4,
        pregunta5,
        edades,
        pregunta6,
        pregunta7,
        pregunta8,
        pregunta9,
        pregunta10,
        pregunta11,
        pregunta12,
        pregunta13,
        pregunta14,
        pregunta15,
        pregunta16,
        pregunta17,
        pregunta18,
        pregunta19,


    }=req.body;

    var cuestionario={
        nombre,
        pregunta1,
        pregunta2,
        q2cuales,
        pregunta3,
        q3cuales,
        pregunta4,
        pregunta5,
        edades,
        pregunta6,
        pregunta7,
        pregunta8,
        pregunta9,
        pregunta10,
        pregunta11,
        pregunta12,
        pregunta13,
        pregunta14,
        pregunta15,
        pregunta16,
        pregunta17,
        pregunta18,
        pregunta19, 
    }

    for(var i in cuestionario){
        if(cuestionario.hasOwnProperty(i)){
            if(cuestionario[i]==undefined){
                cuestionario[i]=null;
            }

        }
    }

    cuestionario=JSON.stringify(cuestionario);
    req2_add=JSON.stringify(req2_add);

    var adopter=req1_add;
    adopter.referencias=req2_add;
    adopter.cuestionario=cuestionario;
    console.log(adopter);   
    await pool.query("INSERT into Adoptante set ?", [adopter]);
    
    req1_add=null;
    req2_add=null;

    res.redirect("/adopters");
});


router.get("/get_adopter/:id", isLoggedIn, async (req, res) => {

    const {id}=req.params;
    const adopter = await pool.query("SELECT * FROM Adoptante WHERE documento_identidad=?",[id]);
    
    res.render("adopters/adopter",{adopter:adopter[0]});
});

router.post("/update", isLoggedIn, async (req, res) => {

    const {nombre,
        apellido,
        tipo_documento,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        direccion,
        ocupacion,
        correo}=req.body;

    adoptante={
        nombre,
        apellido,
        tipo_documento,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        ocupacion,
        direccion,
        correo
    };
     
    await pool.query(`UPDATE Adoptante SET ? WHERE documento_identidad=${documento_identidad}`,[adoptante]);
    res.redirect('/adopters');
;});

router.get("/delete/:id", isLoggedIn, async (req, res) => {

    const {id}=req.params;
    var adopcion=await pool.query('SELECT * FROM Adopcion WHERE id_adoptante=?',[id]);
    var animal= await pool.query('SELECT * FROM Animal INNER JOIN Adopcion on Animal.id_animal=Adopcion.id_animal WHERE Adopcion.id_adoptante=?',[id]);

    console.log(animal[0]);
    console.log(adopcion[0]);

    if((adopcion[0].estado=="Denegada" || adopcion[0].estado=="En proceso") && animal[0].estado!="Adoptado"){
       await pool.query(`UPDATE Animal SET estado="Sin Adoptar" WHERE id_animal="${adopcion[0].id_animal}"`); 
    }
    await pool.query('DELETE FROM Adoptante WHERE documento_identidad=?',[id]);
    res.redirect("/adopters");
});

module.exports = router;