const mongoose = require("mongoose");
const ContentSchema = new mongoose.Schema(
    {
        page: {
            type: String,
            required: true,
            enum: ["terms-and-conditions", "privacy-policy"],
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
    },
    {
        timestamps: true,
    }
);

const Content = mongoose.model("Content", ContentSchema);
module.exports = Content;
