const express = require('express')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const path=require('path')
const multer=require('multer')
const productController=require('./controllers/productController')
const userController = require('./controllers/userController')

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
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/search',productController.search)
app.post('/like-product',userController.likeProducts)
app.post('/add-product', upload.fields([{ name :'pimage'},{ name:'pimage2'}]),productController.addProduct)
// API to get the product
app.get('/get-products' ,productController.getProducts)
//api to get the product and get to the product page
app.get('/get-product/:pId' ,productController.getProductById)
//api to get the liked products
app.post('/liked-products' ,userController.likedProducts)
app.post('/my-products' ,productController.myProducts)
app.post('/signup',userController.signup)
app.get('/my-profile/:userId',userController.myProfileById)
app.get('/get-user/:uId',userController.getUesrById)
app.post('/login',userController.login)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})