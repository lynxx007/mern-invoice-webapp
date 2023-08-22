import { Box } from "@mui/material"
export const AuthWrapper = ({ children }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '115vh'
        }}>
            {children}
        </Box>
    )
}
