const express=require("express")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const authenticate=require("../middleware/authenticate")
const Router=express.Router();

require("../db/connection")   //connection with database
const User=require("../models/userSchema")
Router.get("/",(req,res)=>{
    res.send("hello from router")
})
//using promises
// Router.post("/register",(req,res)=>{
//     console.log(req.body)
//     // res.json({massage:req.body}) //get this data in postman
//     const {name,email,phone,password,Cpassword}=req.body
//     if(!name || !email || !phone || !password || !Cpassword){
//         return res.status(422).json({Error:"All fields are mandatory"})
//     }
//     // to find that user exist or not
//     User.findOne({email:email})
//     .then((userexist)=>{
//         if(userexist){
//             return res.status(422).json({Error:"This email already exist"})
//         }
//         const user=new User({name,email,phone,password,Cpassword}) //create new user instance
//         user.save()
//         .then(()=>{
//             return res.status(201).json({Massage:"Registration successful"})
//         }).catch((err)=>{
//             return res.status(500).json({error:"Registration is not  successful"})
//         })
//     }).catch((err)=>{console.log(err)})

    
// })


//using async await
Router.post("/register",async(req,res)=>{
    console.log(req.body)
  // res.json({massage:req.body}) //get this data in postman
    const {name,email,phone,password,Cpassword}=req.body
    if(!name || !email || !phone || !password || !Cpassword){
        return res.status(422).json({Error:"All fields are mandatory"})
    }

    try{
      const userexist=await  User.findOne({email:email})

        if(userexist){
            return res.status(422).json({Error:"This email already exist"})
        }
        const user=new User({name,email,phone,password,Cpassword})
       await user.save();
       
        return res.status(201).json({Massage:"Registration successful"}) 
       

    }catch(err){
        console.log(err)
    }
    })

    // signin part
    Router.post("/signin",async(req,res)=>{
        let token
        console.log(req.body)
  // res.json({massage:req.body}) //get this data in postman
    const {email,password}=req.body
    if(!email || !password ){
        return res.status(400).json({Error:"All fields are mandatory"})
    }
        try{
            const userLogin=await  User.findOne({email:email})
            console.log(userLogin)
            if(userLogin){
                const isMatch= await bcrypt.compare(password,userLogin.password);
                token= await userLogin.generateAuthToken()
                 res.status(200).json({
                    status:"success",
                    Token:token
                    
                })
                console.log(token);
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now()+25892000000),
                    httpOnly:true,
                    secure: false
                })
                console.log(req.cookies.jwttoken)
            if(!isMatch){
                return res.status(400).json({Error:"credencial error"})
            }else{
                return res.status(200).json({Massage:"signin successfull"})
            }
            }else{
                return res.status(400).json({Error:"credencial error"})
            }
            
        }catch(err){

        }
    
    })


    Router.get("/about", authenticate,async(req,res)=>{
        try{
            console.log("hello about")
           res.send("hello about")
        }catch(e){
            res.status(400).send(e)
        }
    })
    


module.exports=Router