import { LoginInput, RegisterInput } from "../../../types/auth";
import apiClient from "../apiClient";

const API_URL = "/api/auth/";

async function login(data: LoginInput) {
  const res = await apiClient.post(API_URL + "login", data);
  return res.data;
}

async function register(data: RegisterInput) {
  const res = await apiClient.post(API_URL + "register", data);
  return res.data;
}

async function logout() {
  const res = await apiClient.get(API_URL + "logout");
  return res.data;
}

async function getLoginStatus() {
  const res = await apiClient.get(API_URL + "getLoginStatus");
  return res.data;
}

export { login, register, logout, getLoginStatus };
