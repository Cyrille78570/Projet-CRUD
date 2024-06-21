const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        likers: {
            type: [String],
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', postSchema);
