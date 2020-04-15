const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, default: "" },
    shortDescription: { type: String, required: true, default: "" },
    thumbnail: {
      type: {
        public_id: { type: String, required: false },
        name: { type: String, required: false },
      },
      required: false,
    },
    variants: {
      type: [
        {
          quantity: { type: Number, default: 0 },
          variantType: { type: String, default: "" },
          variantValue: { type: String, default: "" },
          images: {
            type: [
              {
                public_id: { type: String, required: false },

                name: { type: String, required: false },
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
