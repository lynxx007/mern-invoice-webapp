import express from 'express'
import checkAuth from '../middleware/checkAuthMiddleware.js'
import getUserProfile from '../controllers/user/getUserProfile.js'

const router = express.Router()

router.route("/profile").get(checkAuth, getUserProfile)

export default router