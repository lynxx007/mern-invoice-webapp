import { CurrencyExchange } from "@mui/icons-material"
import { Link, Stack, Typography } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

export const Logo = () => {
    return (
        <Stack direction='row' alignItems='center' spacing={1}>
            <Link component={RouterLink} to='/' sx={{ textDecoration: 'none' }}>
                <CurrencyExchange sx={{ display: { xs: "none", md: 'flex' }, mr: 1, fontSize: 50, color: "#07f011", cursor: 'pointer' }} />
            </Link>
            <Typography variant="h5" component='div' sx={{ flexGrow: 1, cursor: 'pointer', display: { xs: 'none', md: 'flex' } }}>
                <Link component={RouterLink} to='/' sx={{ textDecoration: 'none', color: 'white' }}>Invoicing</Link>
            </Typography>
        </Stack>
    )
}
