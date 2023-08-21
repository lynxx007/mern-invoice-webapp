import { Box, Typography, Container } from "@mui/material";
import { FaHeartBroken, FaSadTear } from "react-icons/fa";




export const NotFound = () => {
    return (
        <Container>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                height: '94vh'
            }}>
                <Typography variant="h1" sx={{ fontSize: "10rem", mt: "14rem" }} align="center">404 Not Found</Typography>
                <Box>
                    <FaHeartBroken className="broken-heart" />
                    <FaSadTear className="sad-tear" />
                </Box>
            </Box>
        </Container>
    )
}
