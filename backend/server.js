import express from 'express'
import chalk from 'chalk'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import "dotenv/config"


const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))

}
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

app.get('/api/v1/test', (req, res) => {
    res.send('hello world')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(
        `${chalk.green.bold('👍')} Server is running in ${process.env.NODE_ENV} on port ${chalk.blue.bold(PORT)}`
    );
})
