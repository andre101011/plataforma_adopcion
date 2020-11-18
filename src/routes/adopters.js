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
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth"); //validación de acceso

var req1_add;
var req2_add;
var actualAnimals;
var maxNumAnimals=3;
var intersadoEn=-1;
var animalToAdopt;

router.get("/", isLoggedIn, async (req, res) => {
    const adopters = await pool.query("SELECT * FROM Adoptante");  
    res.render("adopters/list", { adopters: adopters });
});

/**Método que renderiza la página con la lista de animales
 *
 */
router.get("/animals", isNotLoggedIn,async (req, res) => {
  
    const animals = await pool.query("SELECT * FROM Animal where estado='Sin Adoptar'");
    actualAnimals=animals;
  
    var animalsPags=animalsPart(actualAnimals,0,maxNumAnimals);
  
    res.render("adopters/view", { animals: animalsPags ,totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:0});
  });

router.get("/add/:id", async (req, res) => {
    
    const {id}=req.params
    intersadoEn=parseInt(id);
    res.render("adopters/form_add_1");
});

router.post("/form_part1", async (req, res) => {
    
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


router.post("/form_part2", async (req, res) => {
    
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

router.post("/form_part3", async (req, res) => {
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
    
    await pool.query("INSERT into Adoptante set ?", [adopter]);
    
    req1_add=null;
    req2_add=null;

    if(intersadoEn!=-1){
        animalToAdopt=await pool.query("SELECT * FROM Animal WHERE id_animal=?",[intersadoEn]);
        enviarNotificacion();
    }
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


    if((adopcion[0].estado=="Denegada" || adopcion[0].estado=="En proceso") && animal[0].estado!="Adoptado"){
       await pool.query(`UPDATE Animal SET estado="Sin Adoptar" WHERE id_animal="${adopcion[0].id_animal}"`); 
    }
    await pool.query('DELETE FROM Adoptante WHERE documento_identidad=?',[id]);
    res.redirect("/adopters");
});



function animalsPart(data,init,end){

    var res=[];
  
    for (var i=init;i<end && i<data.length;i++){
      res.push(data[i]);
    }
    console.log(res);
    return res;
   
  
  }

  router.post("/animals/search", isNotLoggedIn, async (req, res) => {
    const {
      search,
      macho,
      hembra,
      Grande,
      Mediano,
      Pequenio,
      gato,
      perro,
      adoptado,
      enProceso,
    } = req.body;
  
    var animals;
  
    var filter = {
      s1: macho,
      s2: hembra,
      t1: Grande,
      t2: Mediano,
      t3: Pequenio,
      p1: gato,
      p2: perro,
      e1: adoptado,
      e2: "sin Adoptar",
      e3: enProceso,
    };
    
    var query_filter="and";
    //filter=JSON.stringify(filter);
    for (var i in filter) {
      if (filter.hasOwnProperty(i)) {
        if (filter[i] != undefined) {
          if((i+"").startsWith("s")){
            query_filter+=" sexo="+ `'${filter[i]}'` ;
  
          }else if((i+"").startsWith("t")){
            query_filter+=" tamanio="+  `'${filter[i]}'` ;
  
          }
          else if((i+"").startsWith("p")){
  
            query_filter+=" especie="+  `'${filter[i]}'` ;
  
          }else if((i+"").startsWith("e")){
            query_filter+=" estado="+  `'${filter[i]}'`;
          }
          query_filter+=` and `;
        }
        
        
      }
    }
    query_filter=query_filter.substring(0,query_filter.length-5);
    console.log(query_filter);
    var query="SELECT * FROM Animal";
    var empty=true;
    if(search !== ""){
      empty=false;
      query+=` WHERE ( nombre LIKE '%${search}%' or id_animal LIKE '%${search}%' )`;
    }
  
    if (query_filter.length>3) {
      console.log("entra" + query_filter)
  
      if(empty){
        query_filter= query_filter.substring(3,query_filter.length);
        query+=" WHERE "+query_filter;
      }else{
        query+=" "+query_filter;
      }
    }
    console.log(query);
    
    animals = await pool.query(query);
    //console.log(filter)
  
    actualAnimals=animals;
  
  
    var animalsPags=animalsPart(actualAnimals,0,maxNumAnimals);
    res.render("adopters/view", { animals: animalsPags, filter:filter, totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:0});
  });
  

  router.get("/animals/pag/:id", isNotLoggedIn,async (req, res) => {
    const { id } = req.params;
    const animals = await pool.query("SELECT * FROM Animal WHERE estado='Sin Adoptar'");
    actualAnimals=animals;
   
    var pag=id;
    var actualPage=parseInt(pag)*maxNumAnimals;
    var animalsPags=animalsPart(actualAnimals,actualPage,actualPage+maxNumAnimals);
    
   
    res.render("adopters/view", { animals:animalsPags,totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:id});
  });

function enviarNotificacion (){
    


}
  
module.exports = router;