import { useEffect, useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { strengthColor, strengthIndicator } from '../../../utils/passwordStrength'
import { useRegisterUserMutation } from '../authApiSlice'
import {
    Box, Button, FormControl, FormHelperText, Grid,
    IconButton, InputAdornment, InputLabel, Link, OutlinedInput,
    Stack, Typography
} from '@mui/material'
import { Formik } from 'formik'
import AuthButtonAnimation from '../../../animations/authButtonAnimation'
import { Spinner } from '../../../components/Spinner'
import { useTitle } from '../../../hooks/useTitle'


const USERNAME_REGEX = /^[A-Z][A-z0-9-_]{3,23}$/

export const RegisterForm = () => {
    useTitle("Sign Up - Invoicing")
    const navigate = useNavigate()

    const [level, setLevel] = useState()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleShowHidePassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowHideConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleMouseDownPassword = e => {
        e.preventDefault()

    }

    const changePassword = value => {
        const temp = strengthIndicator(value)
        setLevel(temp)
    }

    useEffect(() => {
        changePassword("")
    }, [])


    const [registerUser, { data, isLoading, isSuccess }] = useRegisterUserMutation()

    useEffect(() => {
        if (isSuccess) {
            navigate("/")

            const message = data?.message
            toast.success(message)
        }
    }, [data, isSuccess, navigate])

    return (
        <>
            <Formik initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
                submit: null
            }}
                validationSchema={Yup.object().shape({
                    firstName: Yup.string().required("First Name is required").max(255),
                    lastName: Yup.string().required("Last Name is required").max(255),
                    email: Yup.string().required("Email is required").email("Email is invalid").max(255),
                    username: Yup.string().matches(USERNAME_REGEX, "Should be between 4 and 24 characters, letters, numbers, underscores, hyphens allowed. Special characters is not allowed").required("A username is required"),
                    password: Yup.string().required("Password is required").max(255),
                    confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password")], "Passwords must match")

                })}>

            </Formik>
        </>
    )
}
