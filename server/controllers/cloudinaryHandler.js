const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: "kuko",
  api_key: "992553735474166",
  api_secret: "W26ozdMILzrybdcBjYVi7kt7T3s",
});

// MOVE FILE FROM PUBLIC TO CLOUDINARY AND RETURN PUBLIC ID
// imgData = {originalName:"", path:""}
module.exports = moveFileToCloudinary = (imgData) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imgData.path,
      {
        folder: `products/`,
        categorization: "aws_rek_tagging",
        auto_tagging: 0.85,
      }, // directory and tags are optional
      (err, image) => {
        if (err) {
          return reject({ success: false, message: err });
        }
        console.log("file uploaded to Cloudinary");
        // remove file from server

        fs.unlinkSync(imgData.path);

        // return image details
        return resolve(image);
      }
    );
  });
};
