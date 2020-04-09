const mongoose = require("mongoose");
const Product = mongoose.models["product"];

controller = {
  create: (req, res, next) => {
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    newProduct
      .save()
      .then((response) => {
        res.status("201").json({
          message: "Product created",
          product: newProduct,
        });
      })
      .catch((err) => {
        res.status("500").json(err);
      });
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
    const body = req.body;
    const query = body.query ? body.query : {};
    const options = body.options ? body.options : { lean: true };
    const fields = body.fields ? body.fields : null;

    return Product.find(query, fields, options)
      .populate("featureImage")
      .then((response) => {
        res.status("200").json(response);
      })
      .catch(next);
  },
  retrieveOne: (req, res, next) => {
    const body = req.body;
    const id = req.params.id;

    return Product.findById(id)
      .populate("featureImage")
      .then((response) => {
        res.status("200").json(response);
      })
      .catch(next);
  },
};
module.exports = controller;
