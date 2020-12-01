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
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth"); //validación de acceso
const nodemailer = require("nodemailer");
const e = require("express");

var req1_add;
var req2_add;
var actualAnimals;
var maxNumAnimals=3;
var intersadoEn=-1;
var animalToAdopt;

router.get("/", isLoggedIn, async (req, res) => {
    const adopters = await pool.query("SELECT * FROM Adoptante");  
    res.render("adopters/list", { adopters: adopters });
});

/**Método que renderiza la página con la lista de animales
 *
 */
router.get("/animals", isNotLoggedIn,async (req, res) => {
  
    const animals = await pool.query("SELECT * FROM Animal where estado='Sin Adoptar'");
    actualAnimals=animals;
  
    var animalsPags=animalsPart(actualAnimals,0,maxNumAnimals);
  
    res.render("adopters/view", { animals: animalsPags ,totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:0});
  });

router.get("/add/:id", async (req, res) => {
    
    const {id}=req.params
    intersadoEn=parseInt(id);
    
    res.render("adopters/form_add_1");
});

router.post("/form_part1", async (req, res) => {
    
    const {nombre,
        apellido,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        direccion,
        ocupacion,
        correo}=req.body;

    req1_add={
        nombre,
        apellido,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        ocupacion,
        direccion,
        correo,
        referencias:null,
        cuestionario:null,
    };
     
    

    var person=await pool.query("SELECT * FROM Adoptante WHERE documento_identidad=?",[documento_identidad]);
    var adopcion=await pool.query('SELECT * FROM Adopcion WHERE id_adoptante=?',[documento_identidad]);
    if(person[0]!=null){
      req1_add=null;
      if(adopcion[0]!=null){
        req.flash("error", "Solo puede realizar una solicitud para adoptar un animal a la vez, usted ya ha realizado una solicitud y se encuentra en proceso de estudio");
      }else{
        req.flash("error", "Este adoptante ya se encuentra registrado");

      }
      res.redirect("/adopters/add/-1");

    }else{
 
      res.render("adopters/form_add_2");
    }

   
});


router.post("/form_part2", async (req, res) => {
    
    const {nombreApellido,
        parentesco,
        direccion,
        ciudad,
        tel_casa,
        celular,
        nombreApellido1,
        parentesco1,
        direccion1,
        ciudad1,
        tel_casa1,
        celular1}=req.body;

    req2_add={
        nombreApellido,
        parentesco,
        direccion,
        ciudad,
        tel_casa,
        celular,
        nombreApellido1,
        parentesco1,
        direccion1,
        ciudad1,
        tel_casa1,
        celular1
    };
     
    //console.log(req2_add);
    res.render("adopters/form_add_3");
});

router.post("/form_part3", async (req, res) => {
    const {
        nombre,
        pregunta1,
        pregunta2,
        q2cuales,
        pregunta3,
        q3cuales,
        pregunta4,
        pregunta5,
        edades,
        pregunta6,
        pregunta7,
        pregunta8,
        pregunta9,
        pregunta10,
        pregunta11,
        pregunta12,
        pregunta13,
        pregunta14,
        pregunta15,
        pregunta16,
        pregunta17,
        pregunta18,
        pregunta19,


    }=req.body;

    var cuestionario={
        nombre,
        pregunta1,
        pregunta2,
        q2cuales,
        pregunta3,
        q3cuales,
        pregunta4,
        pregunta5,
        edades,
        pregunta6,
        pregunta7,
        pregunta8,
        pregunta9,
        pregunta10,
        pregunta11,
        pregunta12,
        pregunta13,
        pregunta14,
        pregunta15,
        pregunta16,
        pregunta17,
        pregunta18,
        pregunta19, 
    }

    for(var i in cuestionario){
        if(cuestionario.hasOwnProperty(i)){
            if(cuestionario[i]==undefined){
                cuestionario[i]=null;
            }

        }
    }

    cuestionario=JSON.stringify(cuestionario);
    req2_add=JSON.stringify(req2_add);

    var adopter=req1_add;
    adopter.referencias=req2_add;
    adopter.cuestionario=cuestionario;
    
    await pool.query("INSERT into Adoptante set ?", [adopter]);
    
    req1_add=null;
    req2_add=null;
    
   
    if(req.isAuthenticated()){

    res.redirect("/adopters");

    }else{

      if(intersadoEn!=-1){
        animalToAdopt=await pool.query("SELECT * FROM Animal WHERE id_animal=?",[intersadoEn]);
        enviarNotificacion(adopter);
    }

      req.flash("success", "Se ha enviado la solicitud de adopción, debe estar atento, la fundación se comunicará con usted");
      res.redirect("/adopters/animals");
    }
});


