const mongoose = require("mongoose");

const PermissionSchema = mongoose.Schema({
  collectionNameID: { type: String, required: true, unique: true },
  find: { type: Boolean, required: true, default: false },
  findOne: { type: Boolean, required: true, default: false },
  create: { type: Boolean, required: true, default: false },
  delete: { type: Boolean, required: true, default: false },
  update: { type: Boolean, required: true, default: false },
  _id: false,
});

const UserRoleSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false, default: "" },
    permissions: { type: [PermissionSchema] },
  },
  { collection: "userRole" }
);

mongoose.model("userRole", UserRoleSchema);
