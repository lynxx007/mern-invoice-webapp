import nodemailer from 'nodemailer'
import 'dotenv/config.js'
let transporter;

if (process.env.NODE_ENV === 'development') {
    transporter = nodemailer.createTransport({
        host: "mailhog",
        port: 1025
    })
} else if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({

    })
}

export default transporter
