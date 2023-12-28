const express = require('express');
const Notification = require('../models/notification');
const mongoose = require('mongoose');

const router = express.Router();


router.route('/notifications/:user').get(async function (req, res) {
    const {user} = req.params;
    //console.log("Getting notifications for " + user);
    try {
        const notifications = await Notification.find({ recipient: user });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.route('/notifications/:user').post(async function (req, res) {
    const {user} = req.params;
    const newNotification = new Notification({
        title: req.body.title,
        body: req.body.body,
        sent: new Date(),
        recipient: user
    });
    console.log("Creating notification:");
    console.log(newNotification);
    try {
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

router.route('/notifications/:id').delete(async function (req, res) {
    const { id }  = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No notification with id: ${id}');

    await Notification.findByIdAndDelete(id);

    res.json({ message: "Notification deleted successfully." });
});


module.exports = router;