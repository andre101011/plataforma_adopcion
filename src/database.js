const mysql =require('mysql');
const {database}= require('./keys');
const pool =mysql.createPool(database);
const {promisify}= require('util');

pool.getConnection((err,connection)=>{

    if(connection) connection.release();
    console.log('conexion a la base de datos exitosa');

    return;
}) 

pool.query= promisify(pool.query),
module.exports =pool;