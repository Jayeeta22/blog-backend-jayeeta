const mongooes=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const userSchema=new mongooes.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    Cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{type:String,required:true}
    
    }]

})

//we are hashing our password
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,12)
        this.Cpassword=await bcrypt.hash(this.Cpassword,12)
    }
    next()
    
})

// we are generating token
userSchema.methods.generateAuthToken= async function(){
    try{
        let token =jwt.sign({_id:this._id},process.env.SECRET_KEY)//token generate
        this.tokens=this.tokens.concat({token:token})//add tokens
        await this.save()
        return token;
    }catch(err){
        console.log(err)
    }
}
const user=mongooes.model("user",userSchema);
module.exports=user
