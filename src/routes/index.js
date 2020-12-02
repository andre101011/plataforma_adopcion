/**Modulo que maneja la vista de la página inicial de la plataforma
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
const router= express.Router();
const pool = require("../database"); //conexión con la bd
/**
 * Pagina Inicial de la aplicacion
 */
router.get('/', async (req,res)=>{
    
    await pool.query(
        "SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
      );
    const animals = await pool.query("SELECT * FROM Animal WHERE estado='Sin Adoptar' ORDER BY fecha_rescate asc LIMIT 0, 9");


    res.render('index',{ animals: animals});
})




module.exports=router;