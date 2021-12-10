const bcrypt = require("bcryptjs/dist/bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");
const Validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter User's Name"],
    maxlength: [30, "Name can't be more than 30 characters"],
    minlength: [4, "Name cant be less than 4 characters"],
  },
  username: {
    type: String,
    required: [true, "Please Enter User's Unique Username"],
    unique: true,
    maxlength: [20, "Name can't be more than 20 characters"],
    minlength: [4, "Name cant be less than 4 characters"],
  },
  password: {
    type: String,
    required: [true, "Please Enter User's Password"],
    minlength: [8, "Password cant be less than 8 characters"],
    select: false,
  },
  email: {
    type: String,
    unique: true,
    validate: [Validator.isEmail, "Please enter valid email id"],
    required: [true, "Please Enter User's Email"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "User",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jsonwebtoken.sign(
    {
      id: this._id,
    },
    process.env.JWT_TOKEN_KEY,
    {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    }
  );
};

userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
