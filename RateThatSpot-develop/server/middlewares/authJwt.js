const jwt = require("jsonwebtoken");
const keys = require("../db/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

// decode log-in token to get the user's ID
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      // decoded userId
      req.userId = decoded.id;
      next();
    });
  };

const authJwt = {
    verifyToken
  };
module.exports = authJwt;