router.get("/get_adopter/:id", isLoggedIn, async (req, res) => {

    const {id}=req.params;
    const adopter = await pool.query("SELECT * FROM Adoptante WHERE documento_identidad=?",[id]);
    
    res.render("adopters/adopter",{adopter:adopter[0]});
});

router.post("/update", isLoggedIn, async (req, res) => {

    const {nombre,
        apellido,
        tipo_documento,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        direccion,
        ocupacion,
        correo}=req.body;

    adoptante={
        nombre,
        apellido,
        tipo_documento,
        documento_identidad,
        tel_casa,
        celular,
        ciudad,
        ocupacion,
        direccion,
        correo
    };
     
    await pool.query(`UPDATE Adoptante SET ? WHERE documento_identidad=${documento_identidad}`,[adoptante]);
    res.redirect('/adopters');
;});

router.get("/delete/:id", isLoggedIn, async (req, res) => {

    const {id}=req.params;
    var adopcion=await pool.query('SELECT * FROM Adopcion WHERE id_adoptante=?',[id]);
    var animal= await pool.query('SELECT * FROM Animal INNER JOIN Adopcion on Animal.id_animal=Adopcion.id_animal WHERE Adopcion.id_adoptante=?',[id]);

    if(adopcion[0]!=null){
      if((adopcion[0].estado=="Denegada" || adopcion[0].estado=="En proceso") && animal[0].estado!="Adoptado"){
        await pool.query(`UPDATE Animal SET estado="Sin Adoptar" WHERE id_animal="${adopcion[0].id_animal}"`); 
      }
    } 
    await pool.query('DELETE FROM Adoptante WHERE documento_identidad=?',[id]);
    req.flash("success", "Se ha eliminado exitosamente el adoptante");

    res.redirect("/adopters");
});



