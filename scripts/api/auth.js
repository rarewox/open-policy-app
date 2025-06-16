import api from './axios';

export const login = async (credentials) => {
  return api.post('/app-auth/login', credentials);
};

export const register = async (credentials) => {
  return api.post('/app-auth/register', credentials);
};

export const send_otp = async (credentials) => {
  return api.post('/app-auth/otp/send', credentials);
};

export const verify_otp = async (credentials) => {
  return api.post('/app-auth/otp/verify', credentials);
};

export const getUser = async (credentials) => {
  return api.get('/user', credentials);
};

export const logout = async (credentials) => {
  return api.post('/app-auth/logout', credentials);
};

export const check_email = async (credentials) => {
  return api.post('/app-auth/check-email', credentials);
};

export const check_phone_postal = async (credentials) => {
  return api.post('/app-auth/check-phone-postal', credentials);
};

export const check_forgotten_email = async (credentials) => {
  return api.post('/app-auth/check-forgotten-email', credentials);
};

export const forgot_password = async (credentials) => {
  return api.post('/app-auth/forgot-password', credentials);
};
