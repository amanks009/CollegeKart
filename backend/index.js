const express = require('express')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const path=require('path')
const multer=require('multer')


const storage = multer.diskStorage({
  // below two lines decide the location
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  // below 3 lines decide the file name (VVVIMP)
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const bodyParser=require('body-parser')
const app = express()
const port = 4000
const mongoose = require('mongoose');

//to get the loaction of image so that it could be displayed on the frontend
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));


const URL = 'mongodb+srv://amansskt:hrH0Wb3uZggEjA9g@cluster0.7df5pra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("DB Conected")
  } catch (error) {
    console.log(error);
  }
}

connectDB();



const Users = mongoose.model('Users',
   { 
    username: String,
    mobile:String,
    email:String,
    password: String,
    likedProducts : [{ type: mongoose.Schema.Types.ObjectId, ref:'Products'}]
  });

  let schema= new mongoose.Schema({
    pname: String ,
    pdesc: String,
    price: String,
    category: String ,
    pimage: String,
    pimage2: String,
    addedBy: mongoose.Schema.Types.ObjectId,
    pLoc:{
      type:{
        type : String,
        enum : ['Point'],
        default : 'Point'
      },
      coordinates:{
        type: [ Number ]
      }
    }
  })

  schema.index({pLoc: '2dsphere'});

const Products = mongoose.model('Products',schema);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/search',async(req,res)=>{

  let search=req.query.search;
  // console.log(query);
  // const radiusInKm = 5000;
  // const radiusInMeters = radiusInKm * 1000;
  let latitude=req.query.loc.split(',')[0];
  let longitude=req.query.loc.split(',')[1];
  // console.log(latitude)
  // console.log(longitude)
  
  // const products = await Products.find({
  //   $or: [
  //     { pname: { $regex: search, $options: 'i' } },
  //     { pdesc: { $regex: search, $options: 'i' } },
  //     { price: { $regex: search, $options: 'i' } },
  //     { category: { $regex: search, $options: 'i' } },
  //   ],
  //   pLoc: {
  //     $near: {
  //       $geometry: {
  //         type: 'Point',
  //         coordinates: [parseFloat(longitude), parseFloat(latitude)],
  //       },
  //       $maxDistance: radiusInMeters,

  //     }
  //   }
  // });
  // console.log(products)
  Products.find({
    $or :[
     { pname : {$regex : search}},
     { pdesc : {$regex : search}},
     { price : {$regex : search}},
     { category : {$regex : search}},
    ],
    pLoc: {
      $near: {
        $geometry:{
            type: 'Point',
            coordinates :[ parseFloat(latitude), parseFloat(longitude)]
        },
        $maxDistance: 200 * 1000,
      }
    }

  })
    .then((results)=>{
      // console.log(result, "user data")
      res.send({message:"Success" , products:results})
    })
    .catch((err)=>{
      // console.log("error is in get products api")
      res.send({message:'Server error'})
    })
})

app.post('/like-product',(req,res)=>{
    let productId=req.body.productId;
    let userId=req.body.userId;
    console.log(req.body);
    Users.updateOne({ _id : userId},{ $addToSet :{likedProducts: productId} })
    .then(()=>{
      res.send({message: 'like success'})
    })
    .catch((err)=>{
      // console.log(err)
      res.send({message:'server err'})
    })

  })

app.post('/add-product', upload.fields([{ name :'pimage'},{ name:'pimage2'}]),(req,res)=>{
    // console.log(req.body);
    // if(!req.file) console.log('no file found')
    // console.log(req.file.path);
    

    console.log(req.files);
    console.log(req.body)
    const plat=req.body.plat;
    const plong=req.body.plong;
    const pname=req.body.pname;
    const pdesc=req.body.pdesc;
    const price=req.body.price;
    const category=req.body.category;
    const pimage=req.files.pimage[0].path;
    const pimage2=req.files.pimage2[0].path;
    const addedBy=req.body.userId;

    const product = new Products({pname , pdesc,price , category ,pimage,pimage2,addedBy,pLoc:{
      type : 'Point', coordinates:[plat,plong]
    } });
    product.save()
    .then(()=>{
      res.send({message:'saved success..'})
    })
    .catch(()=>{
      res.send({message:'Serever error'})
    })
})

// API to get the product
app.get('/get-products' ,(req,res) => {

  const catName=req.query.catName;
  // console.log(catName);
  let _f={ }
  if(catName){
    _f={category:catName}
  }
  Products.find(_f)
  .then((result)=>{
    // console.log(result, "user data")
    res.send({message:"Success" , products:result})
  })
  .catch((err)=>{
    // console.log("error is in get products api")
    res.send({message:'Server error'})
  }
  )

//  try {
//   let data;
//   if(catName) {
//     data = await Products.find({category:catName});
//   }
//   else {
//     data = await Products.find();
//   }

//   res.send({message:"Success" , products:data})
//  }
//  catch(err) {
//   console.log(err)
//  }


})

//api to get the product and get to the product page
app.get('/get-product/:pId' ,(req,res) => {

  Products.findOne( {_id : req.params.pId} )
  .then((result)=>{
    // console.log(result, "user data")
    res.send({message:"Success" , product:result})
  })
  .catch((err)=>{
    // console.log("error is in get products api")
    res.send({message:'Server error'})
  })
})

//api to get the liked products
app.post('/liked-products' ,(req,res) => {
  Users.findOne({ _id: req.body.userId }).populate('likedProducts')
  .then((result)=>{
    res.send({message:"Success" , products:result.likedProducts})
  })
  .catch((err)=>{
    res.send({message:'Server error'})
  })
})

app.post('/signup',(req,res)=>{
  // console.log(req)
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;
    const mobile=req.body.mobile;
    const user = new Users({ username: username, password:password, email, mobile });
    user.save().then(()=>{
      res.send({message:'saved success..'})
    })
    .catch(()=>{
      res.send({message:'Serever error'})
    })
})
 
app.get('/get-user/:uId',(req,res)=>{
  const _userId=req.params.uId;
  Users.findOne( { _id :_userId } )
  .then((result)=>{
    res.send({message:'success..', user : { email: result.email,
      mobile:result.mobile,
      username :result.username
    }})
  })
  .catch(()=>{
    res.send({message:'Serever error'})
  })
})


app.post('/login',(req,res)=>{
  // console.log(req)
    const username=req.body.username;
    const password=req.body.password;
    // const user = new Users({ username: username, password:password });
    
    Users.findOne({ username : username })
    .then((result)=>{
      console.log(result, "user data")
      if(!result){
        res.send({message:'user not found'})
      }
      else{
        if(result.password==password){
          const token=jwt.sign({
            data: result
          }, 'MYKEY', { expiresIn: '1h' });
          res.send({message:'find success..',token:token,userId:result._id})
        }
        if(result.password!=password){
          res.send({message:'user not found'})
        }
      }
      
    })
    .catch(()=>{
      res.send({message: ' error'})
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})