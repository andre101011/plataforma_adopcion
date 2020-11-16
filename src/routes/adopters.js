const { json } = require("express");
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
    
    res.redirect("/adopters");
});

module.exports = router;