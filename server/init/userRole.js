const mongoose = require("mongoose");
const UserRoleModel = mongoose.models["userRole"];

module.exports = () => {
  UserRoleModel.find({ name: "Public" })
    .then((response) => response.length)
    .then((exists) => {
      if (exists) return;
      else {
        const newDocument = new UserRoleModel({
          _id: new mongoose.Types.ObjectId(),
          name: "Public",
          description: "Not logged in",
        });
        return newDocument.save();
      }
    })
    .catch((err) => console.log(err));

  UserRoleModel.find({ name: "Admin" })
    .then((response) => response.length)
    .then((exists) => {
      if (exists) return;
      else {
        const newDocument = new UserRoleModel({
          _id: new mongoose.Types.ObjectId(),
          name: "Admin",
          description: "Administrator",
        });
        return newDocument.save();
      }
    })
    .catch((err) => console.log(err));
};
