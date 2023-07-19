import { Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import CustomNavbar from "./components/CustomNavbar";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const loggedIn = false;

  return (
    <>
      {loggedIn && <CustomNavbar />}
      <Container>
        <Routes>
          <Route index element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
