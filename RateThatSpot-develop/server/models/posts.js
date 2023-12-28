const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    username: String,
    rating: Number,
    postDate: Date,
    editDate: Date,
    upVotes: Number,
    downVotes: Number,
    totalVotes: Number, 
    edited: Boolean,
    amenity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity"
    }
},
{collection: "Posts"});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;