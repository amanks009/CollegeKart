const mongoose = require('mongoose');
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

module.exports.search=async(req,res)=>{

    let search=req.query.search;
    // console.log(query);
    // const radiusInKm = 5000;
    // const radiusInMeters = radiusInKm * 1000;
    let latitude=req.query?.loc?.split(',')[0];
    let longitude=req.query?.loc?.split(',')[1];
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
          $maxDistance: 300 * 1000,
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
  }

module.exports.addProduct=(req,res)=>{
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
}

module.exports.getProducts=(req,res) => {

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
  
  
}

module.exports.getProductById=(req,res) => {

    Products.findOne( {_id : req.params.pId} )
    .then((result)=>{
      // console.log(result, "user data")
      res.send({message:"Success" , product:result})
    })
    .catch((err)=>{
      // console.log("error is in get products api")
      res.send({message:'Server error'})
    })
  }

 module.exports.myProducts=(req,res) => {
    const userId=req.body.userId;
    Products.find( {addedBy : userId} )
    .then((result)=>{
      res.send({message:"Success" , products:result})
    })
    .catch((err)=>{
      res.send({message:'Server error'})
    })
  }
  
module.exports.deleteProduct=(req,res)=>{
    // console.log(req.body);

    Products.findOne({_id: req.body.pid})
    .then((result)=>{
      if(result.addedBy===req.body.userId){
        Products.deleteOne({ _id: req.body.pid})
        .then((deleteResult)=>{
          console.log(deleteResult)
          if(deleteResult.acknowledged){
            res.send({message: 'success'})
          }
        })
        .catch(()=>{
          res.send({message: 'server error'})
        })
    }
    })
    .catch(()=>{
      res.send({message: 'server error'})
    })
}