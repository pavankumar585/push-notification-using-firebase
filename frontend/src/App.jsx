import { Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import CustomNavbar from "./components/CustomNavbar";
import Notification from './pages/Notification';
import Announcement from './pages/Announcement';
import PageNotfound from './pages/PageNotfound';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Users from './pages/Users';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import VerifyEmailForm from './pages/VerifyEmailForm';
import { ToastContainer } from "react-toastify"
import "./App.css"

function App() {
  const loggedIn = true;

  // console.log("vapidkey", import.meta.env.VITE_FIRE_BASE_VAPID_KEY);

  return (
    <>
      {loggedIn && <CustomNavbar />}
      <ToastContainer />
      <Container>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/register" element={<Register />} />
          <Route path="/validate-email" element={<VerifyEmailForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<PageNotfound />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
