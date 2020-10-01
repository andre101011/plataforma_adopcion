const express = require("express");
const router= express.Router();
/**
 * Pagina Inicial de la aplicacion
 */
router.get('/',(req,res)=>{
    res.render('index');
})


module.exports=router;