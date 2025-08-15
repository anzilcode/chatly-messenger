const express = require("express");
const router = express.Router();
const multer = require("multer");
const { updateProfile, } = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


userRoute = router.put("/updateProfile/:id", upload.single("avatar"), updateProfile);

module.exports = userRoute;
