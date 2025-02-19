import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// const companySchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Company Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       validate: validator.isEmail,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least"],
//       select: true,
//     },
//     contact: { type: String },
//     location: { type: String },
//     about: { type: String },
//     profileUrl: { type: String },
//     jobPosts: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
//     verified: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Company Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least"],
      select: true,
    },
    contact: { type: String },
    location: { type: String },
    about: { type: String },
    profileUrl: { type: String },
    jobPosts: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
    verified: { type: Boolean, default: true }, // Updated to true
  },
  { timestamps: true }
);


// middelwares
companySchema.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
companySchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
companySchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const Companies = mongoose.model("Companies", companySchema);

export default Companies;




// import mongoose, { Schema } from "mongoose";
// import validator from "validator";
// import bcrypt from "bcryptjs";
// import JWT from "jsonwebtoken";

// const companySchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Company Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       validate: validator.isEmail,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: true,
//     },
//     contact: { type: String },
//     location: { type: String },
//     about: { type: String },
//     profileUrl: { type: String },
//     jobPosts: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
//     verified: { type: Boolean, default: true }, // Default set to true
//   },
//   { timestamps: true }
// );

// // Middleware for hashing password
// companySchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Method to compare password
// companySchema.methods.comparePassword = async function (userPassword) {
//   const isMatch = await bcrypt.compare(userPassword, this.password);
//   return isMatch;
// };

// // Method to create JWT
// companySchema.methods.createJWT = function () {
//   return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: "1d",
//   });
// };

// const Companies = mongoose.model("Companies", companySchema);

// export default Companies;
