import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Button, Stack, Typography } from '@mui/material'
import { FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTitle } from '../../../hooks/useTitle'

export const VerificationPage = () => {
  useTitle('Invoicing = Verification')
  return (
    <Stack direction='column' alignItems='center' justifyContent='center' spacing={2} height='94vh'>
      <FaCheckCircle className='verified' />
      <Typography variant='h2' gutterBottom>
        Account Verified
      </Typography>
      <Typography variant='h5' component='div' gutterBottom>
        Your Account has been verified and it is ready to use.
      </Typography>
      <Typography variant='h5' component='div' gutterBottom>
        An Email to confirm the same has been sent
      </Typography>
      <Button startIcon={<LockOpenIcon />} endIcon={<LockOpenIcon />}>
        <Typography variant='h6' component={Link} to='/login' sx={{ textDecoration: 'none' }} gutterBottom>
          Please login to use our service
        </Typography>
      </Button>
    </Stack>
  )
}
