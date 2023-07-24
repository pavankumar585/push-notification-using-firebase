import http from "./httpService";

export async function signUp(user) {
  const { data } = await http.post("/users", user);

  localStorage.setItem("user", JSON.stringify(data));
}

export function sendVerificationEmail(email) {
  return http.post("/email-verification", email);
}

export function verifyEmail({ email, otp }) {
  return http.post("/email-verification/verify", { email, otp });
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
