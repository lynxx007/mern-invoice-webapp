import express from 'express'
import checkAuth from '../middleware/checkAuthMiddleware.js'
import getUserProfile from '../controllers/user/getUserProfile.js'
import updateUserProfile from '../controllers/user/updateUserProfile.js'
import deleteUser from '../controllers/user/deleteUserProfile.js'
import role from '../middleware/roleMiddleware.js'
import getAllUsers from '../controllers/user/getAllUsers.js'
import deleteUserByAdmin from '../controllers/user/deleteUserByAdmin.js'
import deactivateUser from '../controllers/user/deactivateUser.js'

const router = express.Router()

router.route("/profile").get(checkAuth, getUserProfile).patch(checkAuth, updateUserProfile)
    .delete(checkAuth, deleteUser)

router.route("/all").get(checkAuth, role.checkRole(role.ROLES.Admin), getAllUsers)

router.route("/:id").delete(checkAuth, role.checkRole(role.ROLES.Admin), deleteUserByAdmin)

router.route("/:id/deactivate").patch(checkAuth, role.checkRole(role.ROLES.Admin), deactivateUser)

export default router