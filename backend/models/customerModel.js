import mongoose from "mongoose";
import validator from "validator";

const { randomBytes } = await import("crypto");

const customerSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: [
        validator.isEmail,
        "the customer must have a valid email address",
      ],
    },
    accountNo: String,
    vatTinNo: {
      type: Number,
      default: 0,
    },
    address: String,
    city: String,
    country: String,
    phoneNumber: {
      type: String,
      required: true,
      validate: [
        validator.isMobilePhone,
        "Mobile phone number must begin with a '+'' followed by your country code and then your phone number",
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

customerSchema.pre("save", async function (next) {
  this.accountNo = `CUS-${randomBytes(3).toString("hex")}`;
  next();
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
