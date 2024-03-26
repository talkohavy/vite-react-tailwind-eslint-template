enum LoginTypes {
  credentials = 'credentials',
  cookie = 'cookie',
  saml = 'saml',
  oauth = 'oauth',
}

type CredentialsLogin = {
  loginType: LoginTypes.credentials;
  params: {
    username: string;
    password: string;
  };
};

type CookieLogin = {
  loginType: LoginTypes.cookie;
  params: {
    cookie: string;
  };
};

type SamlLogin = {
  loginType: LoginTypes.saml;
  params: {
    idp: string;
  };
};

export type { CookieLogin, CredentialsLogin, LoginTypes, SamlLogin };
