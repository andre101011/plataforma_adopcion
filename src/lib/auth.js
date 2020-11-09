/**Modulo encargado de validar si existe un colaborador 
 * autenticado en la plataforma,tambien
 * valida si es administrador o no
 * 
 * El proposito de este modulo es proveer una manera de proteger el acceso
 * las vistas y algunas transacciones
 * 
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


module.exports={

    isLoggedIn(req,res,next){
        
        if(req.isAuthenticated()){
           
            return next() ;
        }
        return res.redirect('/');
    },

    isNotLoggedIn(req,res,next){
       
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/');
    },
    isAdmin(req,res,next){
      
        if(req.user.rol=='admin'){
            return next();
        }
        return res.redirect('/');
    }
};