const mongoose = require("mongoose");

const PermissionSchema = mongoose.Schema({
  collectionID: { type: String, required: true, default: false },
  find: { type: Boolean, required: true, default: false },
  findOne: { type: Boolean, required: true, default: false },
  create: { type: Boolean, required: true, default: false },
  delete: { type: Boolean, required: true, default: false },
  update: { type: Boolean, required: true, default: false },
});

const UserRoleSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    permissions: { type: [PermissionSchema] },
  },
  { collection: "userRole" }
);

module.exports = mongoose.model("userRole", UserRoleSchema);
