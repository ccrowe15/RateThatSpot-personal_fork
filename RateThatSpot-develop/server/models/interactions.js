const mongoose = require('mongoose');

const interactionSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
        type: String,
        interactionDate: Date
    },
    {collection: 'Interactions'});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;