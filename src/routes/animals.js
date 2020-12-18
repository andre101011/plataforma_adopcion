/**Modulo que maneja todas las operaciones y transacciones relacionadas
 * con los animales de la fundación, las vistas controladas por este modulo
 * se encuentran en la carpeta views/animals
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
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const fs = require("fs-extra");
const helpers = require("../lib/helpers");
var actualAnimals;
var maxNumAnimals=9;

/**Método que renderiza la página con la lista de animales
 *
 */
router.get("/", isLoggedIn, async (req, res) => {
  
  const animals = await pool.query("SELECT * FROM Animal");
  actualAnimals=animals;

  var animalsPags=animalsPart(animals,0,maxNumAnimals);

  res.render("animals/list", { animals: animalsPags ,totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:0});
});


function animalsPart(data,init,end){

  var res=[];

  for (var i=init;i<end && i<data.length;i++){
    res.push(data[i]);
  }
  
  return res;
 

}


/**Método que renderiza la pagina add.hbs
 * que se encuentra en la carpeta views/animals
 *
 */

router.get("/add", isLoggedIn, (req, res) => {
  res.render("animals/add");
});

/**Método que permite agregar un nuevo animal a la base de datos
 * la escritura de los campos se encuentra validada
 *
 *
 */

router.post("/add", isLoggedIn, async (req, res) => {
  var {
    nombre,
    edad,
    sexo,
    caracteristicas,
    especie,
    sitio_rescate,
    fecha_rescate,
    color,
    vacunas,
    esterilizado,
    desparasitado,
    tamanio,
    custodia,
  } = req.body;

  if (esterilizado == null) {
    esterilizado = 0;
  }
  if (desparasitado == null) {
    desparasitado = 0;
  }

  if (fecha_rescate == "") {
    fecha_rescate = null;
  }
  if (sitio_rescate == "") {
    sitio_rescate = null;
  }
  if (caracteristicas == "") {
    caracteristicas = null;
  }

  var ruta_imagen;

  if (req.file == null) {
    ruta_imagen = null;
  } else {
    //ruta_imagen = "uploaded_images/" + req.file.originalname;
    const result=await cloudinary.v2.uploader.upload(req.file.path);
    ruta_imagen=result.secure_url;
    await fs.unlink(req.file.path);
  }

  const newAnimal = {
    especie,
    nombre,
    edad,
    sexo,
    caracteristicas,
    sitio_rescate,
    fecha_rescate,
    color,
    vacunas,
    esterilizado,
    desparasitado,
    tamanio,
    ruta_imagen,
    custodia,
    estado: "Sin Adoptar",
  };

  await pool.query("INSERT into Animal set ?", [newAnimal]);

  req.flash("success", "Registro de animal exitoso");
  res.redirect("/animals");
});

/**Modulo que permite actualizar los datos de los animales
 *
 */
router.get("/update/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const animal = await pool.query("SELECT * FROM Animal WHERE id=?", [id]);

  res.render("animals/edit", { animal: animal[0] });
});

/**Modulo que permite actualizar los datos de los animales
 *
 */
router.post("/update", isLoggedIn, async (req, res) => {
  var {
    id_animal,
    nombre,
    edad,
    sexo,
    caracteristicas,
    especie,
    sitio_rescate,
    fecha_rescate,
    color,
    vacunas,
    esterilizado,
    desparasitado,
    tamanio,
    custodia,
    estado,
    imageName,
  } = req.body;

  if (esterilizado == null) {
    esterilizado = 0;
  }
  if (desparasitado == null) {
    desparasitado = 0;
  }

  if (fecha_rescate == "") {
    fecha_rescate = null;
  }
  if (sitio_rescate == "") {
    sitio_rescate = null;
  }
  if (caracteristicas == "") {
    caracteristicas = null;
  }

  var ruta_imagen = "";

  if (req.file == null) {
    if (imageName == undefined) {
      imageName = null;
    }
    ruta_imagen = imageName;
  } else {
    //si llega aqui actualiza la imagen y luego la elimina de cloudinary
    //ruta_imagen = "uploaded_images/" + req.file.originalname;
    const result=await cloudinary.v2.uploader.upload(req.file.path);
    ruta_imagen=result.secure_url;
    await fs.unlink(req.file.path);
  }

  const newAnimal = {
    especie,
    nombre,
    edad,
    sexo,
    caracteristicas,
    sitio_rescate,
    fecha_rescate,
    color,
    vacunas,
    esterilizado,
    desparasitado,
    tamanio,
    ruta_imagen,
    custodia,
    estado,
  };

  await pool.query(`UPDATE Animal SET ? WHERE id_animal=${id_animal}`, [
    newAnimal,
  ]);
  req.flash("success", "Los datos del animal se han actualizado correctamente");

  res.redirect("/animals");
});

