import chalk from 'chalk'
import mongoose from 'mongoose'
import { systemLogs } from '../utils/Logger.js'
import 'dotenv/config.js'

export const connectDb = async () => {
    try {
        const connectionParams = {
            dbName: process.env.DB_NAME
        }
        const connect = await mongoose.connect(
            process.env.MONGO_URI,
            connectionParams
        )
        console.log(`${chalk.green.bold(`Connected to MongoDB`)}`)
        systemLogs.info(`${chalk.green.bold(`Connected to MongoDB`)}`)
    } catch (error) {
        console.error(`${chalk.red.bold(`Error : ${error.message}`)}`)
        process.exit(1)

    }
}