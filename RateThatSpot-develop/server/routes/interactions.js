const express = require('express')
const Interaction = require('../models/interactions')
const mongoose = require("mongoose")

const router = express.Router()

router.route('/interaction').post(async function (req, res) {
    const interaction = new Interaction({
        user: req.body.user,
        post: req.body.post,
        type: req.body.type,
        interactionDate: new Date()
    })
    try {
        await interaction.save();
        res.status(201).json(interaction)
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
})

router.route('/getInteractions/:id').get( async function (req, res) {
    const { id } = req.params;
    try {
        const interactions = await Interaction.find({user: id});
        res.status(200).json(interactions)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

module.exports = router;