/**Modulo que permite ver en detalle a los animales y sus datos
 *
 */
router.get("/detail/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const animal = await pool.query("SELECT * FROM Animal WHERE id_animal=?", [
    id,
  ]);

  var date = helpers.formatDate(animal[0].fecha_rescate);
  animal[0].fecha_rescate = date;

  res.render("animals/detail", { animal: animal[0] });
});

/**Modulo que permite eliminar un animal
 *
 */
router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM Animal WHERE id_animal=?", [id]);
  req.flash("success", "El animal fue removido exitosamente");

  res.redirect("/animals");
});


router.post("/search", isLoggedIn, async (req, res) => {
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
    sinAdoptar,
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
    e2: sinAdoptar,
    e3: enProceso,
  };
  
  var query_filter="and";
  var query_part1="";
  var query_part2="";
  var query_part3="";
  var query_part4="";
  //filter=JSON.stringify(filter);
  for (var i in filter) {
    if (filter.hasOwnProperty(i)) {
      if (filter[i] != undefined) {
        if((i+"").startsWith("s")){
          query_part1+=" sexo="+ `'${filter[i]}'` ;
          query_part1+=` or `;

        }else if((i+"").startsWith("t")){
          query_part2+=" tamanio="+  `'${filter[i]}'` ;
          query_part2+=` or `;

        }
        else if((i+"").startsWith("p")){

          query_part3+=" especie="+  `'${filter[i]}'` ;
          query_part3+=` or `;

        }else if((i+"").startsWith("e")){
          query_part4+=" estado="+  `'${filter[i]}'`;
          query_part4+=` or `;
        }
        
      }
    }
  }

  if(query_part1.length>0){
    query_filter+="("+query_part1.substring(0,query_part1.length-4)+") and ";
  }
  if(query_part2.length>0){

    query_filter+="("+query_part2.substring(0,query_part2.length-4)+") and ";
  }

  if(query_part3.length>0){
    query_filter+="("+query_part3.substring(0,query_part3.length-4)+") and ";
  }

  if(query_part4.length>0){
    query_filter+="("+query_part4.substring(0,query_part4.length-4)+")";

  }

  //console.log(query_filter);
  var query="SELECT * FROM Animal";
  var empty=true;
  if(search !== ""){
    empty=false;
    query+=` WHERE ( nombre LIKE '%${search}%' or id_animal LIKE '%${search}%' )`;
  }

  if (query_filter.length>3) {
    
    if(empty){
      query_filter= query_filter.substring(3,query_filter.length);
      query+=" WHERE "+query_filter;
    }else{
      query+=" "+query_filter;
    }
  }
  console.log(query);
  
  animals = await pool.query(query);
 
  actualAnimals=animals;


  var animalsPags=animalsPart(actualAnimals,0,maxNumAnimals);
  res.render("animals/list", { animals: animalsPags, filter:filter, totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:0});
});


/**Modulo que permite cambiar de pagina
 *
 */
router.get("/pag/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const animals = await pool.query("SELECT * FROM Animal");
  actualAnimals=animals;
 
  var pag=id;
  var actualPage=parseInt(pag)*maxNumAnimals;
  var animalsPags=animalsPart(actualAnimals,actualPage,actualPage+maxNumAnimals);
  
 
  res.render("animals/list", { animals:animalsPags,totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:id});
});

module.exports = router;
