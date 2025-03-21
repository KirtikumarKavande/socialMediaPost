const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'posts'
    });
    
    await unlinkFile(file.path);
    
    return {
      url: result.secure_url,
      id: result.public_id
    };
  } catch (error) {
    try {
      await unlinkFile(file.path);
    } catch (unlinkError) {
      console.error(`Failed to delete local file: ${unlinkError.message}`);
    }
    
    throw new Error(`Error uploading image: ${error.message}`);
  }
};
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
  deleteImage
};