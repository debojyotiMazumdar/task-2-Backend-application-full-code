var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test',{
  useUnifiedTopology:true,
  useNewUrlParser:true,
  useFindAndModify:false
}).then(()=>{
  console.log('Connected to database')
}).catch((e)=>console.log("Error:"+e))

var Schema=mongoose.Schema;
var newBlogDataSchema=new Schema({
  title:{type:String,require:true},
  description:String,
  created_at:{type:Date,default:Date.now()}
});

var newBlogData=mongoose.model('BlogData',newBlogDataSchema);

/* GET home page. */
router.get('/', async function(req, res, next) {
  const doc=await newBlogData.find();
  newBlogData.findOneAndDelete({description:"scientist"}).exec();
  res.render('index', { items:doc });
});

router.post('/find_by_id', async function(req,res,next){
  var req_id=req.body.id;
  const data=await newBlogData.findOne({_id:req_id});
  console.log(data);
  res.render("show-single-data",{data:data});

})

router.get('/new_post_page',async function(req,res,next){
  res.render("new_post_page");
})

router.post('/create',async function(req,res,next){
  var item={
    title:req.body.title,
    description:req.body.description
  };
  var data=new newBlogData(item);
  data.save();

  const doc=await newBlogData.find();
  res.render('index', { items:doc });
})

router.post('/delete_by_id',async function(req,res,next){
  const id = req.body.id;
  newBlogData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

router.post('/edit_page',async function(req,res,next){
  const id=req.body.id;
  const data=await newBlogData.findOne({_id:id});
  res.render('edit_page',{data:data});
})

router.post('/edit_post',async function(req,res,next){
  const id=req.body.id;
  console.log(id);
  const doc=await newBlogData.findOneAndUpdate({_id:id},{title:req.body.title,description:req.body.description});
  console.log(doc);
  res.redirect("/");
})

module.exports = router;
