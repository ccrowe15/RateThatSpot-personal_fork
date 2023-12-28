const { ObjectID } = require('bson');
const e = require('express');
const express = require('express');
const mongoose = require("mongoose");
const Facility = require('../models/facility');
const Post = require('../models/posts');
const User = require('../models/user');
const ObjectId = require('mongodb').ObjectID;

const router = express.Router();

//list of all facilities
router.route('/facilities').get(async function (req, res) {
    try {
        const facilities = await Facility.find();
        res.status(200).json(facilities)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//specific facility
router.route('/facilities/:id').get(async function (req, res) {
    const { id } = req.params;
    try {
        const facilities = await Facility.findById(id);
        res.status(200).json(facilities)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//facilities in specific building (search by abbreviation for now)
router.route('/facilities/bldgabbr/:buildingabbr').get(async function (req, res) {
    const { buildingabbr } = req.params;
    try {
        const facilities = await Facility.find({building: buildingabbr});
        res.status(200).json(facilities)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.route('/facilities').post(async function (req, res) {
    const {type, description, building, floor, aggregateRating} = req.body;
    const newFacility = new Facility({type, description, building, floor, aggregateRating});
    try {
        await newFacility.save();
        res.status(201).json(newFacility);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

router.route('/facilities/:id').patch( async function (req, res) {
    const { id } = req.params;
    const { type, description, building, floor, aggregateRating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No facility with id: ${id}');

    const updatedFacility = { type, description, building, floor, aggregateRating, _id: id };

    await Facility.findByIdAndUpdate(id, updatedFacility, { new: true });
    res.json(updatedFacility);
});

router.route('/facilities/:id').delete(async function (req, res) {
    const { id }  = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No facility with id: ${id}');

    await Facility.findByIdAndDelete(id);

    res.json({ message: "Facility deleted successfully." });
});

//route for searching facilities by partial abbreviation
router.route('/facilities/search/:searchAbbr').get(async function (req, res) {
    const { searchAbbr } = req.params;
    const searchRegex = '.*' + searchAbbr + '.*';
    try {
        const post = await Facility.find({building: {$regex: searchRegex, $options: 'i'}});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


router.route('/facilities/getrating/:id').get(async function (req, res) {
    const { id } = req.params;
    console.log(id);
    try {
        const posts = await Post.find({amenity: mongoose.Types.ObjectId(id)});
        console.log(posts);
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
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        //returns an avg rating of 0 if no reviews
        res.status(404).json({message: error.message});
    }
});

router.route('/facilities/type/:typename').get(async function (req, res) {
    const {typename} = req.params;
    //console.log(typename);
    try {
        const facilities = await Facility.find({type: typename});
        res.status(200).json(facilities);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.route('/facilities/byrating/:bldg').get(async function (req, res) {
    const {bldg} = req.params;
    try {
        const facilities = await Facility.find({building: bldg}).sort('-aggregateRating');
        res.status(200).json(facilities);
    }catch (error) {
        res.status(404).json({message: error.message});
    }
});

//route to filter amenities by floor of a particular building
router.route('/facilities/bldgabbr/:buildingabbr/:floor').get(async function (req, res) {
    const { buildingabbr, floor } = req.params;

    try {
        const facilities = await Facility.find({building: buildingabbr, floor: floor});
        res.status(200).json(facilities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}); 

// top amenities for the homepage grid
router.get("/topAmenities", async(req, res, next) => {

    // only grab top 6 facilities
    // we should also have # of reviews as a field to have more relevant ratings
    await Facility.find().sort({aggregateRating: -1}).limit(6)
    .then((facilities) => {
      if (!facilities) {
        // not connected to db, return error
        console.log("facilities not found, db not connected");
        return res.json('cannot connect to database to get facilities');
      } else {
        // facilities are found, send to front-end
        res.status(200).json(facilities);
      }
    });
});

//filter amenities of a specific building by highest to lowest rated
router.route('/amenityHighLow/:buildingabbr').get(async function (req, res) {
    const { buildingabbr} = req.params;

    try {
        const facilities = await Facility.find({building: buildingabbr}).sort({aggregateRating: -1});
        res.status(200).json(facilities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}); 

//filter amenities of a specific building by lowest to highest rated
router.route('/amenityLowHigh/:buildingabbr').get(async function (req, res) {
    const { buildingabbr} = req.params;

    try {
        const facilities = await Facility.find({building: buildingabbr}).sort({aggregateRating: 1});
        res.status(200).json(facilities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}); 

//filter all amenities by highest to lowest rated
router.route('/amenityHighLow').get(async function (req, res) {
    try {
        const facilities = await Facility.find().sort({aggregateRating: -1});
        res.status(200).json(facilities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}); 

//filter all amenities by lowest to highest rated
router.route('/amenityLowHigh').get(async function (req, res) {
    try {
        const facilities = await Facility.find().sort({aggregateRating: 1});
        res.status(200).json(facilities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}); 

router.route('/getFavoriteFacilities/:username').get(async function(req, res) {
    const { username } = req.params;
    favoritedFacilities = [];

    // Get the user's list of favorite buildings
    await User.findOne({name: username}, {favoritedFacilities: 1})
    .then(user => {
        favoritedFacilities = user.favoritedFacilities;
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting user in favorite facilities')
    })

    // Get the list of their favorite buildings
    await Facility.find({_id: favoritedFacilities})
    .then(facilities => {
        res.status(200).json(facilities)
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting favorited facilities')
    })
});

module.exports = router;