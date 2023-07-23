import http from "./httpService";

export function signUp(user) {
  return http.post("/users", user);
}

export function sendVerificationEmail(email) {
  return http.post("/email-verification", { email });
}

export function verifyEmail({ email, otp }) {
  return http.post("/email-verification/verify", { email, otp });
}