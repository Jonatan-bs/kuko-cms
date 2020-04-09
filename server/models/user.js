const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: "string",
      required: true,
      ref: "userRole",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.email = this.email ? this.email.toLowerCase() : null;

  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);

  next();
});

UserSchema.methods.comparePassword = function (plaintext) {
  return bcrypt.compareSync(plaintext, this.password);
};

module.exports = mongoose.model("user", UserSchema, "user");
