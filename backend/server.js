import express from 'express'
import chalk from 'chalk'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import "dotenv/config.js"

import { connectDb } from './config/connectDb.js'
import { morganMiddleware, systemLogs } from './utils/Logger.js'
import { errorHandler, notFound } from '../backend/middleware/errorMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { apiLimiter } from './middleware/apiLimiter.js'

await connectDb()

const app = express()

app.set('trust proxy', '127.0.0.1')

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))

}
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

app.use(mongoSanitize())

app.use(morganMiddleware)

app.get('/api/v1/test', (req, res) => {
    res.send('hello world')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', apiLimiter, userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(
        `${chalk.green.bold('👍')} Server is running in ${process.env.NODE_ENV} on port ${chalk.blue.bold(PORT)}`
    );
    systemLogs.info(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})
