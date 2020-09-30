const bcrypt= require('bcryptjs');
const helpers={};
//Creo los metodos que quiero utilizar en cualquier parte de nuestra aplicacion
helpers.encryptPassword=async (password)=>{
const salt=await bcrypt.genSalt(10);//las veces que quiero ejecutar el algoritmo de cifrado
const hash=await bcrypt.hash(password,salt);
return hash;
};//metodo que encripta los password

//metodo para descifrar el password y compararlo con el password ingresado por el usuario a la hora de loguearse
helpers.matchPassword=async(password,savedPassword)=>{
try{
 return await bcrypt.compare(password,savedPassword);
}catch(e){
  console.log(e);      
}
};


module.exports= helpers;