function animalsPart(data,init,end){

    var res=[];
  
    for (var i=init;i<end && i<data.length;i++){
      res.push(data[i]);
    }
    console.log(res);
    return res;
   
  
  }

  router.post("/animals/search", isNotLoggedIn, async (req, res) => {
    const {
      search,
      macho,
      hembra,
      Grande,
      Mediano,
      Pequenio,
      gato,
      perro,
      adoptado,
      enProceso,
    } = req.body;
  
    var animals;
  
    var filter = {
      s1: macho,
      s2: hembra,
      t1: Grande,
      t2: Mediano,
      t3: Pequenio,
      p1: gato,
      p2: perro,
      e1: adoptado,
      e2: "sin Adoptar",
      e3: enProceso,
    };
    
    var query_filter="and";
    //filter=JSON.stringify(filter);
    for (var i in filter) {
      if (filter.hasOwnProperty(i)) {
        if (filter[i] != undefined) {
          if((i+"").startsWith("s")){
            query_filter+=" sexo="+ `'${filter[i]}'` ;
  
          }else if((i+"").startsWith("t")){
            query_filter+=" tamanio="+  `'${filter[i]}'` ;
  
          }
          else if((i+"").startsWith("p")){
  
            query_filter+=" especie="+  `'${filter[i]}'` ;
  
          }else if((i+"").startsWith("e")){
            query_filter+=" estado="+  `'${filter[i]}'`;
          }
          query_filter+=` and `;
        }
        
        
      }
    }
    query_filter=query_filter.substring(0,query_filter.length-5);
    console.log(query_filter);
    var query="SELECT * FROM Animal";
    var empty=true;
    if(search !== ""){
      empty=false;
      query+=` WHERE ( nombre LIKE '%${search}%' or id_animal LIKE '%${search}%' )`;
    }
  
    if (query_filter.length>3) {
      console.log("entra" + query_filter)
  
      if(empty){
        query_filter= query_filter.substring(3,query_filter.length);
        query+=" WHERE "+query_filter;
      }else{
        query+=" "+query_filter;
      }
    }
    console.log(query);
    
    animals = await pool.query(query);
    //console.log(filter)
  
    actualAnimals=animals;
  
  
    var animalsPags=animalsPart(actualAnimals,0,maxNumAnimals);
    res.render("adopters/view", { animals: animalsPags, filter:filter, totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:0});
  });
  

  router.get("/animals/pag/:id", isNotLoggedIn,async (req, res) => {
    const { id } = req.params;
    const animals = await pool.query("SELECT * FROM Animal WHERE estado='Sin Adoptar'");
    actualAnimals=animals;
   
    var pag=id;
    var actualPage=parseInt(pag)*maxNumAnimals;
    var animalsPags=animalsPart(actualAnimals,actualPage,actualPage+maxNumAnimals);
    
   
    res.render("adopters/view", { animals:animalsPags,totalPages:Math.ceil(animals.length/maxNumAnimals),actualPage:id});
  });

 async function enviarNotificacion (adopter) {

  const employees = await pool.query('SELECT * FROM Empleado'); 

  

  var emails="";
  for (var i=0;i<employees.length;i++){
    emails+=employees[i].email+",";

  }
  emails=emails.substring(0,emails.length-1);

  console.log("emails: " +emails)

  const transporter = nodemailer.createTransport({
    host: "server.hostingbricks.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Plataforma Adopcion" ${process.env.EMAIL}`, // sender address
    to: emails, // list of receivers
    subject: "Nuevo adoptante", // Subject line
    html: `<!DOCTYPE html>
          <html>
          <head>
          
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
            @media screen {
              @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 400;
                src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
              }
          
              @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 700;
                src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
              }
            }
          
            body,
            table,
            td,
            a {
              -ms-text-size-adjust: 100%; /* 1 */
              -webkit-text-size-adjust: 100%; /* 2 */
            }
          
          
            table,
            td {
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            }
          
            img {
              -ms-interpolation-mode: bicubic;
            }
          
            a[x-apple-data-detectors] {
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              color: inherit !important;
              text-decoration: none !important;
            }
          
           
            div[style*="margin: 16px 0;"] {
              margin: 0 !important;
            }
          
            body {
              width: 100% !important;
              height: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          
            table {
              border-collapse: collapse !important;
            }
          
            a {
              color: #1a82e2;
            }
          
            img {
              height: auto;
              line-height: 100%;
              text-decoration: none;
              border: 0;
              outline: none;
            }
            </style>
          </head>
          <body style="background-color: #e9ecef;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="center" valign="top" style="padding: 36px 24px;">
                        <a href="https://adopciones-fundamor.herokuapp.com/" target="_blank" style="display: inline-block;">
                          <img src="https://res.cloudinary.com/dzlu0xca4/image/upload/v1605676309/imagotipo_ykwjdt.png" alt="Logo" border="0" width="48" style="display: block; width: 120px; max-width: 120px; min-width: 120px;">
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Nuevo Adoptante!!!</h1>
                      </td>
                    </tr>
                  </table>
          
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                        <p style="margin: 0;">Hola! hay una nueva persona interesada en adoptar a "${animalToAdopt[0].nombre}", su nombre es "${adopter.nombre}" con CC:" ${adopter.documento_identidad}", revisa la plataforma en la sección de adoptantes</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" bgcolor="#ffffff">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                              <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                    <a href="https://adopciones-fundamor.herokuapp.com/employees/login" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Ir a la plataforma</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                        <p style="margin: 0;">Saludos,<br> Fundamor</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                        <p style="margin: 0;">Recibió este correo electrónico porque se encuenta registrado en la plataforma de adopción propiedad de la fundación fundamor. Si no es de su agrado, puede eliminar este correo electrónico de forma segura.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>`, // html body
  });
  console.log("Message sent: %s", info.messageId);
  
}
  
module.exports = router;