import { SentimentSatisfiedAltTwoTone, Logout, SpeedTwoTone } from '@mui/icons-material'
import { Avatar, Box, ButtonBase, Divider, Grid, ListItemIcon, Menu, MenuItem, Stack, styled, Typography } from '@mui/material'

import { deepOrange } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLogoutUserMutation } from '../features/auth/authApiSlice'
import { useAuthUser } from '../hooks/useAuthUser'

const StyledMenuItem = styled(MenuItem)({
    "&:hover": { backgroundColor: "#555a64" },
    width: 240,
    height: 50
})

const StyledProfileDivider = styled(Divider)({
    height: '2px',
    borderColor: '#ffffff63'
})


export const ProfileInfo = ({ user }) => {
    const { isAdmin } = useAuthUser()
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleOpenUserMenu = e => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorEl(null)
    }

    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation()

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap()
            navigate('/login')
        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message
            toast.success(message)
        }
    }, [isSuccess, data])

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase sx={{ p: 0.25, bgColor: open ? "#E0E0E0" : "transparent", borderRadius: 10, "&:hover": { bgcolor: "#555a54" } }} aria-label='open profile' ref={anchorEl} aria-controls={open ? "profile-grow" : undefined} aria-haspopup="true" onClick={handleOpenUserMenu}>
                {user.avatar ? (
                    <Stack direction='row' spacing={2} alignItems='center' sx={{ p: 0.5 }}>
                        <Avatar alt='profile user' src={user.avatar} sx={{ width: 48, height: 48 }} />
                        <Typography variant='h6'>{user.username}</Typography>
                    </Stack>
                ) : (
                    <Stack direction='row' spacing={2} alignItems='center' sx={{ p: 0.5 }}>
                        <Avatar sx={{ bgcolor: deepOrange[700] }}>
                            {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant='h6'>
                            {user.username}
                        </Typography>
                    </Stack>
                )}
            </ButtonBase>
            <Menu
                sx={{ mt: '45px' }}
                id='account-menu'
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                onClose={handleCloseUserMenu}
                onClick={handleCloseUserMenu}
                slotProps={{
                    paper:
                    {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            bgcolor: '#000000',
                            color: '#ffffff',
                            borderRadius: '10px',
                            "&. MuiAvatar-root": { width: 43, height: 42, ml: -0.5, mr: 1 },
                            "&:before": { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: "#000000", transform: "translateY(-50%) rotate(45deg)", zIndex: 0 }
                        }
                    }
                }}>
                <Box>
                    <Grid container justifyContent="space-between" alignItems='center'>
                        <Stack>
                            <StyledMenuItem onClick={() => navigate('/profile')}>
                                <Grid item>
                                    <Stack direction='row' spacing={1.25} alignItems='center'>
                                        {user.avatar ? (
                                            <Stack direction='row' spacing={1.25} alignItems='center' sx={{ p: 0.5 }}>
                                                <Avatar alt='profile user' src={user.avatar} sx={{ width: 48, height: 48 }} />
                                                <Stack>
                                                    <Typography variant='h6'>
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </Typography>
                                                    <Typography variant='body2'>
                                                        {isAdmin ? "Project Admin" : "Product User"}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        ) : (
                                            <Stack direction='row' spacing={1.25} alignItems='center' sx={{ p: 0.5 }}>
                                                <Avatar sx={{ bgcolor: deepOrange[700] }}>
                                                    {user.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Stack>
                                                    <Typography variant='h6'>
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </Typography>
                                                    <Typography variant='body2' color="#CFD8DC">
                                                        {isAdmin ? "Project Admin" : "Product User"}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Grid>
                            </StyledMenuItem>
                            <StyledProfileDivider />
                            <StyledMenuItem onClick={() => navigate('/profile')}>
                                <Grid item>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <ListItemIcon>
                                            <SentimentSatisfiedAltTwoTone color='blue' sx={{ fontSize: 45 }} />
                                        </ListItemIcon>
                                        <Typography variant='h6'>
                                            View Profile
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </StyledMenuItem>
                            <StyledProfileDivider />
                            <StyledMenuItem onClick={() => navigate('/dashboard')}>
                                <Grid item>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <ListItemIcon>
                                            <SpeedTwoTone color='yellow' sx={{ fontSize: 45 }} />
                                        </ListItemIcon>
                                        <Typography variant='h6'>
                                            Dashboard
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </StyledMenuItem>
                            <StyledProfileDivider />
                            <StyledMenuItem onClick={handleLogout}>
                                <Grid item>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <ListItemIcon>
                                            <Logout color='green' sx={{ fontSize: 45 }} />
                                        </ListItemIcon>
                                        <Typography variant='h6'>
                                            Logout
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </StyledMenuItem>
                        </Stack>
                    </Grid>
                    <Divider />
                </Box>
            </Menu>
        </Box>
    )
}
