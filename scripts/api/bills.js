import api from './axios';

export const bills = async (credentials) => {
  return api.get('/app/v1/bills', {
    params: credentials,
  });
};

export const user_bills = async (credentials) => {
  return api.get('/app/v1/bills/user-bill', {
    params: credentials,
  });
};

export const show_bill = async (credentials) => {
  return api.get('/app/v1/bills/show/' + credentials.number);
};

export const guest_show_bill = async (credentials) => {
  return api.get('/app/v1/bills/guest-show/' + credentials.number);
};

export const bill_support = async (credentials) => {
  return api.post('/app/v1/bills/support', credentials);
};

// export const contact_mp = async (credentials) => {
//   return api.post('/app-auth/login', credentials);
// };

export const bookmark_bill = async (credentials) => {
  return api.post('/app/v1/bills/bookmark', credentials);
};

export const create_issue = async (credentials) => {
  return api.post('/app/v1/issue/create', credentials);
};
