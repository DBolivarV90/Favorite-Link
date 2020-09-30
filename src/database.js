const mysql = require('mysql');
const {promisify}=require('util');//para poder utilizar metodos Async y Await
const {database}= require('./keys');

const pool= mysql.createPool(database);//creando conexion
pool.getConnection((err,connection)=>{
    if(err){
      if (err.code==='PROTOCOL_CONNECTION_LOST') {
          console.error('DATABASE CONNECTION WAS CLOSED');
      }
      if (err.code==='ER_CON_COUNT_ERROR') {
        console.error('DATABASE HAS TO MANY CONNECTIONS');
    }
    if (err.code==='ECONNREFUSED') {
        console.error('DATABASE CONNECTION WAS REFUSED');
    }
    }
    if(connection)connection.release();
    console.log('DB is Connected');
    return;
       
    
});
//Para poder utilizar promesas a la hora de hacer los query. las promesas son las que pueden utilizar los metodos async y await
pool.query= promisify(pool.query);

module.exports= pool;