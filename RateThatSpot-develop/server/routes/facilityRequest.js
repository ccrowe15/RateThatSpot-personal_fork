const express = require('express');
const mongoose = require("mongoose");
const Facility = require('../models/facility');
const FacilityRequest = require('../models/facilityRequest');
const { ObjectId } = require('mongodb');
const { uploadFile, authJwt, modTools } = require('../middlewares');
const router = express.Router();

//list all facility requests
// mod only access
router.route('/facilityRequests').get([authJwt.verifyToken], async function(req, res) {
    try {
        modTools.verifyModStatus(req.userId);
        const requests = await FacilityRequest.find();
        return res.status(200).json(requests);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});

//get a specific request
// mod only access
router.route('/facilityRequests/:id').get([authJwt.verifyToken], async function(req, res) {
    const { id } = req.params;
    try {
        modTools.verifyModStatus(req.userId);
        const requests = await FacilityRequest.findById(id);
        return res.status(200).json(requests)
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});

//create a new request
router.route('/facilityRequests').post([authJwt.verifyToken, uploadFile.facilityPic.single('file')], async function(req, res) {
    try {
        // path to our amenity photo on cloudinary
        const photo = req.file.path;
        // parsed request from the front-end
        const document = JSON.parse(req.body.document);
        //console.log(document);
        // define new facility request
        const newRequest = new FacilityRequest({
            type: document.type,
            description: document.description,
            aggregateRating: 0,
            floor: document.floor,
            building: document.building,
            author: ObjectId(document.author),
            username: document.username,
            requestDate: new Date(),
            approved: false,
            picture: photo
        });
        // attempt to save new facility request
        newRequest.save().then(newReq => {
          console.log("facility request successfully created");
          console.log(newReq);
          return res.status(200).json({message: 'facility request created'});
        })
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});

//route to approve of a new facility
// mod only access
router.route('/approveRequest/:id').post([authJwt.verifyToken], async function(req, res) {
    const {id} = req.params;
    try {
        modTools.verifyModStatus(req.userId);
        const request = await FacilityRequest.findById(id);
        const newFacility = new Facility({
            type: request.type,
            description: request.description,
            aggregateRating: 0,
            floor: request.floor,
            building: request.building,
            picture: request.picture
        })
        await newFacility.save();
        return res.status(200).json(newFacility)
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});

//route to delete a facility request
// mod only access
router.route('/facilityRequests/:id').delete([authJwt.verifyToken], async function(req, res) {
    const { id } = req.params;
    modTools.verifyModStatus(req.userId);
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No facility request with id: ${id}');

    await FacilityRequest.findByIdAndDelete(id);

    return res.json({ message: "Facility Request deleted successfully." });
});

module.exports = router;