import http from "./httpService";

const apiEndPoint = "/auth";

export function login(user) {
  return http.post(apiEndPoint, user);
}
