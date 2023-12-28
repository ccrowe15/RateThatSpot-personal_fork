const mongoose = require('mongoose');

const facilityRequestSchema = mongoose.Schema(
    {
    type: String,
    description: String,
    aggregateRating: Number,
    floor: Number,
    building: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    username: String,
    requestDate: Date,
    approved: Boolean,
    picture: String,
    },
    {collection: 'FacilityRequests'});

const FacilityRequest = mongoose.model('FacilityRequest', facilityRequestSchema);

module.exports = FacilityRequest;