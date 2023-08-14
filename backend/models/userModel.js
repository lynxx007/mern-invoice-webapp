import { USER } from '../constants/index.js'
import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validator.isEmail, 'invalid email']
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[A-z][A-z0-9-_]{3,23}$/.test(value)
            },
            message: "username must be alphanumeric without special characters, hyphens and underscore allowed"
        }
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: [validator.isAlphanumeric, "First name must be alphanumeric without special characters"]
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validator.isAlphanumeric, "Last name must be alphanumeric without special characters"
        ]
    },

    password: {
        type: String,
        select: false,
        validate: [
            validator.isStrongPassword, "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, and one special character"
        ]
    },

    passwordConfirm: {
        type: String,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords do not match"
        }
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },

    provider: {
        type: String,
        required: true,
        default: "email"
    },

    googleId: {
        type: String
    },

    avatar: {
        type: String,
    },

    businessName: {
        type: String,
    },

    phoneNumber: {
        type: String,
        default: "+6281234567890",
        validate: [
            validator.isMobilePhone,
            "Phone number must begin with a '+', followed by the country code, then the phone number"
        ]
    },

    address: {
        type: String
    },

    city: {
        type: String
    },

    country: {
        type: String
    },

    passwordChangedAt: Date,

    roles: {
        type: [String],
        default: [USER]
    },

    active: {
        type: Boolean,
        default: true
    },

    refreshToken: [String]
},
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    if (this.roles.length === 0) {
        this.roles.push(USER)
        next()
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next()
    }

    this.passwordChangedAt = Date.now()
    next
})

userSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User