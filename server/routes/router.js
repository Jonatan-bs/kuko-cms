const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const userRoleCtrl = require("../controllers/userRole");

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

module.exports = router;
