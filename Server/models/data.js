const mongoose=require('mongoose')
const dataSchema=new mongoose.Schema({
    videoFile:{type:String,required:true},
    videoFile:{type:String,required:true}
})

const Data=mongoose.model('datavideo',dataSchema);

module.exports=Data;