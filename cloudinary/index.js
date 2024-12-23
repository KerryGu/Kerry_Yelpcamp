const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// create a storage place on cloudinary (not on local computer) where all the uploaded files are stored
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Kerry_YelpCamp', // mongosh database 的名字-> store the data into the designated folder ('YelpCamp)
        allowedFormats: ['jpeg', 'png', 'jpg', 'heic']
    }
});

module.exports = {
    cloudinary, 
    storage
}