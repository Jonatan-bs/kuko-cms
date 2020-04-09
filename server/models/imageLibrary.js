const mongoose = require("mongoose");

const imgLibrarySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false, default: "" },
    alt: { type: String, required: false, default: "" },
    caption: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    destination: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { collection: "imgLibrary", timestamps: true }
);

module.exports = mongoose.model("imgLibrary", imgLibrarySchema);
