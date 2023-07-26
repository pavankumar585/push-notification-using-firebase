import React, { useEffect } from "react";
import userService from "./../services/userService";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = userService.getUser();
    if (!user || !user.data.isVerified) navigate("/register");

    localStorage.removeItem("count");
  }, []);

  return <div>Users</div>;
}

export default Users;
