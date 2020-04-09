const express = require("express");
const multer = require("multer"); // Handle file uploads
const router = express.Router();
const userCtrl = require("../controllers/user");
const userRoleCtrl = require("../controllers/userRole");
const imageLibraryCtrl = require("../controllers/imageLibrary");

// MULTER MIDDLEWARE
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "public/uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    // Accept file
    callback(null, true);
  } else {
    // reject file
    callback(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter }); // Handle file uploads

/////////////////
//// USERS
/////////////////

// USER
router.post("/user/register", userCtrl.register);
router.get("/user", userCtrl.retrieve);
router.post("/user/login", userCtrl.login);
router.post("/user/logout", userCtrl.logout);
router.post("/user/auth", userCtrl.auth);

/////////////////
//// USER ROLES
/////////////////

// retrieve user userroles
router.post("/userrole", userRoleCtrl.retrieve);

// create user userrole
router.post("/userrole/create", userRoleCtrl.create);

// delete userrole
router.post("/userrole/delete/:id", userRoleCtrl.delete);

// update userroles
router.post("/userrole/update/:id", userRoleCtrl.update);

/////////////////
//// IMAGE LIBRARY
/////////////////

// create image
router.post(
  "/imageLibrary/create",
  upload.single("image"),
  imageLibraryCtrl.create
);

// update image
router.post("/imageLibrary/update/:id", imageLibraryCtrl.update);

// retrieve images
router.post("/imageLibrary", imageLibraryCtrl.retrieve);

module.exports = router;
