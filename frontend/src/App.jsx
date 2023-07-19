import { Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import CustomNavbar from "./components/CustomNavbar";
import Notification from './pages/Notification';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Users from './pages/Users';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Announcement from './pages/Announcement';
import "./App.css"

function App() {
  const loggedIn = true;

  return (
    <>
      {loggedIn && <CustomNavbar />}
      <Container>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
