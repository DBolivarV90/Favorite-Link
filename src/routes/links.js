const express= require('express');
const router= express.Router();


const pool= require('../database');//coneccion a la base de datos
const {isLoggedIn}=require('../lib/auth');//Identifica si el usuario esta logueado para proteger las rutas
router.get('/add',isLoggedIn,(req,res)=>{
    res.render('links/add');
});

router.post('/add',isLoggedIn, async(req,res)=>{
   const{title,url,description}=req.body;
   const newLink={
       title,
       url,
       description,
       user_id:req.user.id
   };
  await pool.query('INSERT INTO links set ?',[newLink]);
    req.flash('success','Link Saved successfully');
    res.redirect('/links');
})
router.get('/',isLoggedIn, async (req,res)=>{
const links= await pool.query('SELECT *FROM links WHERE user_id= ?',[req.user.id]);
console.log(links);
res.render('links/list',{links});
});

router.get('/delete/:id',isLoggedIn, async(req,res)=>{
    const{id}=req.params;
    await pool.query('DELETE FROM links WHERE ID= ?',[id]);
    req.flash('success','Link Removed successfully');
    res.redirect('/links');
});

router.get('/edit/:id',isLoggedIn, async(req,res)=>{
    const {id}=req.params;
    const link=await pool.query('SELECT *FROM links WHERE id=?',[id]);
    const{title,url,description}=link[0];
    res.render('links/edit',{id,title,url,description});
});
router.post('/edit/:id',isLoggedIn, async(req,res)=>{
    const{id}=req.params;
    const {title,url,description}=req.body;
    const newLink={
      title,
      url,
      description
    };
    console.log(newLink);
    await pool.query('UPDATE links set? WHERE id=?',[newLink,id]);
    req.flash('success','Link Updated successfully');
    res.redirect('/links');

});

module.exports= router;