import api from './axios';

export const getBill = async (credentials) => {
  return api.get('/app/v1/chat/get-bill', {
    params: credentials,
  });
};

export const getIssue = async (credentials) => {
  return api.get('/app/v1/chat/get-issue', {
    params: credentials,
  });
};

export const bill_chat = async (credentials) => {
  return api.post('/app/v1/chat/bill-chat', credentials);
};

export const issue_chat = async (credentials) => {
  return api.post('/app/v1/chat/issue-chat', credentials);
};
