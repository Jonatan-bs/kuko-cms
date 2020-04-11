const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, default: "" },
    shortDescription: { type: String, default: "" },
    thumbnail: [
      {
        caption: { type: String, default: "" },
        imageID: { type: String, required: true, ref: "imgLibrary" },
        _id: false,
      },
    ],

    variants: {
      type: [
        {
          quantity: { type: Number, default: 0 },
          variantType: { type: String, default: "" },
          variantValue: { type: String, default: "" },
          images: {
            type: [
              {
                caption: { type: String, default: "" },
                imageID: { type: String, required: true, ref: "imgLibrary" },
                _id: false,
              },
            ],
            required: false,
          },
          price: { type: Number, default: 0 },
          priceCompare: { type: Number, required: false },
          weight: { type: Number, required: true, default: 0 },
        },
      ],
    },
  },
  { collection: "product", timestamps: true }
);

mongoose.model("product", ProductSchema);
