const express = require('express');
const app = express();

const path = require("path");
const exphbs = require("express-handlebars");

// Inicializaciones

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

// Middelewares

//app.use(morgan('debug'));
app.use(express.urlencoded({extended : false}));
app.use(express.json());

// Variables globales
app.use((req,res,next)=>{
  next();
})

// Rutas

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/productos',require('./routes/productos'));

// Publico

app.use(express.static(path.join(__dirname,'public')));

// Inicio de servidor

app.listen(3000, () => {
  console.log("servidor ejecutandose en el puerto", 3000);
});



