/**Módulo encargado de manejar el proceso de autenticación de usarios
 *y recuperación de contraseñas para la plataforma
 *la vistas controladas por este modulo se encuentran en la carptea views/employees
 *
 * @todo falta generar la contraseña aleatoriamente y probar todo el metodo
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
const pool = require("../database");
const passport = require("passport");
const helpers=require('../lib/helpers');
const nodemailer = require("nodemailer");

const { isNotLoggedIn } = require("../lib/auth");

/**Metodo encargado de renderizar la pagina de login
 *
 */
router.get("/employees/login", isNotLoggedIn, (req, res) => {
  res.render("employees/login");
});

/**Metodo encargado de validar la autenticacíon
 * en caso de que sea exitosa enruta hacia la pagina de animales
 * en caso contrario redirige hacia el login
 *
 */
router.post("/employees/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.login", {
    successRedirect: "/animals",
    failureRedirect: "/employees/login",
    failureFlash: true,
  })(req, res, next);
});

/**Método que cierra la sesion del usuario
 * y lo redirige a una pagina intermedia
 * desde la cual la cual no se puede volver hacia atras
 *
 */
router.get("/employees/logout", async (req, res) => {
  req.logOut();

  await pool.query("DELETE FROM sessions");
  res.redirect("/employees/logout_page");
});

/**Método que renderiza la página de confirmación de cierre de sesion
 * desde esta pagina no se puede volver hacia atras
 */
router.get("/employees/logout_page", async (req, res) => {
  res.render("employees/logout");
});

/**Metodo que sirve para reestablecer la contraseña
 * de acceso a la plataforma y posteriormente
 * enviarla al correo del colaborador
 */
router.post("/employees/restore_password", async (req, res) => {
  const { emailRec } = req.body;

  const employees = await pool.query("SELECT * FROM Empleado WHERE email=?", [
    emailRec,
  ]);

  if (employees[0] != null) {

    var newPassword=generatePassword();
    var newPasswordcif=await helpers.encryptPassword(newPassword);
    await pool.query(`UPDATE Empleado SET password="${newPasswordcif}" WHERE email="${emailRec}"`);

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
      to: `${emailRec}`, // list of receivers
      subject: "Recuperacion de contraseña", // Subject line
      text: ("Hola ?", employees[0].nombre), // plain text body
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
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Recuperación de contraseña</h1>
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
                          <p style="margin: 0;"> Hola! ${employees[0].nombre} su nueva contraseña es: ${newPassword}</p>
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
                          <p style="margin: 0;">Recibió este correo electrónico porque recibimos una solicitud de su cuenta. Si no solicitó esto, puede eliminar este correo electrónico de forma segura.</p>
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
    req.flash("success", "Se ha enviado una nueva contraseña a su correo electronico");
  } else {
    req.flash("error", "El correo ingresado no se encuentra registrado");
  }
  res.redirect("/employees/login");
});

function generatePassword(){

  var lowerCaseAlp = "abcdefghijklmnopqrstuvwxyz";
  var upperCaseAlp=lowerCaseAlp.toUpperCase();
  var numbers = "0123456789";

  var res="";
  for(var i=0;i<8;i++){
    
    
    
    var r4=Math.floor(Math.random() * (3- 0) + 0);

    if(r4==0){
      var r1=Math.floor(Math.random() * (lowerCaseAlp.length - 0) + 0);
      res+=lowerCaseAlp.charAt(r1);
    }else if(r4==1){
      var r2=Math.floor(Math.random() * (upperCaseAlp.length - 0) + 0);
      res+=upperCaseAlp.charAt(r2);
    }else{
      var r3=Math.floor(Math.random() * (numbers.length- 0) + 0);
      res+=numbers.charAt(r3);
    }
  }

  return res;

}

module.exports = router;
