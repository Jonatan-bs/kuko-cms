const mongoose = require("mongoose");
const User = mongoose.models["user"];

module.exports = {
  verifyUser: async req => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    let success = false;
    success = user ? user.comparePassword(password) : false;
    if (success) {
      req.session.authenticated = true; // set session vars
      req.session.user_id = user._id; // set session vars
    } else {
      req.session = undefined;
    }
    return { success, user };
  }
};
