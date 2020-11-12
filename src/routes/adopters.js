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



router.get("/", isLoggedIn, async (req, res) => {
    
    const adopters = await pool.query("SELECT * FROM Adoptante");  
    res.render("adopters/list", { adopters: adopters });
});

module.exports = router;