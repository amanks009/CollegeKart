
const mongoose = require('mongoose');
const md5 = require('md5');
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

module.exports.dislikeProducts=(req,res)=>{
  let productId=req.body.productId;
  let userId=req.body.userId;
  console.log(req.body);
  Users.updateOne({ _id : userId},{ $pull :{likedProducts: productId} })
  .then(()=>{
    res.send({message: 'Removed from liked!'})
  })
  .catch((err)=>{
    // console.log(err)
    res.send({message:'server err'})
  })

}

module.exports.signup=async (req,res)=>{
    // console.log(req)
      const username=req.body.username;
      const password=req.body.password;
      const encrypt_password=md5(password);
      // console.log(encrypt_password);
      const email=req.body.email;
      const mobile=req.body.mobile;
      const existing_username=await Users.findOne({username});
      if(existing_username){
        res.status(400).send("username already exist");
        return;
      }
      const user = new Users({ username: username, password:encrypt_password, email, mobile });
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
      const enc_pass=md5(password);
      // const user = new Users({ username: username, password:password });
      // console.log(req);
      Users.findOne({ username : username })
      .then((result)=>{
        console.log(result, "user data")
        if(!result){
          res.send({message:'user not found'})
        }
        else{
          if(result.password===enc_pass){
            console.log(enc_pass)
            const token=jwt.sign({
              data: result
            }, 'MYKEY', { expiresIn: '1h' });
            res.send({message:'find success..',token:token,userId:result._id, username: result.username})
            return;
          }
          if(result.password!=enc_pass){
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