import expressAsyncHandler from "express-async-handler";
import Customer from "../../models/customerModel.js";

const updateCustomerInfo = expressAsyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  if (customer.createdBy.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const { id: _id } = req.params;
  const fieldsToUpdate = req.body;

  const updatedCustomerInfo = await Customer.findByIdAndUpdate(
    _id,
    { ...fieldsToUpdate, _id },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: `Customer ${customer.name} updated successfully`,
    updatedCustomerInfo,
  });
});
