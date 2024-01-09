import expressAsyncHandler from "express-async-handler";
import Customer from "../../models/customerModel.js";

const createCustomer = expressAsyncHandler(async (req, res) => {
  const { email, name, phoneNumber, vatTinNo, address, city, country } =
    req.body;

  if (!email || !name || !phoneNumber) {
    res.status(400);
    throw new Error("a Customer must have an email, name and phone number");
  }

  const customerExist = await Customer.findOne({ email });
  if (customerExist) {
    res.status(400);
    throw new Error("Customer already exist");
  }

  const newCustomer = await Customer.create({
    createdBy: req.user._id,
    name,
    email,
    phoneNumber,
    vatTinNo,
    address,
    city,
    country,
  });
  if (!newCustomer) {
    res.status(400);
    throw new Error("Failed to create customer");
  }

  res.status(200).json({
    success: true,
    message: `Your customer named ${newCustomer.name} has been created successfully`,
    newCustomer,
  });
});

export default createCustomer;
