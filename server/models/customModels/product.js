const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    description: { type: String, required: false, default: "" },
    featureImage: { type: String, required: true, ref: "imgLibrary" },
    images: {
      type: [{ type: String, required: true, ref: "imgLibrary" }],
      required: false,
    },
    price: { type: Number, required: true, default: 0 },
  },
  { collection: "product", timestamps: true }
);
ProductSchema.virtual("collectionInfo").get({
  name: "Products",
  description: "Products",
  dbName: "product",
  fields: [
    {
      name: "Title",
      nameID: "title",
      required: true,
      type: "string",
    },
    {
      name: "Description",
      nameID: "description",
      required: false,
      type: "text",
    },
    {
      name: "Feature Image",
      nameID: "featureImage",
      multi: false,
      required: false,
      type: "image",
    },
    {
      name: "Images",
      nameID: "images",
      multi: true,
      required: false,
      type: "image",
    },
    {
      name: "Price",
      nameID: "price",
      required: false,
      type: "number",
    },
  ],
});

mongoose.model("product", ProductSchema);
