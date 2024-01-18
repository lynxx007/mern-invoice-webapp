import mongoose from "mongoose";

const { randomBytes } = await import("crypto");

const paymentSchema = new mongoose.Schema(
  {
    paidBy: String,
    datePaid: String,
    amountPaid: Number,
    paymentMethod: {
      type: String,
      default: "Cash",
      enum: [
        "Cash",
        "Mobile Money",
        "Paypal",
        "Credit Card",
        "Bank Transfer",
        "Others",
      ],
    },
    additionalInfo: String,
  },
  {
    timestamps: true,
  }
);

const documentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      name: String,
      email: String,
      accountNo: String,
      vatTinNo: String,
      address: String,
      city: String,
      country: String,
      phoneNumber: String,
    },
    documentType: {
      type: String,
      default: "Invoice",
      enum: ["Invoice", "Receipt", "Quotation"],
    },
    documentNumber: String,
    dueDate: Date,
    additionalInfo: String,
    termsConditions: String,
    status: {
      type: String,
      default: "Not Paid",
      enum: ["Paid", "Not Fully Paid", "Not Paid"],
    },
    subTotal: Number,
    salesTax: Numbers,
    rates: String,
    total: Number,
    currency: String,
    totalAmountReceived: Number,
    billingItems: [
      {
        itemName: String,
        unitPrice: Number,
        quantity: Number,
        discount: String,
      },
    ],
    paymentRecords: [paymentSchema],
  },
  { timestamps: true }
);

documentSchema.pre("save", async function (next) {
  this.documentNumber = `${new Date().getFullYear}-${new Date().toLocaleString(
    "default",
    { month: "long" }
  )}-${randomBytes(3).toString("hex").toUpperCase()}`;
  next();
});

const Document = mongoose.model("Document", documentSchema);

export default Document;
