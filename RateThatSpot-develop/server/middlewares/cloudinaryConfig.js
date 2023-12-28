const multer = require("multer");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const {
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_API_SECRET
} = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

// strip imagetype from file mimetype, return null on non-image files
function convertMimetype(mimetype) {
    const allowedFileTypes = ['image/jpeg', 'image/gif', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(mimetype)) {
        return mimetype.substring(6);
    }
    else return null;
}

// storage function for profile pictures
const profilePicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profilePics",
        format: async(req, file) => { convertMimetype(file.mimetype) },
        public_id: (req, file) => file.filename,
    },
});

// upload image to our cloudinary bucket profilePics folder
const profilePic = multer({ storage: profilePicStorage });

// storage function for facility/amenity images
const facilityStorage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
        folder: "facilityPics",
        format: async(req, file) => { convertMimetype(file.mimetype) },
        public_id: (req, file) => file.filename
    }
})

// upload image to our cloudinary bucket facilityPics folder
const facilityPic = multer({ storage: facilityStorage})

const uploadFile = { 
    profilePic,
    facilityPic
};

module.exports = uploadFile;


/* old storage method to local disk

const multer = require('multer');
let path = require('path');

// currently saving image to local storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '..', 'profilepictures'));
    },
    filename: function(req, file, cb) {   
       cb(null,  `${new Date().toISOString().replace(/:/g, '-')}_${file.originalname}`);
       //cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/gif', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(undefined, true);
    } else {
        cb(null, false);
    }
}
// upload image to our server's local image folder
const uploadFile = multer({ storage, fileFilter });
*/
//uploader.ProfilePic.single('photo'),