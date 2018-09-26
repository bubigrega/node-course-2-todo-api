const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 44,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: `This is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  let user = this;

  let userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";
  let token = jwt
    .sign({ _id: user._id.toHexString(), access }, "secret")
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => {
    return token;
  });
};

let User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
