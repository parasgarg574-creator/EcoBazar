const moongose = require('mongoose');
const categorySchema = moongose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"",
        required:true,
    },
},
{
    timestamps:true
});
module.exports = moongose.model("category",categorySchema);
