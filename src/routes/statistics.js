/**Modulo que genera las estadisticas sobre
 * los procesos de adopcion de la fundación, las vistas controladas por este modulo
 * se encuentran en la carpeta views/adoptions
 *
 *
 * @todo organizar la vista, envolver las graficas en tarjetas
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
const pool = require("../database");

router.get("/", async (req, res) => {
  const e = await pool.query("SELECT * FROM Empleado");
  const a = await pool.query("SELECT * FROM Animal");
  var data = [e.length, a.length];

  res.render("statistics/statistics", { data: data });

});

module.exports = router;
