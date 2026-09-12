const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "",
        required: true,
    },
    ispopular:{
        type: Boolean,
        default: false
    },
    productID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }
},
{
    timestamps: true
});
module.exports = mongoose.model("category", categorySchema);
