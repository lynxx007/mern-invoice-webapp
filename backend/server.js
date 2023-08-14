import express from 'express'
import chalk from 'chalk'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import "dotenv/config"

import { connectDb } from './config/connectDb.js'
import { morganMiddleware, systemLogs } from './utils/Logger.js'

await connectDb()

const app = express()

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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(
        `${chalk.green.bold('👍')} Server is running in ${process.env.NODE_ENV} on port ${chalk.blue.bold(PORT)}`
    );
    systemLogs.info(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})
