import api from './axios';

export const debates = async (credentials) => {
  return api.get('/app/v1/link/debate', {
    params: credentials,
  });
};

export const committee = async (credentials) => {
  return api.get('/app/v1/link/committee', {
    params: credentials,
  });
};
