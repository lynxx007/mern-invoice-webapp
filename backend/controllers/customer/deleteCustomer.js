import expressAsyncHandler from "express-async-handler";
import Customer from "../../models/customerModel.js";

const deleteCustomer = expressAsyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
});
