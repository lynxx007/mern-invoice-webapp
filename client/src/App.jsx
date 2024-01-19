import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./components/Footer";
import { Layout } from "./components/Layout";
import { NotFound } from "./components/NotFound";
import { customTheme } from "./customTheme";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { VerificationPage } from "./features/auth/pages/VerificationPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { useSelector } from "react-redux";
import Navbar from "../src/components/Navbar";
import { ResendEmailToken } from "./features/auth/pages/ResendEmailTokenPage";
import { PasswordResetRequest } from "./features/auth/pages/PasswordResetRequest";
import { PasswordResetPage } from "./features/auth/pages/PasswordResetPage";
import { AuthRequired } from "./components/AuthRequired";
import { ROLES } from "./config/roles";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersListPage } from "./features/users/pages/UsersListPage";

function App() {
  const user = useSelector((state) => state.auth.user);
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="auth/verify" element={<VerificationPage />} />
          <Route path="resend" element={<ResendEmailToken />} />
          <Route
            path="reset_password_request"
            element={<PasswordResetRequest />}
          />
          <Route path="auth/reset_password" element={<PasswordResetPage />} />
          {/* Private Routes for Users */}
          <Route element={<AuthRequired allowedRoles={[ROLES.User]} />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
          {/* Private Routes for Admins */}
          <Route element={<AuthRequired allowedRoles={[ROLES.Admin]} />}>
            <Route path="users" element={<UsersListPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer theme="dark" />
    </ThemeProvider>
  );
}

export default App;
