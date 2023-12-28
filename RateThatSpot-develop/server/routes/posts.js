const express = require('express');
const mongoose = require("mongoose");
const Post = require('../models/posts');
const Facility = require('../models/facility');
const Building = require('../models/building');
const User = require('../models/user');
const { replaceOne } = require('../models/posts');
const { ObjectId } = require('mongodb');


const router = express.Router();

//route to get posts
router.route('/posts').get(async function (req, res) {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//route to find post by id
router.route('/posts/:id').get(async function (req, res) {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.route('/postsByUsername/:username').get(async function (req, res) {
    const { username } = req.params;
    try {
        const user = await User.find({name: username });
        const user_id = user[0]._id
        const posts = await Post.find({ author: user_id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//route to create new post
router.route('/posts').post(async function (req, res) {

    const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        author: ObjectId(req.body.author),
        username: req.body.username,
        rating: req.body.rating,
        postDate: new Date(),
        editDate: new Date(),
        upVotes: 0,
        downVotes: 0,
        totalVotes: 0,
        edited: false,
        amenity: ObjectId(req.body.amenity) });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

//route to update post by id
router.route('/posts/:id').patch( async function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with id: ${id}');

    const updatedPost = {title: req.body.title, body: req.body.body, rating: req.body.rating, editDate: new Date(), edited: true };

    await Post.findByIdAndUpdate(id, updatedPost, { new: true });
    res.json(updatedPost);
});

//route to delete a post by id
router.route('/posts/:id').delete(async function (req, res) {
    const { id }  = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with id: ${id}');

    await Post.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully." });
});


// Get followed users posts
router.get("/getTimelinePosts/:username", async(req, res) => {
    const { username } = req.params;
    followedUsers = [];
    await User.findOne({name: username}, {followedUsers: 1})
    .then(user => {
        followedUsers = user.followedUsers
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting user intimeline posts')
    })
    
    // Get user posts
    await Post.find({author: followedUsers})
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting timeline posts')
    })
});

router.get("/getFavoritePosts/:username", async(req, res) => {
    const { username } = req.params;
    favoritedPosts = [];
    // Get the user's list of favorite posts
    await User.findOne({name: username}, {favoritedPosts: 1})
    .then(user => {
        favoritedPosts = user.favoritedPosts;
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting user in favorite posts')
    })

    // Get the list of their favorite posts
    await Post.find({_id: favoritedPosts})
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting favorited posts')
    })
})


//route to upvote post
router.route('/postUpvote/:id').patch( async function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with id: ${id}');

    await Post.findByIdAndUpdate(id, { $inc: { "upVotes": 1, "totalVotes": 1 } }, { new: true });
    res.json({ message: "Post Upvoted" });
});

//route to downvote post
router.route('/postDownvote/:id').patch( async function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with id: ${id}');

    await Post.findByIdAndUpdate(id, { $inc: { "downVotes": 1, "totalVotes": -1 } }, { new: true });
    res.json({ message: "Post Downvoted" });
});

router.route('/posts/amenity/:id').get( async function (req, res) {
    const id = req.params;
    //console.log(id);
    try {
        const posts = await Post.find({amenity: mongoose.Types.ObjectId(id)}).sort({postDate: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

//filter review of amenity by most recent - oldest
router.route('/postRecOld/:id').get(async function (req, res) {
    const { id } = req.params;

    try {
        const posts = await Post.find({amenity: ObjectId(id)}).sort({postDate: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

//filter review of amenity by most oldest - recent
router.route('/postOldRec/:id').get(async function (req, res) {
    const { id } = req.params;

    try {
        const posts = await Post.find({amenity: ObjectId(id)}).sort({postDate: 1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

//filter review of amenity by specific rating
router.route('/specificRating/:id/:rating').get(async function (req, res) {
    const { id, rating } = req.params;

    try {
        const posts = await Post.find({amenity: ObjectId(id), rating: rating});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

//filter reviews of amenity by highest to lowest rated
router.route('/ratingHighLow/:id').get(async function (req, res) {
    const { id } = req.params;

    try {
        const posts = await Post.find({amenity: ObjectId(id)}).sort({rating: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//filter reviews of amenity by lowest to highest rated
router.route('/ratingLowHigh/:id').get(async function (req, res) {
    const { id } = req.params;

    try {
        const posts = await Post.find({amenity: ObjectId(id)}).sort({rating: 1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//route for when upvote was selected but the user swaps to a downvote
router.route('/upThenDown/:id').patch( async function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with id: ${id}');

    await Post.findByIdAndUpdate(id, { $inc: { "upVotes": -1, "totalVotes": -1 } }, { new: true });
    res.json({ message: "Post Upvoted" });
});

//route for when downvote was selected but the user swaps to a upvote
router.route('/downThenUp/:id').patch( async function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with id: ${id}');

    await Post.findByIdAndUpdate(id, { $inc: { "downVotes": -1, "totalVotes": 1 } }, { new: true });
    res.json({ message: "Post Upvoted" });
});

//route to update the aggregate rating of a facility once a post is created 
//id here is the ID of the facility that the review was created for 
router.route('/post/setFacilityAgg/:id').patch( async function (req, res) {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No amenity with id: ${id}');

    try {
        const posts = await Post.find({amenity: ObjectId(id)});
        var count = 0;
        var total = 0;
        for (var i = 0; i < posts.length; i++) {
            count++;
            total += posts[i].rating;
        }
        
        var agg;
        if (posts.length <= 0) {
            agg = "No Ratings"
        } else {
            agg = (total/count).toFixed(2);
        }
        
        const result = {aggregateRating: agg};
        await Facility.findByIdAndUpdate(id, result, {new: true});
        res.json({ message: "Facility Aggregate Rating Updated" });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//route to update the aggregate rating of a building once a post is created
//id here is the ID of the facility that the review was created for
router.route('/post/setBuildingAgg/:id').patch( async function (req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No amenity with id: ${id}');

    try {
        const amenity = await Facility.findById(id)
        var buildCode = amenity.building;
        //const building = await Building.find({buildingCode: buildCode});
        const facilities = await Facility.find({building: buildCode});

        var count = 0;
        var total = 0;
        for (var i = 0; i < facilities.length; i++) {
            count++;
            total += facilities[i].aggregateRating;
        }
        var agg;
        if (facilities.length <= 0){
            agg = "No Ratings"
        } else {
            agg = (total/count).toFixed(2);
        }
    
        const result = {aggregateRating: agg};
        await Building.findOneAndUpdate({buildingCode: buildCode}, result, {new: true});
        //res.status(200).json(building);
        res.json({ message: "Building Aggregate Rating Updated" });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



module.exports = router;