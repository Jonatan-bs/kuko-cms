const mongoose = require("mongoose");
const Product = mongoose.models["product"];

controller = {
  create: async (req, res, next) => {
    try {
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
