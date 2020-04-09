const mongoose = require("mongoose");
const User = mongoose.models["user"];
const handler = require("./handler");

module.exports = {
  register: (req, res, next) => {
    const user = new User({ ...req.body });
    user
      .save()
      .then((user) => {
        req.session.authenticated = true; // set session vars
        req.session.user_id = user._id; // set session vars

        res.status(201).json({ auth: true, user });
      })
      .catch((err) => res.status(500).json(err));
  },
  login: async (req, res, next) => {
    req.body.email = req.body.email ? req.body.email.toLowerCase() : null;

    const verified = await handler.verifyUser(req);
    if (verified.success) {
      verified.user = {
        _id: verified.user._id,
        firstname: verified.user.firstname,
        lastname: verified.user.lastname,
        email: verified.user.email,
        todo: verified.user.todo,
      };

      res.status(200).json({ auth: true, user: verified.user });
    } else {
      res.status(500).json({ auth: false });
    }
  },
  retrieve: async (req, res, next) => {
    User.find()
      .populate("role")
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((response) => res.status(500).json(response));
  },

  logout: (req, res, next) => {
    req.session.destroy(function (err) {
      if (err) res.status(500);
      res.status(201).json({ message: "logged out" });
    });
  },
  auth: async (req, res, next) => {
    let user = await User.findOne({ _id: req.session.user_id }).populate(
      "role"
    );
    // let user = await User.find({}).populate("role").limit(1);
    // user = user[0];

    if (user)
      res.status(200).json({
        auth: true,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      });
    else res.status(200).json({ auth: false });
  },
};
