import api from './axios';

export const profile = async (credentials) => {
  return api.get('/app/v1/profile', credentials);
};

export const change_password = async (credentials) => {
  return api.post('/app/v1/profile/change-password', credentials);
};

export const change_postal_code = async (credentials) => {
  return api.post('/app/v1/profile/postal-code', credentials);
};

export const update_profile = async (data) => {
  return await api.post('/app/v1/profile/update-profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const delete_account = async (credentials) => {
  return api.post('/app/v1/profile/delete-account', credentials);
};

export const analytics = async (credentials) => {
  return api.post('/app-auth/login', credentials);
};
