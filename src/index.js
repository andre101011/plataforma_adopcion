/**Modulo core de la plataforma, maneja el servidor, inicializaciones,
 * configuraciones, middlewares y rutas
 *
 *
 * @todo hay que ponerle un nombre unico con uuid
 * 
 *
 *
 * @author Neyder Figueroa
 * @author Andrés Llinás
 * @since 2020 Universidad del Quindío
 * @copyright Todos los derechos reservados
 *
 */



if (process.env.NODE_ENV !== "production") {
  //carga las variables de entorno
  require("dotenv").config();
}

// Inicializaciones
const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
const exphbs = require("express-handlebars");
const multer = require("multer");
const flash = require("connect-flash");
const session = require("express-session");

const passport = require("passport");
const MySQLStore = require("express-mysql-session");
const { database } = require("./keys");
var uuid = require('uuid-random');

require("./lib/passport");

// Configuraciones -----------------------------------------------------

app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT);

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars.helpers"),
  })
);

app.set("view engine", "hbs");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploaded_images"),
  filename: (req, file, cb) => {
    cb(null, uuid()+ path.extname(file.originalname).toLowerCase());
  },
});

// Middelewares ---------------------------------------------------------

app.use(
  multer({
    storage: storage,
    dest: path.join(__dirname, "public/uploaded_images"),
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const mimetype = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));
      if (mimetype && extname) {
        return cb(null, true);
      }
      //req.flash('error','El archivo no es una imagen')
      cb("Error el archivo no es valido");
    },
  }).single("image")
);

//app.use(morgan('debug'));

app.use(
  session({
    secret: process.env.SECRET_SESSION ,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



// Variables globales -----------------------------------------------

app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.info = req.flash("info");
  app.locals.error = req.flash("error");
  app.locals.user = req.user;
  next();
});

//app.use(helmet());

//app.disable('x-powered-by')

// Rutas

app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/employees", require("./routes/employees"));
app.use("/animals", require("./routes/animals"));
app.use("/adoptions", require("./routes/adoptions"));
app.use("/statistics", require("./routes/statistics"));

// Publico -----------------------------------------------------------------

app.use(express.static(path.join(__dirname, "public")));

// Inicio de servidor -------------------------------------------------------

app.listen(app.get("port"), () => {
  console.log("servidor ejecutandose en el puerto", app.get("port"));
});

