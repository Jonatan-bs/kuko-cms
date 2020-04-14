const mongoose = require("mongoose");
const multer = require("multer"); // Handle file uploads
const path = require("path");
const fs = require("fs");

// MULTER MIDDLEWARE
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "public/uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  ) {
    // Accept file
    callback(null, true);
  } else {
    // reject file
    callback("Only .png, .jpg and .jpeg format allowed!");
  }
};

controller = {
  uploadTemp: (req, res, next) => {
    const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
      "image"
    );
    upload(req, res, function (err) {
      if (err) {
        return res.send({ success: false, message: err });
      }
      if (req.file) {
        //Remove tempImage after 24 hours
        setTimeout(() => {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        }, 86400000);
        res.send({
          success: true,
          data: {
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
          },
        });
      } else {
        return res.send({ success: false, message: "No image in request" });
      }
    });
  },
  removeTemp: (req, res, next) => {
    try {
      res.status("200").send({ success: true });
    } catch (err) {
      res.status("200").json({ success: false, message: err });
    }
  },
};

module.exports = controller;
