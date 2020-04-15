const mongoose = require("mongoose");
const Product = mongoose.models["product"];
const cloudinary = require("cloudinary").v2;

controller = {
  create: async (req, res, next) => {
    public_ids = [];
    if (req.body.thumbnail) {
      public_ids.push(req.body.thumbnail.public_id);
    }
    if (req.body.variants.length) {
      req.body.variants.forEach((variant) => {
        variant.images.forEach((image) => {
          public_ids.push(image.public_id);
        });
      });
    }

    try {
      await cloudinary.uploader.remove_tag("temp", public_ids);
      await cloudinary.api.delete_resources_by_tag("temp");

      const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        thumbnail: req.body.thumbnail,
        variants: [...req.body.variants],
      });

      await newProduct.save();
      res.status("201").json({
        message: "Product created",
        product: newProduct,
      });
    } catch (err) {
      return res.status("500").send({ success: false, message: err });
    }
  },
  update: (req, res, next) => {
    const id = req.params.id;

    Product.findById(id)
      .then((product) => {
        for (const key in req.body) {
          if (req.body.hasOwnProperty(key)) {
            const field = req.body[key];
            product[key] = field;
          }
        }
        return product.save();
      })

      .then((product) => {
        res.status("201").json({
          message: "Product updated",
          product: product,
        });
      })
      .catch((err) => res.status("500").json({ err }));
  },
  delete: (req, res, next) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
      .then((response) => {
        res.status("200").json(response);
      })
      .catch(next);
  },
  retrieve: (req, res, next) => {
    Product.find()

      .then((response) => {
        console.log(response);
        res.status("200").json(response);
      })
      .catch(next);
  },
  retrieveOne: (req, res, next) => {
    const body = req.body;
    const id = req.params.id;

    return Product.findById(id, "-__v")

      .then((response) => {
        res.status("200").json(response);
      })
      .catch(next);
  },
};
module.exports = controller;
