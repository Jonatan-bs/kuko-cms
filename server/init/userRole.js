const mongoose = require("mongoose");
const UserRoleModel = mongoose.models["userRole"];

module.exports = async () => {
  UserRoleModel.find({ name: "Public" })
    .then((response) => response.length)
    .then((exists) => {
      if (exists) return;
      else {
        const newDocument = new UserRoleModel({
          _id: new mongoose.Types.ObjectId(),
          name: "Public",
          description: "Not logged in",
          permissions: [
            {
              collectionNameID: "products",
              find: false,
              findOne: false,
              create: false,
              delete: false,
              update: false,
            },
          ],
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
          permissions: [
            {
              collectionNameID: "products",
              find: true,
              findOne: true,
              create: true,
              delete: true,
              update: true,
            },
          ],
        });
        return newDocument.save();
      }
    })
    .catch((err) => console.log(err));
};
