const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const dbo = require("../db/conn");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../db/keys");
const validateSignupInput = require("../validation/signup");
const validateLogin = require("../validation/login");
const User = require("../models/user");
const Post = require("../models/posts")
const Comment = require('../models/comment')
const { authJwt, emailer, uploadFile } = require("../middlewares");
const controller = require("../controllers/user.controller");

// profile image upload
router.post("/upload", [authJwt.verifyToken, uploadFile.profilePic.single('file')], async(req, res) => {
  const name = req.body.name;
  const photo = req.file.path;
  // userid from the logged in user's access token
  const userId = req.userId;
  // find user using the given username
  await User.findOne({name: name}).then(user => {
    if (!user) {
      console.log("user not found");
      return res.json('no user found');
    }
    else if (userId !== user.id) {
      // userId mismatch 
      console.log(`id from name: ${user.id} decoded id from token: ${userId}`)
      return res.status(403).send("invalid access");
    }
    else {
      // found user
      user.ProfilePicture = photo;
      user.save().then(user => {
        try {
          // save image path to mongoose database
          console.log('saved photo');
          res.status(200).send({message: 'photo successfully uploaded'});
        }
        catch (error) {
          console.log(error);
          res.send(error);
        }
      });
    }
  })
});

// account registration
router.post("/register", (req, res) => {
    // Check that the params are valid
    const { errors, isValid } = validateSignupInput(req.body);
    // Check if the given text fields are valid
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Check if email is already in use
    User.findOne({email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ name:"", email: "Email is already used by another account!"});
        } else {
          // Check if username is already in use
          User.findOne({name: req.body.name}).then(user => {
            if (user) {
              return res.status(400).json({ name: "Username is already used by another account!", email:""});
            } else {
              const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                privateProfile: false,
                followedUsers: [],
                blockedUsers: [],
                blockedBy: [],
                favoritedPosts: [],
                favoritedBuildings: [],
                favoritedFacilities: [],
                totalUpvotes: 0,
                totalDownvotes: 0,
                averageRating: 0,
                uiSetting: 0,
                isBanned: false
            });
            // generate verification token
            newUser.generateVerification();
            // Hash the password with a salt grain of 10
            newUser
              .save()
              .then(user => { 
                // send email to given email account for account verification
                emailer.sendVerificationEmail(user.email, user.verificationToken);
                res.json(user);
              })
              .catch(err => console.log(err));  
            }
          });
        }
    });
});

// back-end route for verifying a user's account
router.get("/verify/:token", async(req, res, next) => {
  const token = req.params.token;
  // search for user with given token, and verify the token is not expired
  await User.findOne({verificationToken: token})
  .then((user) => {
    if (!user) {
      // user not found or token is expired
      console.log("verification token does not exist");
      return res.json('verification token does not exist');
    } else {
      console.log("valid token");
      // VerificationToken token is valid, update user and send response
      user.isVerified = true;
      user.verificationToken = undefined;
      user.save()
      .then(user => {
        emailer.sendVerificationSuccess(user.email, user.name);
        res.status(200).send({message: 'valid token'});
      })
      .catch(err => res.json('user did not save'));
    }
  });
});


// Function for getting usernames for search features
router.route("/users/usernames").get(async function (req, res) {
    try {
        const usernames = await User.find({}, {name:1, _id:0});
        res.status(200).json(usernames);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

router.route("/users/verifyCredentials").post(async function (req, res) {
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ name: username }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                res.status(200).send({
                    message: "Valid"
                })
            } else {
                //bad password
                return res.status(200).send({
                    message: "Invalid"
                });
            }
        });
    });

})

