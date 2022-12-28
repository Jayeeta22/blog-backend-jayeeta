const express=require("express")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const cloudinary = require('cloudinary').v2;
const authenticate=require("../middleware/authenticate")
const Router=express.Router();

require("../db/connection")   //connection with database
const User=require("../models/userSchema")
const Post=require("../models/postSchema")
Router.get("/",(req,res)=>{
    res.send("hello from router")
})



//using async await
Router.post("/register",async(req,res)=>{
    console.log(req.body)
  // res.json({massage:req.body}) //get this data in postman
    const {email,password,Cpassword}=req.body
    if( !email || !password || !Cpassword){
        return res.status(422).json({Error:"All fields are mandatory"})
    }

    try{
      const userexist=await  User.findOne({email:email})

        if(userexist){
            return res.status(422).json({Error:"This email already exist"})
        }
        const user=new User({email,password,Cpassword})
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

// for post images 

// cloudinary.config({ 
//     cloud_name: 'deuqs5ys2', 
//     api_key: '473754527674832', 
//     api_secret: 'jO-iAhp6W9rNmNY7Y2WZRiVbdi0' 
// });

// Router.post("/upload",async (req,res)=>{
//     console.log(req.body);
//     const file = req.files.PostImage;
//     console.log(file)

//     cloudinary.uploader.upload(file.tempFilePath, async(err,result)=>{
//         console.log(result);
//         try{
//             const posts = await Post.create({
//                 PostImage : result.url,
//                 title: req.body.title,
//                 description: req.body.description,
//                 author: req.body.author,
//                 date: req.body.date
//             });
//             res.json({
//                 status: "Sucess",
//                 posts
        
//             })
    
//         }catch(e){
//             res.status(500).json({
//                 status: "Failed",
//                 message : e.message
        
//             })
//         }
//     })
// })

// Router.get("/show",async(req,res)=>{
//     try{
//         const posts = await Post.find().sort({_id:-1});
//         res.status(200).json({
//             posts
//         })
//     }catch(e){
//         res.status(500).json({
//             status: "Failed",
//             message : e.message
    
//         })
//     }
// })



    
 module.exports=Router