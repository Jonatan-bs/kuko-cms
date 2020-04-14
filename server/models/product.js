const mongoose = require("mongoose");
const moveFileToCloudinary = require("./../controllers/cloudinaryHandler");
const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, default: "" },
    shortDescription: { type: String, required: true, default: "" },
    thumbnail: {
      type: {
        public_id: { type: String, required: false },
        filename: { type: String, required: true },
        originalname: { type: String, required: true },
        path: { type: String, required: true },
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
                filename: { type: String, required: true },
                originalname: { type: String, required: true },
                path: { type: String, required: true },
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

ProductSchema.post("validate", async (doc, next) => {
  try {
    if (doc.thumbnail) {
      if (!doc.thumbnail.public_id) {
        let thumbnail = await moveFileToCloudinary(doc.thumbnail);
        doc.thumbnail.public_id = thumbnail.public_id;
      }
    }
    if (doc.variants) {
      for (let i = 0; i < doc.variants.length; i++) {
        let variant = doc.variants[i];
        for (let a = 0; a < variant.images.length; a++) {
          let image = variant.images[a];
          if (!image.public_id) {
            let imageData = await moveFileToCloudinary(image);
            doc.variants[i].images[a].public_id = imageData.public_id;
          }
        }
      }
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

mongoose.model("product", ProductSchema);
