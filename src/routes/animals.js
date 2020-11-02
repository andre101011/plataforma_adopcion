/**Modulo que maneja todas las operaciones y transacciones relacionadas
 * con los animales de la fundación, las vistas controladas por este modulo
 * se encuentran en la carpeta views/animals
 *
 *
 * @todo Imagen especial para cuando no hay imagen, previsualización de imagen upload
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


/**Método que renderiza la página con la lista de animales
 * 
 */
router.get("/", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const animals = await pool.query("SELECT * FROM Animal");

  res.render("animals/list", { animals: animals });
});

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

  var ruta_imagen = "";

  if (req.file == null) {
    ruta_imagen = null;
  } else {
    ruta_imagen = "uploaded_images/" + req.file.originalname;
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
    estado: "sin adoptar",
  };

  console.log(newAnimal);
  await pool.query("INSERT into Animal set ?", [newAnimal]);

  req.flash("success", "Registro de animal exitoso");

  res.redirect("/animals");
});



/**Modulo que permite actualizar los datos de los animales
 * 
 */
router.get("/update:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const animal = await pool.query("SELECT * FROM Animal WHERE id=?", [id]);

  res.render("animals/edit", { animal: animal[0] });
});

/**Modulo que permite actualizar los datos de los animales
 * 
 */
router.post("/update:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE FROM Animal WHERE id=?", [id]);

  res.redirect("/animals");
});

module.exports = router;
