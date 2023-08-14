import rateLimit from 'express-rate-limit'
import { systemLogs } from '../utils/Logger.js'

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 100, // 100 requests

    message: {
        message: 'Too many requests, please try again later.'
    },

    handler: (req, res, next, options) => {
        systemLogs.error(`Too many requests: ${options.message.message}\t${req.url}\t${req.method}\t${req.headers.origin}`)
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false
})

export const loginLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,

    max: 20, // 20 requests

    message: {
        message: 'Too many login attempts, please try again later.'
    },

    handler: (req, res, next, options) => {
        systemLogs.error(`Too many requests: ${options.message.message}\t${req.url}\t${req.method}\t${req.headers.origin}`)
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false
})