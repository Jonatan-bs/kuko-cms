const mongoose = require("mongoose");
const UserRoleModel = mongoose.models["userRole"];

controller = {
  create: (req, res, next) => {
    const newDocument = new UserRoleModel({
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    });
    newDocument
      .save()
      .then(response => {
        res.status("201").json({
          message: "UserRole created"
        });
      })
      .catch(err => {
        res.status("500").json(err);
      });
  },
  update: (req, res, next) => {
    const id = req.params.id;

    UserRoleModel.findById(id)
      .then(doc => {
        for (const key in req.body) {
          if (req.body.hasOwnProperty(key)) {
            const field = req.body[key];
            doc[key] = field;
          }
        }

        return doc.save();
      })

      .then(document => {
        res.status("201").json({
          message: "User role updated"
        });
      })
      .catch(err => res.status("500").json({ err }));
  },
  delete: (req, res, next) => {
    // const body = req.body;
    // const query = body.query ? body.query : {};
    // const options = body.options ? body.options : { lean: true };
    // const fields = body.fields ? body.fields : null;
    // User.find(query, fields, options)
    //   .then(response => {
    //     res.status("201").json(response);
    //   })
    //   .catch(err => {
    //     res.send({ err });
    //   });
  },
  retrieve: (req, res, next) => {
    const body = req.body;
    const query = body.query ? body.query : {};
    const options = body.options ? body.options : { lean: true };
    const fields = body.fields ? body.fields : null;

    return UserRoleModel.find(query, fields, options)
      .then(response => {
        res.status("201").json(response);
      })
      .catch(next);
  }
};
module.exports = controller;
