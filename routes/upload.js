const router = require("express").Router();
const cloudinary = require("cloudinary");
const fs = require("fs");
const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");
const CLOUD_NAME = "dcwjm82bj";
const CLOUD_API_KEY = "155991439334254";
const CLOUD_API_SECRET = "STnYYCKoEeVVYoYQrnvChdD8IFs";
// we will upload image on cloudinary

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

//upload image only admin can use
router.post("/upload", auth,authAdmin,(req, res) => {
  try {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No files were uploaded." });

    const file = req.files.file;
    console.log("file is " , file)
    if (file.size > 1024 * 1024) {
      // if file size > 1mb
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large" });
    }
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File format is incorrect" });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "test" },
      async (err, result) => {
        if (err) throw err;
        //  after upload, will have file tmp
        removeTmp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// delete image only admin can use

router.post("/destroy",auth,authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ msg: "No images selected" });
    }
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Image Deleted Successfully" });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
