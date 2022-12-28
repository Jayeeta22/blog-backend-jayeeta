const mongooes=require("mongoose")
const postSchema=new mongooes.Schema({
    PostImage : String,
    title:String,
    description: String,
    author:String,
    date: String
})

const post=mongooes.model("post",postSchema);
module.exports=post