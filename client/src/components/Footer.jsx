import { Box, CssBaseline, Link, Typography } from '@mui/material'
import { FaMoneyBillWave } from 'react-icons/fa'


function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: "#ffffff" }} align="center">
            {"Copyright ©"}
            <Link color="inherit" href="https://github.com/lynxx007/mern-invoice-webapp">Invoicing</Link>
            {new Date().getFullYear()}
        </Typography>
    )
}


export const Footer = () => {
    return (
        <Box sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
        }}>
            <CssBaseline />
            <Box component='footer' sx={{
                py: 1,
                px: 1,
                mt: "auto",
                bgcolor: "black"
            }}>
                <Typography variant='subtitle1' align='center' component='p' sx={{ color: "#07f011" }}>
                    <FaMoneyBillWave /> Because Time is Money <FaMoneyBillWave />
                </Typography>
                <Copyright />
            </Box>
        </Box>
    )
}

