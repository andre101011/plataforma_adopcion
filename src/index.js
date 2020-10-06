
// Inicializaciones

const express = require('express');
const app = express();

const path = require("path");
const exphbs = require("express-handlebars");
const multer = require('multer');
const flash = require('connect-flash');
const session=require('express-session');

const passport = require('passport');
const MySQLStore = require('express-mysql-session');
const {database}=require('./keys');

require('./lib/passport');


// Configuraciones

app.set("views", path.join(__dirname, "views"));
app.set("port", 3000);

app.engine('.hbs',exphbs({
  defaultLayout :'main',
  layoutsDir:  path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))

app.set('view engine', 'hbs'); 

const storage = multer.diskStorage({
  destination:  path.join(__dirname, "public/uploaded_images"),
  filename:(req, file,cb)=>{
   
    cb(null,file.originalname);
    
  }

});

// Middelewares

app.use(multer({
  storage: storage,
  dest:  path.join(__dirname, "public/uploaded_images"),
  limits: {fileSize: 5000000},
  fileFilter:(req,file,cb)=>{

    const fileTypes=/jpeg|jpg|png/;
    const mimetype= fileTypes.test(file.mimetype);
    const extname= fileTypes.test(path.extname(file.originalname));
    if(mimetype && extname){
      return cb(null,true);
    }
    cb("Error el archivo no es valido")
  }

}).single('image'))

//app.use(morgan('debug'));

app.use(session({
    secret:'secureSessionPAF',
    resave:false,
    saveUninitialized:false,
    store: new MySQLStore(database),
    


}));

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());


// Variables globales

app.use((req,res,next)=>{
  app.locals.success=req.flash('success');
  app.locals.info=req.flash('info');
  app.locals.error=req.flash('error');
  app.locals.user=req.user;
  next();
})




// Rutas

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/employees',require('./routes/employees'));
app.use('/animals',require('./routes/animals'));

// Publico

app.use(express.static(path.join(__dirname,'public')));

// Inicio de servidor

app.listen(3000, () => {
  console.log("servidor ejecutandose en el puerto", 3000);
});



