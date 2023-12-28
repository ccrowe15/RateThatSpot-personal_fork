const mongoose = require('mongoose');

const facilitySchema = mongoose.Schema({
    type: String,
    description: String,
    aggregateRating: Number,
    floor: Number,
    building: String,
    picture: String },
    {collection: 'Facilities'});

const Facility = mongoose.model('Facility', facilitySchema);

module.exports = Facility;