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

router.post("/stat1", async (req, res) => {
  var { barraano } = req.body;
  console.log(barraano);

  const result = await pool.query(
    "select date_format(fecha_entrega,'%Y-%b') as fecha, count(id_animal) as entregados from adopcion where year(fecha_entrega)=2020 group by year(fecha_entrega),month(fecha_entrega)  order by year(fecha_entrega),month(fecha_entrega);"
  );

  labels = extractAttributeValuesFromJsonArray(result, "fecha");
  values = extractAttributeValuesFromJsonArray(result, "entregados");

  res.render("statistics/statistics", { labels: labels, values: values });
});

router.get("/stat1", async (req, res) => {
  var { barraano } = req.body;
  console.log(barraano);

  const result = await pool.query(
    "select date_format(fecha_entrega,'%Y-%b') as fecha, count(id_animal) as entregados from adopcion where year(fecha_entrega)=2020 group by year(fecha_entrega),month(fecha_entrega)  order by year(fecha_entrega),month(fecha_entrega);"
  );

  labels = extractAttributeValuesFromJsonArray(result, "fecha");
  values = extractAttributeValuesFromJsonArray(result, "entregados");

  res.render("statistics/statistics", { labels: labels, values: values });
});



router.get("/stat2", async (req, res) => {
  var result = await pool.query(
    "SELECT  date_format(fecha_entrega,'%Y-%b') as mes  , SUM(CASE WHEN sexo = 'macho' THEN 1 ELSE 0 END) AS machos  , SUM(CASE WHEN sexo = 'hembra' THEN 1 ELSE 0 END) AS hembras FROM    animal INNER JOIN adopcion ON animal.id_animal = adopcion.id_animal group by year(fecha_entrega),month(fecha_entrega)  order by year(fecha_entrega),month(fecha_entrega);"
  );
  console.log(result);
  labels = extractAttributeValuesFromJsonArray(result, "mes");
  valuesH = extractAttributeValuesFromJsonArray(result, "hembras");
  valuesM = extractAttributeValuesFromJsonArray(result, "machos");

  res.render("statistics/statistics", {
    labels: labels,
    valuesH: valuesH,
    valuesM: valuesM,
    stat: "stat2",
  });
});

router.post("/stat2", async (req, res) => {
  var { barraano } = req.body;
  var barraano = barraano;
  console.log(barraano);

  var result = await pool.query(
    `SELECT  date_format(fecha_entrega,'%Y-%b') as mes ,
    SUM(CASE WHEN sexo = 'macho' THEN 1 ELSE 0 END) AS machos  ,
    SUM(CASE WHEN sexo = 'hembra' THEN 1 ELSE 0 END) AS hembras
    FROM  animal INNER JOIN adopcion 
    ON animal.id_animal = adopcion.id_animal
    where year(fecha_entrega)="${barraano}"
    group by year(fecha_entrega),month(fecha_entrega)
    order by year(fecha_entrega),month(fecha_entrega);`
  );

  console.log(result);
  labels = extractAttributeValuesFromJsonArray(result, "mes");
  valuesH = extractAttributeValuesFromJsonArray(result, "hembras");
  valuesM = extractAttributeValuesFromJsonArray(result, "machos");

  res.render("statistics/statistics", {
    labels: labels,
    valuesH: valuesH,
    valuesM: valuesM,
    stat: "stat2",
    year: barraano,
  });
});

/**  numero de machos, hembras y total en la bd
  const result = await pool.query(
    "SELECT COUNT(CASE WHEN sexo =\"macho\" THEN id_animal END) AS machos, COUNT(CASE WHEN sexo =\"hembra\" THEN id_animal END) AS hembras, COUNT(*) AS Total FROM Animal;"
  );
*/
/** 
   * datos de animales entregados - año especifico
  const result = await pool.query(
    "SELECT especie,sexo,sitio_rescate,fecha_entrega FROM animal a INNER JOIN (SELECT *FROM  adopcion where year(fecha_entrega)=2020 GROUP BY id_animal) b ON a.id_animal = b.id_animal;"
  );

  /** agrupar # de adopciones por mes - todos los años
const result = await pool.query(
  "select date_format(fecha_entrega,'%Y-%b') as fecha, count(id_animal) as entregados from adopcion group by year(fecha_entrega),month(fecha_entrega) order by year(fecha_entrega),month(fecha_entrega);"
);
*/

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
