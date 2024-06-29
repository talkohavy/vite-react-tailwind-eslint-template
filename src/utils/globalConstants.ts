const LSKEY_THEME = 'theme';
const LSKEY_SEARCH_PARAMS = 'search-params';

const API_URLS = {
  users_service: {
    loginWithCredentials: '/login',
    loginWithCookie: '/login-with-cookie',
    loginWithSaml: '/login-with-saml',
    logout: '/logout',
    users: '/users',
  },
};

export { API_URLS, LSKEY_SEARCH_PARAMS, LSKEY_THEME };
