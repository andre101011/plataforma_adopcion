const express = require("express");
const router= express.Router();
/**
 * Pagina Inicial de la aplicacion
 */
router.get('/',(req,res)=>{
    res.send('page in process of develop');
})


module.exports=router;