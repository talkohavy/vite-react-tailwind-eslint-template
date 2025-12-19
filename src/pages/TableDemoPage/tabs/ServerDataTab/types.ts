export type User = {
  id: number;
  email: string;
  nickname: string;
  hashed_password: string;
  date_of_birth: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UsersResponse = {
  data: User[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