router.route("/users/:username").get(async function (req, res) {
    const { username } = req.params;
    try {
        const user = await User.find({ name: username });
        const user_id = user[0]._id
        user[0]["password"] = undefined;
        user[0]["email"] = undefined;
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

//routes for /user/login
router.post("/login", async(req, res) => {
    // Form validation
    const { errors, isValid } = validateLogin(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    const username = req.body.username;
    const password = req.body.password;
    // Find user by email
    await User.findOne({ name: username }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      // check if account is verified
      if (user.isVerified != undefined && !user.isVerified) {
        return res.status(401).send({message: "Account is not Verified!"});
      }
      // check if account is banned
      if (user.isBanned != undefined && user.isBanned) {
        console.log(`${user.name} is banned and cannot login`)
        return res.status(401).send({message: "Account is Banned!"});
      }
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Sign token
          var token = jwt.sign({ id: user.id }, keys.secretOrKey, { 
            expiresIn: 604800} // 1 week in seconds
          );
          res.status(200).send({
            id: user.id,
            username: user.name,
            accessToken: token,
            favoritedPosts: user.favoritedPosts,
            favoritedBuildings: user.favoritedBuildings,
            favoritedFacilities: user.favoritedFacilities,
            followedUsers: user.followedUsers,
            privateProfile: user.privateProfile,
            blockedUsers: user.blockedUsers,
            isModerator: user.isModerator,
            uiSetting: user.uiSetting
          })
        } else {
          //bad password
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });;
        }
      });
    });
});

// back-end route for recovering a forgotten password
router.post("/forgotpassword", async(req, res) => {
  const email = req.body.email;
  if (email === '') {
    res.status(400).send('email required');
  }
  // search for user
  await User.findOne({email: email}).then((user) => {
    if (!user) {
      return res.json('email not in db')}
    else {
      // user was found, generate new token
      user.generatePasswordReset();
      // save updated user object
      user.save().then(user => {
        // send email
        try {
          console.log('recovery email sent');
          emailer.sendRecoveryEmail(email, user.resetPasswordToken);
          res.status(200).send({message: 'recovery email sent'});
        }
        catch (error) {
          console.log(error);
        }
      });
    }
  })
});

