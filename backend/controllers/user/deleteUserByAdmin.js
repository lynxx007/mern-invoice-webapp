import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";


const deleteUserByAdmin = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();

        res.json({
            success: true,
            message: `User ${user.firstName} deleted successfully`
        })
    }
    else {
        res.status(400);
        throw new Error("User not found");
    }

})

export default deleteUserByAdmin