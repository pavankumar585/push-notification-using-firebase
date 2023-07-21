import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TfiAnnouncement } from "react-icons/tfi";

function CustomNavbar() {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [mobile, setMobile] = useState(false);

  const handleResize = () => {
    setInnerWidth(window.innerWidth);
  };

  useState(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (innerWidth < 992) setMobile(true);
    if (innerWidth > 991) setMobile(false);
  }, [innerWidth]);

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Push-Notification
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          ></Nav>
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/notification"
              className="position-relative"
            >
              <IoMdNotificationsOutline size="1.8em" />
              <Badge
                bg="danger"
                pill
                className="position-absolute top-25 start-25 translate-middle"
              >
                5
              </Badge>
            </Nav.Link>
            <Nav.Link as={Link} to="/announcement">
              {mobile ? "Announcement" : <TfiAnnouncement size="1.8em" />}
            </Nav.Link>
            <Nav.Link as={Link} to="profile">
              My Profile
            </Nav.Link>
            <Nav.Link as={Link} to="logout">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
