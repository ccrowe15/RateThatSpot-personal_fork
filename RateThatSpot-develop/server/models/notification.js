const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    sent: Date,
},
{collection: "Notifications"});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;