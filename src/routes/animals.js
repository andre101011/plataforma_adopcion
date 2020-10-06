const express = require("express");
const router = express.Router();

const pool = require("../database");


router.get("/", async (req, res) => {
  const { id } = req.params;
  const animales = await pool.query("SELECT * FROM Animal");
  res.render("animals/list", { animales: animales});
});

router.get("/add", (req, res) => {
  res.render("animals/add");
});

router.post("/add", async (req, res) => {
 
  const {
    nombre,
    edad,
    sexo,
    caracteristicas,
    especie,
    sitio_rescate,
    fecha_rescate,
    raza,
    color,
    vacunas,
    esterilizado,
    desparasitado,
    tamanio,
    custodia,
  } = req.body;

  console.log(req.file.originalname);
  
  const ruta_imagen="uploaded_images/"+req.file.originalname;

  const newAnimal = {
    especie,
    nombre,
    edad,
    sexo,
    caracteristicas,
    sitio_rescate,
    fecha_rescate,
    raza,
    color,
    vacunas,
    esterilizado,
    desparasitado,
    tamanio,
    ruta_imagen,
    custodia,
    estado:'sin adoptar'
  };

  await pool.query("INSERT into Animal set ?", [newAnimal]);

  req.flash("success", "Registro de animal exitoso");

  res.redirect("/animals");
});

router.get("/update:id", async (req, res) => {
  const { id } = req.params;
  const animal = await pool.query("SELECT * FROM Animal WHERE id=?", [id]);

  res.render("animals/edit", { animal: animal[0] });
});

router.post("/update:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE FROM Animal WHERE id=?", [id]);

  res.redirect("/animals");
});

module.exports = router;