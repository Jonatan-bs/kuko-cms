const mongoose = require("mongoose");
const multer = require("multer"); // Handle file uploads
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("./cloudinaryHandler");

///
const Datauri = require("datauri");

///

// MULTER MIDDLEWARE
// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     callback(null, "public/uploads/");
//   },
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   },
// });

// const fileFilter = (req, file, callback) => {
//   if (
//     file.mimetype == "image/jpeg" ||
//     file.mimetype == "image/jpg" ||
//     file.mimetype == "image/png"
//   ) {
//     // Accept file
//     callback(null, true);
//   } else {
//     // reject file
//     callback("Only .png, .jpg and .jpeg format allowed!");
//   }
// };

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
  uploadTempCloudinary: (req, res, next) => {
    const dUri = new Datauri();

    if (!req.file)
      return res.json({
        success: false,
        message: "Only .png, .jpg and .jpeg format allowed!",
      });

    let file = dUri.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;

    cloudinary.uploader.upload(
      file,
      {
        folder: `products/`,
        // categorization: "aws_rek_tagging",
        tags: ["temp"],
        auto_tagging: 0.85,
      }, // directory and tags are optional
      (err, image) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            console.log("mult");
            // A Multer error occurred when uploading.
          }
          console.log("not mult");
          return res.status("500").send({ success: false, message: err });
        }
        console.log("file uploaded to Cloudinary");
        // return image details
        res.status("200").json({ success: true, public_id: image.public_id });
      }
    );
  },
};

module.exports = controller;
