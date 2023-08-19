import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

const deleteUser = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id

    await User.findByIdAndDelete(userId)

    res.json({
        success: true,
        message: "Your account has been deleted"
    })
})

export default deleteUser