const mysql =require('mysql');
const {database}= require('./keys');
const pool =mysql.createPool(database);
const {promisify}= require('util');

pool.getConnection((err,connection)=>{


    if(err){
        if(err.code ===  'PROTOCOL_CONECTION_LOST'){
            console.log('conexión a la base de datos cerrada');
        }else if(err.code==='ER_CON_COUNT_ERROR'){
            console.log('la bd cuenta con demasiadas conexiones')
        }else if(err.code==='ECONNREFUSED'){
            console.log('la bd fue rechazada')

        }
    }else{

        if(connection){
            connection.release();
            console.log('conexión a la base de datos exitosa');
        }      
    } 

    return;
}) 

pool.query= promisify(pool.query),
module.exports =pool;