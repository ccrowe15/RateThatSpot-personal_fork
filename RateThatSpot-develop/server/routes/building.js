const express = require('express');
const Building = require('../models/building');
const User = require('../models/user');
const mongoose = require("mongoose");

const router = express.Router();

router.route('/building').get(async function (req, res) {
    try {
        const buildings = await Building.find()
        res.status(200).json(buildings)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.route('/building/:id').get(async function (req, res) {
    const { id } = req.params;
    try {
        const post = await Building.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.route('/building').post(async function (req, res) {
    const { name, address, aggregateRating, numFloors, buildingCode } = req.body;
    const newBuilding = new Building({ name, address, aggregateRating, numFloors, buildingCode});
    try {
        await newBuilding.save();
        res.status(201).json(newBuilding);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

router.route('/building/:id').patch( async function (req, res) {
    const { id } = req.params;
    const { name, address, aggregateRating, numFloors, buildingCode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No building with id: ${id}');

    const updatedBuilding = { name, address, aggregateRating, numFloors, buildingCode, _id: id };

    await Building.findByIdAndUpdate(id, updatedBuilding, { new: true });
    res.json(updatedBuilding);
});

router.route('/building/:id').delete(async function (req, res) {
    const { id }  = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No building with id: ${id}');

    await Building.findByIdAndDelete(id);

    res.json({ message: "Building deleted successfully." });
});

//route for searching buildings by name
router.route('/building/search/:searchName').get(async function (req, res) {
    const { searchName } = req.params;
    const searchRegex = '.*' + searchName + '.*';
    try {
        const post = await Building.find({name: {$regex: searchRegex, $options: 'i'}});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//route for searching buildings by abbreviation
router.route('/building/searchabbr/:searchAbbr').get(async function (req, res) {
    const { searchAbbr } = req.params;
    const searchRegex = '.*' + searchAbbr + '.*';
    try {
        const post = await Building.find({buildingCode: {$regex: searchRegex, $options: 'i'}});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//route to get the favorite buildings of a user
router.get("/getFavoriteBuildings/:username", async(req, res) => {
    const { username } = req.params;
    favoritedBuildings = [];

    // Get the user's list of favorite buildings
    await User.findOne({name: username}, {favoritedBuildings: 1})
    .then(user => {
        favoritedBuildings = user.favoritedBuildings;
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting user in favorite buildings')
    })

    // Get the list of their favorite buildings
    await Building.find({_id: favoritedBuildings})
    .then(buildings => {
        res.status(200).json(buildings)
    })
    .catch(error => {
        console.log(error)
        res.status(404).json('error getting favorited buildings')
    })
})
//route to get a building by its abbreviation
router.route('/building/abbr/:abbr').get(async function (req, res) {
    const { abbr } = req.params;
    try {
        const building = await Building.find({buildingCode: abbr});
        res.status(200).json(building);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

module.exports = router;