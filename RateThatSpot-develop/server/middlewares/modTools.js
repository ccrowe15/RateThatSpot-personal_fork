const keys = require("../db/keys");
const mongoose = require("mongoose");
const authJwt = require("./authJwt");
const User = mongoose.model("User");

// checks modstatus, returns if valid
verifyModStatus = async(decodedId) => {
    // userId field decoded from the logged-in user's access token
    const userId = decodedId;
    await User.findById(userId).then(user => {
        // Check if user exists
        if (!user) {
            console.log("user not found");
            return res.status(403).json({message: "Unauthorized"})
        }
        // Check if user is moderator
        if (user.isModerator) {
            // if user is not a moderator, return error and end request
            console.log("is a moderator");
            //return true;
        }
        else {
            console.log("error: not mod or undefined");
            return res.status(403).json({message: "Unauthorized"})
        }
    });
};


const modTools = {
    verifyModStatus
  };
module.exports = modTools;