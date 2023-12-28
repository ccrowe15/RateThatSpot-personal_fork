const express = require('express');
const mongoose = require("mongoose");
const Post = require('../models/posts');
const User = require('../models/user');
const Comment = require('../models/comment')
const { ObjectId } = require('mongodb');


const router = express.Router();

//route to get comments
router.route('/fetchComments/:post_id').get(async function (req, res) {
    const { post_id } = req.params
    try {
        const comments = await Comment.find({post: post_id})
        res.status(200).json(comments)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//route to find comment by id
router.route('/comment/:id').get(async function (req, res) {
    const { id } = req.params;
    try {
        const post = await Comment.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//get all replies to comment
router.route('/getReplies/:id').get(async function (req, res) {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id);
        const replies = await Comment.find({replyingTo: ObjectId(comment._id) } )

        for (let i = 0; i < replies.length; i++) {
            const user = await User.findById(replies[i].author)
            replies[i]["profilePic"] = user.ProfilePicture
            console.log(user.flairOption)
            replies[i]["flairOption"] = user.flairOption
            //console.log(replies[i])
        }

        res.status(200).json(replies);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.route('/commentsByUsername/:username').get(async function (req, res) {
    const { username } = req.params;
    try {
        const user = await User.find({name: username });
        const user_id = user[0]._id
        const comments = await Comment.find({ author: user_id });
        res.status(200).json(comments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//route to create new comment
router.route('/comment').post(async function (req, res) {
    let reply_id = null
    if (req.body.replyingTo != null) {
        reply_id = ObjectId(req.body.replyingTo)
    }
    const newComment = new Comment({
        author: ObjectId(req.body.author),
        body: req.body.body,
        username: req.body.username,
        postDate: new Date(),
        editDate: new Date(),
        upVotes: 0,
        downVotes: 0,
        edited: false,
        replyingTo: reply_id,
        post: ObjectId(req.body.post),
        upVotedBy: [],
        downVotedBy: [],
        numReplies: 0 });
    try {
        await newComment.save();

        if (reply_id) {
            const replyingTo = await Comment.findById(reply_id)
            const numReplies = replyingTo.numReplies + 1
            const updatedComment = new Comment({
                _id: ObjectId(replyingTo.id),
                numReplies: numReplies
            })
            await Comment.findByIdAndUpdate(replyingTo.id, updatedComment, {new: true})
        }

        res.status(201).json(newComment);
    } catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message });
    }
});

router.route('/updateBody/:id').patch(async function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No comment with id: ${id}');
    const updatedComment = new Comment({
        _id: ObjectId(id),
        body: req.body.body,
        edited: true,
        editDate: new Date() });

    const test = new Comment()
    console.log(test)

    console.log(updatedComment)
    await Comment.findByIdAndUpdate(id, updatedComment, { new: true });
    res.json(updatedComment);
})

//route to update comment by id
router.route('/comment/:id').patch( async function (req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No comment with id: ${id}');

    const updatedComment = new Comment({
        _id: ObjectId(id),
        author: ObjectId(req.body.author),
        username: req.body.username,
        body: req.body.body,
        editDate: new Date(),
        upVotes: 0,
        downVotes: 0,
        edited: true,
        post: ObjectId(req.body.post) });

    await Comment.findByIdAndUpdate(id, updatedComment, { new: true });
    res.json(updatedComment);
})

//route to delete a post by id
router.route('/comment/:id').delete(async function (req, res) {
    const { id }  = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No comment with id: ${id}');

    await Comment.findByIdAndDelete(id);

    res.json({ message: "Comment deleted successfully." });
});

router.route('/upvote/:id').post(async function (req, res) {
    const { id } = req.params;
    const user_id = req.body._id

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No comment with id: ${id}');

    const comment = await Comment.findById(id)
    let upVotedBy = comment.upVotedBy
    let upVotes = comment.upVotes
    let upvote = true

    if (upVotedBy.includes(user_id)) {
        upVotedBy = upVotedBy.filter(id => id !== user_id)
        upvote = false
    } else {
        upVotedBy.push(user_id)
        upvote = true
    }

    let downVotedBy = comment.downVotedBy
    let downShift = 0

    if (downVotedBy.includes(user_id)) {
        downVotedBy = downVotedBy.filter(id => id !== user_id)
        downShift = 1
    }

    let updatedComment = {}

    if (upvote) {
        updatedComment = new Comment({
            _id: ObjectId(id),
            upVotedBy: upVotedBy,
            upVotes: (upVotes + 1),
            downVotedBy: downVotedBy,
            downVotes: (comment.downVotes - downShift)});
    } else {
        updatedComment = new Comment({
            _id: ObjectId(id),
            upVotedBy: upVotedBy,
            upVotes: (upVotes - 1),
            downVotedBy: downVotedBy,
            downVotes: (comment.downVotes - downShift)});
    }

    await Comment.findByIdAndUpdate(id, updatedComment, { new: true });
    res.json(updatedComment).status(200);

});

router.route('/downvote/:id').post(async function (req, res) {
    const { id } = req.params;
    const user_id = req.body._id

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No comment with id: ${id}');

    const comment = await Comment.findById(id)
    if (!comment) return res.status(404).send('No comment with id: ${id}');
    console.log(comment)

    let downVotedBy = comment.downVotedBy
    let downVotes = comment.downVotes
    let downvote = true

    if (downVotedBy.includes(user_id)) {
        downVotedBy = downVotedBy.filter(id => id !== user_id)
        downvote = false
    } else {
        downVotedBy.push(user_id)
        downvote = true
    }

    let upVotedBy = comment.upVotedBy
    let upShift = 0

    if (upVotedBy.includes(user_id)) {
        upVotedBy = upVotedBy.filter(id => id !== user_id)
        upShift = 1
    }

    let updatedComment = {}

    if (downvote) {
        updatedComment = new Comment({
            _id: ObjectId(id),
            downVotedBy: downVotedBy,
            downVotes: (downVotes + 1),
            upVotedBy: upVotedBy,
            upVotes: comment.upVotes - upShift});
    } else {
        updatedComment = new Comment({
            _id: ObjectId(id),
            downVotedBy: downVotedBy,
            downVotes: (downVotes - 1),
            upVotedBy: upVotedBy,
            upVotes: comment.upVotes - upShift});
    }

    await Comment.findByIdAndUpdate(id, updatedComment, { new: true });
    res.json(updatedComment).status(200);

});


module.exports = router;