/**Modulo que genera las estadisticas sobre
 * los procesos de adopcion de la fundación, las vistas controladas por este modulo
 * se encuentran en la carpeta views/adoptions
 *
 * @todo organizar la vista, envolver las graficas en tarjetas
 *
 * @author Neyder Figueroa
 * @author Andrés Llinás
 * @since 2020 Universidad del Quindío
 * @copyright Todos los derechos reservados
 *
 */

const express = require("express");
const router = express.Router();
const pool = require("../database");


router.get('/',(req,res)=>{
  res.render('index');
})

router.get("/stat1", async (req, res) => {
 
  
  await pool.query(
    "SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
  );
  const result = await pool.query(
    "select date_format(fecha_entrega,'%Y-%b') as fecha, count(id_animal) as entregados from Adopcion where year(fecha_entrega)=2020 group by year(fecha_entrega),month(fecha_entrega)  order by year(fecha_entrega),month(fecha_entrega);"
  );
  if(result[0]!=null){
    console.log('llega');
    labels = extractAttributeValuesFromJsonArray(result, "fecha");
    values = extractAttributeValuesFromJsonArray(result, "entregados");
    res.render("statistics/stat1", { labels: labels, values: values });
  }else{
    req.flash("error", "No hay suficientes datos para generar la grafica");
    res.redirect("/animals");
  }

  
});

router.post("/stat1", async (req, res) => {
  
  await pool.query(
    "SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
  );
  const result = await pool.query(
    "select date_format(fecha_entrega,'%Y-%b') as fecha, count(id_animal) as entregados from Adopcion where year(fecha_entrega)=2020 group by year(fecha_entrega),month(fecha_entrega)  order by year(fecha_entrega),month(fecha_entrega);"
  );

  labels = extractAttributeValuesFromJsonArray(result, "fecha");
  values = extractAttributeValuesFromJsonArray(result, "entregados");

  res.render("statistics/stat1", { labels: labels, values: values });
});
router.get("/stat2", async (req, res) => {
 
  await pool.query(
    "SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
  );
  var result = await pool.query(
    "SELECT  date_format(fecha_entrega,'%Y-%b') as mes  , SUM(CASE WHEN sexo = 'macho' THEN 1 ELSE 0 END) AS machos  , SUM(CASE WHEN sexo = 'hembra' THEN 1 ELSE 0 END) AS hembras FROM  Animal INNER JOIN Adopcion ON Animal.id_animal = Adopcion.id_animal group by year(fecha_entrega),month(fecha_entrega)  order by year(fecha_entrega),month(fecha_entrega);"
  );
  
  labels = extractAttributeValuesFromJsonArray(result, "mes");
  valuesH = extractAttributeValuesFromJsonArray(result, "hembras");
  valuesM = extractAttributeValuesFromJsonArray(result, "machos");

  var currentTime = new Date();
  var year = currentTime.getFullYear();

  res.render("statistics/stat2", {
    labels: labels,
    valuesH: valuesH,
    valuesM: valuesM,
    stat: "stat2",
    year: year,
  });
});

router.post("/stat2", async (req, res) => {
  var { barraano } = req.body;
  var barraano = barraano;

  
  await pool.query(
    "SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
  );
  var result = await pool.query(
    `SELECT  date_format(fecha_entrega,'%Y-%b') as mes ,
    SUM(CASE WHEN sexo = 'macho' THEN 1 ELSE 0 END) AS machos  ,
    SUM(CASE WHEN sexo = 'hembra' THEN 1 ELSE 0 END) AS hembras
    FROM Animal INNER JOIN Adopcion 
    ON Animal.id_animal = Adopcion.id_animal
    where year(fecha_entrega)="${barraano}"
    group by year(fecha_entrega),month(fecha_entrega)
    order by year(fecha_entrega),month(fecha_entrega);`
  );

  console.log(result);
  labels = extractAttributeValuesFromJsonArray(result, "mes");
  valuesH = extractAttributeValuesFromJsonArray(result, "hembras");
  valuesM = extractAttributeValuesFromJsonArray(result, "machos");

  res.render("statistics/stat2", {
    labels: labels,
    valuesH: valuesH,
    valuesM: valuesM,
    stat: "stat2",
    year: barraano,
  });
});

router.get("/stat3", async (req, res) => {
  var { barraano } = req.body;
  var barraano = barraano;
 

  var result = await pool.query(
    'SELECT COUNT(CASE WHEN sexo ="macho" THEN id_animal END) AS machos, COUNT(CASE WHEN sexo ="hembra" THEN id_animal END) AS hembras, COUNT(*) AS Total FROM Animal WHERE estado<>"adoptado";'
  );

 
  valuesH = extractAttributeValuesFromJsonArray(result, "hembras");
  valuesM = extractAttributeValuesFromJsonArray(result, "machos");

  res.render("statistics/stat3", {
    valuesH: valuesH[0],
    valuesM: valuesM[0],
    stat: "stat3",
  });
});

module.exports = router;

function extractAttributeValuesFromJsonArray(jsonArray, attribute) {
  var array = [];
  for (var i = 0; i < jsonArray.length; i++) {
    var obj = jsonArray[i];
    var value = obj[attribute];
    array.push(value);
  }
  return array;
}

function totalEntregadosPorMes(jsonArray, attribute) {}
