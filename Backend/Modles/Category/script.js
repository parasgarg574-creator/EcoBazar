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
},
{
    timestamps: true
});
module.exports = mongoose.model("category", categorySchema);
