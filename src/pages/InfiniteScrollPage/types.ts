export type Book = {
  id: number;
  name: string;
  author: string;
  publishedYear: number;
  genre: string;
  isbn: string;
  coverImageUrl: string;
  description: string;
  pageCount: number;
  rating: number;
  language: string;
  publisher: string;
  createdAt: string;
};

export type GetBooksResponse = {
  data: Book[];
  totalItemsCount: number;
  page: number;
  limit: number;
  totalPagesCount: number;
  hasMore: boolean;
};

export type PreviousSearchParams = {
  category: string;
  query: string;
  currentPageNumber: number;
};
