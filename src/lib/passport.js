//Definimos nuestros metodos de autenticacion

const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;
const pool= require('../database');
const helpers=require('../lib/helpers');

passport.use('local.signin',new LocalStrategy({
usernameField:'username',
passwordField:'password',
passReqToCallback:true

},async(req,username,password,done)=>{
  
  const rows=await pool.query('SELECT *FROM users WHERE username= ?',[username]);
  console.log(rows);
  if(rows.length>0){
    const user=rows[0];
  const validPassword= await helpers.matchPassword(password,user.password);
if(validPassword)
{
done(null,user,req.flash('success','Welcome' +user.username));
} else{
  done(null,false,req.flash('message','Incorrect Password'));
} 
}else{
  return done(null, false,req.flash('message','The Username does not exist'));
}
}));

//primero configuramos nuestro objeto passport, recibe como primer parametro el nombre que le colocamos a nuestra autentificacion (local.signup) en este caso
passport.use('local.signup',new LocalStrategy({
    usernameField:'username',//a traves del campo username estoy recibiendo el userfield (campo que viene con la libreria passport)
    passwordField:'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    const{fullname}=req.body;
    const newUser={
        username,
        password,
        fullname
        
    };
       newUser.password=await helpers.encryptPassword(password);
       const result=await pool.query('INSERT INTO users SET?',[newUser]); 
       newUser.id=result.insertId;//para traerme el id que la base de datos le asigno al usuario guardado en la BD
       return done(null,newUser);
    }));

  passport.serializeUser((user,done)=>{
      done(null,user.id);
    });//PAra que el passport funcione, debemos serializar al usuario

  passport.deserializeUser(async(id,done)=>{
    const row=await pool.query('SELECT *FROM users where id=?',[id]);
    done(null,row[0]);

  });

