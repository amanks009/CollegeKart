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
    handleError(error);
  }
}

connectDB();



const Users = mongoose.model('Users',
   { username: String,
    password: String,
    likedProducts : [{ type: mongoose.Schema.Types.ObjectId, ref:'Products'}]
  });
const Products = mongoose.model('Products', { pname: String ,pdesc: String,price:String, category:String , pimage:String});



app.get('/', (req, res) => {
  res.send('Hello World!')
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

app.post('/signup',(req,res)=>{
  // console.log(req)
    const username=req.body.username;
    const password=req.body.password;
    const user = new Users({ username: username, password:password });
    user.save().then(()=>{
      res.send({message:'saved success..'})
    })
    .catch(()=>{
      res.send({message:'Serever error'})
    })
})


app.post('/add-product', upload.single('pimage'),(req,res)=>{
    // console.log(req.body);
    // if(!req.file) console.log('no file found')
    // console.log(req.file.path);
    const pname=req.body.pname;
    const pdesc=req.body.pdesc;
    const price=req.body.price;
    const category=req.body.category;
    const pimage=req.file.path;

    const product = new Products({pname: pname ,pdesc: pdesc,price:price , category:category , pimage:pimage });
    product.save().then(()=>{
      res.send({message:'saved success..'})
    })
    .catch(()=>{
      res.send({message:'Serever error'})
    })
})

// API to get the product
app.get('/get-products' ,(req,res) => {
  Products.find()
  .then((result)=>{
    // console.log(result, "user data")
    res.send({message:"Success" , products:result})
  })
  .catch((err)=>{
    // console.log("error is in get products api")
    res.send({message:'Server error'})
  })
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