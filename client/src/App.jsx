import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { Footer } from './components/Footer'
import { Layout } from './components/Layout'
import { NotFound } from './components/NotFound'
import { customTheme } from './customTheme'
import { useTitle } from './hooks/useTitle'
import { HomePage } from './pages/HomePage'
import { RegisterPage } from './features/auth/form/pages/RegisterPage'
import { VerificationPage } from './features/auth/form/pages/VerificationPage'


function App() {
  useTitle('Invoicing - Home')
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='auth/verify' element={<VerificationPage />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer theme='dark' />
    </ThemeProvider>
  )
}

export default App
