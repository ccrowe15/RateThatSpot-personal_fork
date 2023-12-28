const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../db/keys");
const { authJwt, modTools } = require("../middlewares");

// verify log-in token, then verify given user is moderator
router.get("/verifyModStatus", [authJwt.verifyToken], async(req, res) => {
    // userId field decoded from the logged-in user's access token
    const userId = req.userId;

    User.findById(userId).then(user => {
        // Check if user exists
        if (!user) {
            console.log("user not found");
            return res.status(404).send({ message: "User Not found." });
        }
        // Check if user is moderator
        if (user.isModerator) {
            console.log(`${user.name} is a moderator`);
            res.status(200).send({
                username: user.name,
                message: 'is a moderator'
            })
        }
        else {
            console.log("error: not mod or undefined");
            res.json("user is not a moderator");
        }
    });
});

// ban a given user
router.post("/banUser/:username", [authJwt.verifyToken], async(req, res) => {
    // verify mod status of the person who created the ban request
    await modTools.verifyModStatus(req.userId);
    // get username from request
    const { username } = req.params;
    // find user to ban by username
    await User.findOne({ name: username }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        //Ban User
        user.createBan();
        user.save().then(user => {
            return res.status(200).send({ message: `${user.name} was banned`});
        }).catch(err => {
            console.log(err);
            return res.status(404).send({ message: "Error!"});
        })
    })
});

router.post("/unBanUser/:username", [authJwt.verifyToken], async(req, res) => {
    // verify mod status of the person who created the ban request
    await modTools.verifyModStatus(req.userId);
    // get username from request
    const { username }= req.params;
    // find user to ban by username
    await User.findOne({ name: username }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        //Ban User
        user.removeBan();
        user.save().then(user => {
            return res.status(200).send({ message: `${user.name} was unbanned`});
        }).catch(err => {
            console.log(err);
            return res.status(401).send({ message: "Error!"});
        })
    })
});

// list of all banned users
router.get("/listBanned", [authJwt.verifyToken], async(req, res) => {
    // verify mod status of the person who created the ban request
    await modTools.verifyModStatus(req.userId);
    await User.find({ isBanned: true }).then((users) => {
        if (!users) {
            // not connected to db or no one is banned, return error
            console.log("no one is banned");
            return res.status(404).send({message: "no one is banned"});
          } else {
            // banned users are found, send to front-end
            res.status(200).json(users);
          }
    })
});

module.exports = router;