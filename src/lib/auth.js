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