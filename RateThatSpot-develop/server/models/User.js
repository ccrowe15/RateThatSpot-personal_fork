const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bcrypt = require("bcryptjs");

const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isModerator: {
        type: Boolean,
        required: false
    },
    isBanned: {
        type: Boolean,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    },
    verificationToken: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        required: false
    },
    //TODO: learn where to submit image links instead of localstorage
    ProfilePicture: {
        type: String,
        required: false
    },

    followedUsers: {
        type: [String],
        default: [],
        required: false
    },

    blockedUsers: {
        type: [String],
        default: [],
        required: false
    },

    blockedBy: {
        type: [String],
        default: [],
        required: false
    },
    
    privateProfile: {
        type: Boolean,
        required: false
    },

    privateFavorites: {
        type: Boolean,
        required: false
    },

    totalUpvotes: {
        type: Number,
        required: false
    },

    totalDownvotes: {
        type: Number,
        required: false
    },

    favoritedPosts: {
        type: [String],
        default: [],
        required: false
    },

    favoritedBuildings: {
        type: [String],
        default: [],
        required: false
    },

    favoritedFacilities: {
        type: [String],
        default: [],
        required: false
    },

    averageRating: {
        type: Number,
        required: false
    },

    flairOption: {
        type: String,
        required: false
    },

    mayNotify: {
        type: Boolean,
        required: false
    },
    uiSetting: {
        type: String,
        required: false
    },
    lastPostTime: {
        type: Date,
        required: false
    },

    lastCommentTime: {
        type: Date,
        required: false
    },

    dailyRequests: {
        type: Number,
        required: false
    },

    lastRequestDate: {
        type: Date,
        required: false
    }

    /* not needed for sprint 1(?)
    TotalUpvotes: {
        type: Int32,
        required: false
    },
    TotalDownvotes: {
        type: Int32,
        required: false
    },
    Score: {
        type: Int32,
        required: false
    },
    AggregateRating: {
        type: Int32,
        required: false
    },
    PrivateProfile: {
        type: Boolean,
        required: false
    },
    Flair: {
        type: image?,
        required: false
    },
    FollowNotify: {
        type: Boolean,
        required: false
    },
    PrivateFollow: {
        type: Boolean,
        required: false
    }
    */
}, {timestamps: true});

// on any password edit, always encrypt it before saving to database
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const hash = await bcrypt.hash(this.password, Number(process.env.BCRYPTSALT));
    this.password = hash;
    return next();
  });

// creates token for user password recovery
UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 360000; //expires in an hour
};

// creates token for creating new account
UserSchema.methods.generateVerification = function() {
    this.verificationToken = crypto.randomBytes(20).toString('hex');
    this.isVerified = false;
};

// bans the given user
UserSchema.methods.createBan = function() {
    this.isBanned = true;
}
// removes ban from the current user
UserSchema.methods.removeBan = function() {
    this.isBanned = false;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;

