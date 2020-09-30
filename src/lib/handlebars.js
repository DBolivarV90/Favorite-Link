const {format}= require('timeago.js');


const helpers={};//objeto que sera utilizado por el motor de las vistas
helpers.timeago=(timestamp)=>{
return format(timestamp);//convierto el formato de la fecha de creacion del link
}
module.exports=helpers;