const express = require("express");
// const multer = require("multer"); // Handle file uploads
const router = express.Router();
const userCtrl = require("../controllers/user");
const userRoleCtrl = require("../controllers/userRole");
const productCtrl = require("../controllers/product");
const imageCtrl = require("../controllers/image");

/////////////////
//// USERS
/////////////////

// USER
router.post("/user/register", userCtrl.register);
router.get("/user", userCtrl.retrieve);
router.post("/user/login", userCtrl.login);
router.post("/user/logout", userCtrl.logout);
router.get("/user/auth", userCtrl.auth);

/////////////////
//// USER ROLES
/////////////////

// retrieve user userroles
router.post("/userrole", userRoleCtrl.retrieve);

// retrieve one user collection
router.get("/userrole/:id", productCtrl.retrieveOne);

// create user userrole
router.post("/userrole/create", userRoleCtrl.create);

// delete userrole
router.post("/userrole/delete/:id", userRoleCtrl.delete);

// update userroles
router.post("/userrole/update/:id", userRoleCtrl.update);

/////////////////
//// IMAGES
/////////////////

// Add temp image to local folder
router.post("/tempimage", imageCtrl.uploadTemp);

// Remove temp image from local folder
router.post("/tempimage/remove", imageCtrl.removeTemp);

/////////////////
//// Products
/////////////////

// retrieve user collection
router.get("/product", productCtrl.retrieve);

// retrieve one user collection
router.get("/product/:id", productCtrl.retrieveOne);

// create Document
router.post("/product", productCtrl.create);

// delete Document
router.post("/product/delete/:id", productCtrl.delete);

// update Document
router.post("/product/update/:id", productCtrl.update);

module.exports = router;
