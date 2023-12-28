const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
        author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
        },
        username: String,
        body: {
            type: String,
            required: true
        },
        postDate: Date,
        editDate: Date,
        upVotes: Number,
        downVotes: Number,
        edited: Boolean,
        numReplies: Number,
        upVotedBy: {
                type: [String],
                default: undefined
        },
        downVotedBy: {
                type: [String],
                default: undefined
        },
        flairOption: {
                type: String,
                required: false
        },
        post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
        },
        replyingTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
        },
        profilePic: {
                type: String,
                required: false
        }},
        {collection: 'Comments'},
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;