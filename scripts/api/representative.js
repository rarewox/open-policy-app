import api from './axios';

export const your_representative = async (credentials) => {
  return api.get('/app/v1/representatives', {
    params: credentials,
  });
};

export const search_representatives = async (credentials) => {
  return api.get('/app/v1/representatives/all', {
    params: credentials,
  });
};

export const representative = async (credentials) => {
  return api.get('/app/v1/representatives/single', {
    params: credentials,
  });
};

export const activity_link = async (credentials) => {
  return api.get('/app/v1/representatives/activity-link', {
    params: credentials,
  });
};

export const issue_information = async (credentials) => {
  return api.get('/app/v1/representatives/view-issue', {
    params: credentials,
  });
};

export const guest_issue_information = async (credentials) => {
  return api.get('/app/v1/representatives/guest-view-issue', {
    params: credentials,
  });
};

export const issue_bookmark = async (credentials) => {
  return api.post('/app/v1/representatives/bookmark-issue', credentials);
};

export const issue_voting = async (credentials) => {
  return api.post('/app/v1/representatives/support-issue', credentials);
};

export const request_deletion = async (credentials) => {
  return api.post('/app/v1/issue/delete', credentials);
};
