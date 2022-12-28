const mongooes=require("mongoose")
// const dotenv=require("dotenv")
// connect mongdb Atlus in nodejs
// dotenv.config({path:"./config.env"})
// const DB=process.env.DATABASE
mongooes.connect("mongodb+srv://jayeetablog1:jayeetablog1@cluster0.fzwdwwr.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log(err)
})