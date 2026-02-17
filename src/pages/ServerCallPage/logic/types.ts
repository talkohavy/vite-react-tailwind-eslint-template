export type UserRole = 'user' | 'admin' | 'guest';

export type UserFormData = {
  email: string;
  password: string;
  dateOfBirth: string;
  nickname: string;
  role: UserRole;
};

export type RequestInfo = {
  method: string;
  url: string;
  requestId: string;
};