//route meant for updating user features, including passwords
router.route('/users/:username').patch( async function (req, res) {
    const { username } = req.params;

    const { name, email, password, bio, privateProfile, favoritedPosts, favoritedBuildings, favoritedFacilities, followedUsers, blockedUsers, follow, block, favorite, privateFavorites, flairOption, uiSetting } = req.body;


    try {
        const user = await User.find({ name: username });
        const id = user[0]._id;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with id: ${id}');

        const updatedUser = { name, email, bio, _id: id, password: password, privateProfile, favoritedPosts, favoritedBuildings, favoritedFacilities,
           followedUsers, blockedUsers, follow, block, favorite, privateFavorites, flairOption, uiSetting  };
        
        if (bio) {
            User
              .findByIdAndUpdate(id, updatedUser, {new: true})
              .then(user => res.json(user))
              .catch(err => console.log(err));
            res.status(200)
           }
        
        console.log(privateProfile)
        console.log(privateFavorites)


        if ((privateProfile != null) && (privateFavorites != null)) {
            User
                .findByIdAndUpdate(id, updatedUser, {new: true})
                .then(user => res.json(user))
                .catch(err => console.log(err));
            res.status(200)
        }


        if (favoritedPosts && favorite !== undefined) {
          if (favorite) {
            User
              .findOneAndUpdate({"_id": id},
                {$push: {favoritedPosts: updatedUser.favoritedPosts}
              })
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
          else {
            User
              .findOneAndUpdate({"_id": id}, 
              {$pull: {favoritedPosts: updatedUser.favoritedPosts}})
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
        }

        if (favoritedBuildings && favorite !== undefined) {
          if (favorite) {
            User
              .findOneAndUpdate({"_id": id},
                {$push: {favoritedBuildings: updatedUser.favoritedBuildings}
              })
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
          else {
            User
              .findOneAndUpdate({"_id": id}, 
              {$pull: {favoritedBuildings: updatedUser.favoritedBuildings}})
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
        }

        if (followedUsers && follow !== undefined) {
          if (follow) {
            User
              .findOneAndUpdate({"_id": id},
                {$push: {followedUsers: updatedUser.followedUsers}
              })
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
          else {
            User
              .findOneAndUpdate({"_id": id}, 
              {$pull: {followedUsers: updatedUser.followedUsers}})
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
        }

        if (favoritedFacilities && favorite !== undefined) {
          if (favorite) {
            User
              .findOneAndUpdate({"_id": id},
                {$push: {favoritedFacilities: updatedUser.favoritedFacilities}
              })
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
          else {
            User
              .findOneAndUpdate({"_id": id}, 
              {$pull: {favoritedFacilities: updatedUser.favoritedFacilities}})
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
        }

        if (flairOption) {
            User
                .findByIdAndUpdate(id, updatedUser, {new: true})
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }

        if (uiSetting) {
          User
          .findByIdAndUpdate(id, updatedUser, {new: true})
          .then(user => res.json(user))
          .catch(err => console.log(err));
        }

        /*if (bio) {
            User
                .findByIdAndUpdate(id, updatedUser, {new: true})
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }*/

        if (blockedUsers && block !== undefined) {
          if (block) {
            User
              .findOneAndUpdate({"_id": id},
                {$push: {blockedUsers: updatedUser.blockedUsers}
              })
              .catch(err => console.log(err))

            User
              .findOneAndUpdate({"_id": updatedUser.blockedUsers},
              {$push: {blockedBy: id}
              })
              .catch(err => console.log(err))

            res.status(200).json({message: "user blocked"});
          }
          else {
            User
            .findOneAndUpdate({"_id": id}, 
              {$pull: {blockedUsers: updatedUser.blockedUsers}})
              .catch(err => console.log(err))
            
            User
              .findOneAndUpdate({"_id": updatedUser.blockedUsers}, 
              {$pull: {blockedBy: id}})
              .catch(err => console.log(err))
           
            res.status(200).json({message: "user unblocked"})
          }
        }

        if (password) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(updatedUser.password, salt, (err, hash) =>{
                    if (err) throw err;
                    updatedUser.password = hash;
                    User
                        .findByIdAndUpdate(id, updatedUser, {new: true})
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }

        res.status(200);

    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//find user by id
router.route('/user/:id').get(async function (req, res) {
  const { id } = req.params;
  try {
      const post = await User.findById(id);
      res.status(200).json(post);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

// back-end route for resetting a user's account from an email
router.get("/recover/:token", async(req, res, next) => {
  const token = req.params.token;
  // search for user with given token, and verify the token is not expired
  await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
  .then((user) => {
    if (!user) {
      // user not found or token is expired
      console.log("reset link expired");
      res.json('reset link expired');
    } else {
      console.log("valid token");
      // reset token is still valid, send response
      res.status(200).send({
        username: user.name,
        message: 'valid token'
      })
    }
  });
});

// updated password is posted from front end
router.post("/recover/:token", async(req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // search for user, and verify the token is not expired
  await User.findOne({name: username, resetPasswordExpires: {$gt: Date.now()}})
  .then((user) => {
      if (!user) {
        console.log('no user found');
        res.status(404).json('no user exists in db');
      }
      else {
        console.log('user exists');
        // change password and delete tokens
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // save user information
        user.save().then(user => {
          // send email
          try {
            const email = user.email;
            console.log('password updated');
            emailer.sendPasswordChangeEmail(email);
            res.status(200).send({message: 'password updated'});
          }
          catch (error) {
            console.log(error);
            res.status(403).json('error while saving');
          }
        });
      }
  });
});

router.get("/users/getFollowedUsers/:username", async(req, res, next) => {
  const username = req.params.username;
  try {
    const user = await User.find({name: username}, {followedUsers: 1})
    followedIds = user[0].followedUsers;
    const followedUsers = await User.find({_id: {$in: followedIds}}, {email: 0, password: 0})
    res.status(200).json(followedUsers)
  } 
  catch (error) {
    res.status(404).json({message: error.message})
  }

});

router.get("/users/getBlockedUsers/:username", async(req, res, next) => {
  const username = req.params.username;
  try {
    const user = await User.find({name: username}, {blockedUsers: 1})
    blockedIds = user[0].blockedUsers;
    const blockedUsers = await User.find({_id: {$in: blockedIds}}, {email: 0, password: 0})
    res.status(200).json(blockedUsers)
  } 
  catch (error) {
    res.status(404).json({message: error.message})
  }

});

// Route for searching users by an abbriviation 
router.get("/users/searchUsers/:term", async(req, res, next) => {
  const searchAbbr = req.params.term;
  const searchRegex = ".*" + searchAbbr + ".*";

  try {
    const post = await User.find({name: {$regex: searchRegex, $options: 'i'}}, {email: 0, password: 0});
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({message: error.message})
  }

})



router.route("/users/getFollowers/:uid").get(async function (req, res) {
  const { uid }  = req.params;
  console.log("getting followers for " + uid)
  try {
    const followers = await User.find({followedUsers: {$elemMatch: {$eq: uid}}}).select("_id");
    res.status(200).json(followers);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
})

router.route("/users/mayNotify/:uid").get(async function (req, res) {
  const {uid} = req.params;
  try {
    const notify = await User.find({_id: mongoose.Types.ObjectId(uid)}, {mayNotify: 1, _id: 0})
    res.status(200).json(notify);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
})

router.route("/users/mayNotify/:username").patch(async function (req, res){
  const {username} = req.params;
  console.log("body:")
  console.log(req.body);
  const mn = req.body.mayNotify;
  await User.findOneAndUpdate({name: username}, {mayNotify: mn});
  res.json({mayNotify: mn});
})

router.route("/users/mayNotifyUsername/:username").get(async function (req, res) {
  const {username} = req.params;
  try {
    const notify = await User.find({name: username}, {mayNotify: 1, _id: 0})
    res.status(200).json(notify);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
})

router.route("/users/getUsername/:uid").get(async function (req, res) {
  const {uid} = req.params;
  console.log("getting username for " + uid);
  try {
    const username = await User.find({_id: mongoose.Types.ObjectId(uid)}, {name: 1, _id: 0})
    res.status(200).json(username);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
})

router.delete("/users/:username", [authJwt.verifyToken], async function (req, res) {
  const {username} = req.params;
  const userId = req.userId;
  try {
    const response1 = await Post.updateMany({username: username},
      {$set: {username: "[deleted]"}})
    console.log(response1)
    const response2 = await Comment.updateMany({username: username},
      {$set: {username: "[deleted]"}})
    console.log(response2)
    const response3 = await User.findByIdAndRemove(userId)
    res.status(200).json(response3);
    
  }
  catch {
    res.status(404).json({message: error.message});
  }
})

// public routes for testing if you are logged in :)
router.get("/test/all", controller.allAccess);
// user routes for testing if you are logged in :)
router.get("/test/user", [authJwt.verifyToken], controller.userBoard);

router.route("/users/updateTimeLimit/:username").patch( async function (req, res) {
  const { username } = req.params;

  const {lastPost, lastComment} = req.body;
    
  try {
    
    if (lastPost) {
      await User.findOneAndUpdate({name: username}, {$currentDate: {lastPostTime: true}}, {new: true})
      res.status(200).json({message: "Time of last post updated"})
    }

    if (lastComment){
      await User.findOneAndUpdate({name: username}, {$currentDate: {lastCommentTime: true}}, {new: true})
      res.status(200).json({message: "Time of last comment updated"})
    }
  } 
  catch (error) {
    res.status(404).json({message: error.message});
  }
})

router.route("/amenityRequest/:username").patch( async function (req, res) {
    const {username} = req.params;

    console.log('test')
    const user = await User.find({name: username});
    const id = user[0]._id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with id: ${id}');
    console.log(user)

    let requests = user[0].dailyRequests
    console.log(requests)
    var currentDate = new Date()
    var lastDate = user[0].lastRequestDate
    if (requests === undefined) {
        requests = 1
        const updatedUser = { _id: id, dailyRequests: requests, lastRequestDate: currentDate };
        User
            .findByIdAndUpdate(id, updatedUser, {new: true})
            .catch(err => console.log(err));
        res.status(200).json(updatedUser)
        return;

    }
    if (requests >= 3) {
        if (currentDate.getDate() === lastDate.getDate()) {
            console.log('here')
            res.status(200).json({message: "error"});
            return;
        }
    }

    requests += 1
    const updatedUser = { _id: id, dailyRequests: requests, lastRequestDate: currentDate };
    User
        .findByIdAndUpdate(id, updatedUser, {new: true})
        .catch(err => console.log(err));
    res.status(200).json(updatedUser)


})

module.exports = router;
