const mongoose = require("mongoose");
const ImageLibrary = mongoose.models["imgLibrary"];
// collectionInfo
controller = {
  create: (req, res, next) => {
    let file = req.file;

    req.body.originalname = file.originalname;
    req.body.mimetype = file.mimetype;
    req.body.destination = file.destination;
    req.body.filename = file.filename;
    req.body.size = file.size;

    const newDocument = new ImageLibrary({
      _id: new mongoose.Types.ObjectId(),
      originalname: req.body.originalname,
      mimetype: req.body.mimetype,
      destination: req.body.destination,
      filename: req.body.filename,
      size: req.body.size,
      name: req.body.name,
      alt: req.body.alt,
      description: req.body.description,
    });

    newDocument
      .save()
      .then((response) => {
        res.status("201").json({
          message: "Image added",
        });
      })
      .catch((err) => {
        res.status("500").json(err);
      });
  },

  update: (req, res, next) => {
    const id = req.params.id;
    ImageLibrary.findById(id)
      .then((doc) => {
        doc.name = req.body.name;
        doc.alt = req.body.alt;
        doc.description = req.body.description;
        doc.caption = req.body.caption;

        return doc.save();
      })

      .then((document) => {
        res.status("201").json({
          message: "Document updated",
          document: document,
        });
      })
      .catch((err) => res.status("500").json({ err }));
  },

  retrieve: (req, res, next) => {
    const body = req.body;
    const query = body.query ? body.query : {};
    const options = body.options ? body.options : { lean: true };
    const fields = body.fields ? body.fields : null;

    return ImageLibrary.find(query, fields, options)
      .then((response) => {
        res.status("201").json(response);
      })
      .catch(next);
  },
};
module.exports = controller;
