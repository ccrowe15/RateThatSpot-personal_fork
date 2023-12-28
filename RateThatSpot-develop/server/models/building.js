const mongoose = require('mongoose');

const buildingSchema = mongoose.Schema({
    name: String,
    address: String,
    aggregateRating: Number,
    numFloors: Number,
    buildingCode: String,
    loc: {
        type: {type: String},
        coordinates: []
    },
    },
    {collection: 'Buildings'});

const Building = mongoose.model('Building', buildingSchema);

module.exports = Building;