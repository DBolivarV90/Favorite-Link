const express = require('express');
const morgan= require('morgan');
const exphbs= require('express-handlebars');
const path= require('path');
const flash= require('connect-flash');
const session= require('express-session');
const mysqlstore=require('express-mysql-session');//guarda las sesiones en la bd 
const passport= require('passport');

const {database}= require('./keys');//datos de la conexion a la BD

//Inicializaciones
const app= express();
require('./lib/passport');//Nuestra configuracion de Autenticacion

//settings
app.set('port', process.env.PORT||4000);

app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));//configurando hbs
app.set('view engine','.hbs');//Pongo en funcionamiento la configuracion realizada al motor de vistas


//Middlewares
app.use(session({
    secret:'Favoritelink',
    resave:false,
    saveUninitialized:false,
    store: new mysqlstore(database)//guardo la session en la BD  

}));
app.use(flash());//para enviar mensajes en todas las vistas, se requiere tener el middleware de session activado para poder utilizar flash
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());//Iniciamos passport
app.use(passport.session());//passport necesita una session

// Global Variables
app.use((req,res,next)=>{
   app.locals.success=req.flash('success');
   app.locals.message=req.flash('message');
   app.locals.user=req.user;
    next();
})



//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname,'public')));

//Starting the server
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});