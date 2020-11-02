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
/**
 * Pagina Inicial de la aplicacion
 */
router.get('/',(req,res)=>{
    res.render('index');
})




module.exports=router;