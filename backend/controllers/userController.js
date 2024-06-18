
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken')
const Users = mongoose.model('Users',
    { 
     username: String,
     mobile:String,
     email:String,
     password: String,
     likedProducts : [{ type: mongoose.Schema.Types.ObjectId, ref:'Products'}]
   });

module.exports.likeProducts=(req,res)=>{
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

}

module.exports.signup=(req,res)=>{
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
  }

module.exports.myProfileById=(req,res)=>{
    let uid=req.params.userId
    Users.findOne({_id:uid})
    .then((result)=>{
      res.send({message:'success..', user :
        { email: result.email,
        mobile:result.mobile,
        username :result.username
      }})
    })
    .catch(()=>{
      res.send({message:'Serever error'})
    })
  }

  module.exports.getUesrById=(req,res)=>{
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
  }

  module.exports.login=(req,res)=>{
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
  }

  module.exports.likedProducts=(req,res) => {
    Users.findOne({ _id: req.body.userId }).populate('likedProducts')
    .then((result)=>{
      res.send({message:"Success" , products:result.likedProducts})
    })
    .catch((err)=>{
      res.send({message:'Server error'})
    })
  }