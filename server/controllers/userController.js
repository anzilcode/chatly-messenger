const User = require("../models/Auth");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require('dotenv').config()


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const updateData = { bio };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });

      updateData.avatar = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { updateProfile };
