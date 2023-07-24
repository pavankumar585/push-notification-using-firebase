import http from "./httpService";

async function signUp(user) {
  const { data } = await http.post("/users", user);

  localStorage.setItem("user", JSON.stringify(data));
}

function sendVerificationEmail(email) {
  return http.post("/email-verification", email);
}

function verifyEmail({ email, otp }) {
  return http.post("/email-verification/verify", { email, otp });
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

const userService = {
  signUp,
  getUser,
  setUser,
  verifyEmail,
  sendVerificationEmail,
};

export default userService;
