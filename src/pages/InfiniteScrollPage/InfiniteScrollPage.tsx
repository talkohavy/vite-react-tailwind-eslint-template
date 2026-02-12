import Button from '../../components/controls/Button';
import Input from '../../components/controls/Input';
import BooksErrorLoadingContent from './content/BooksErrorLoadingContent';
import { useInfiniteScrollPageLogic } from './logic/useInfiniteScrollPageLogic';

export default function InfiniteScrollPage() {
  const { setQuery, handleFetchBooks, books, booksHookResult, onBottomReached, isLoadingNextPage } =
    useInfiniteScrollPageLogic();

  return (
    <div className='size-full bg-gray-50 dark:bg-gray-900'>
      <div className='flex flex-col gap-6 max-w-md h-full md:max-w-7xl mx-auto bg-white dark:bg-gray-800 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 shadow-sm dark:shadow-dark-sm'>
        <header>
          <h1 className='text-3xl sm:text-4xl font-bold'>
            <span className='text-[#7F56D9] dark:text-violet-400'>LuckyLove</span>&nbsp;
            <span className='text-gray-800 dark:text-gray-200 font-normal'>Book Library</span>
          </h1>
        </header>

        <div className='flex flex-col shrink-0 md:flex-row md:items-end gap-4 sm:gap-6 w-full overflow-auto p-1'>
          <Input
            onChange={setQuery}
            className='dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500'
          />

          <Button
            onClick={handleFetchBooks}
            className='h-10 text-white whitespace-nowrap dark:bg-violet-600 dark:hover:bg-violet-700 dark:active:bg-violet-600'
          >
            Fetch Books
          </Button>
        </div>

        <BooksErrorLoadingContent
          books={books}
          booksHookResult={booksHookResult}
          isLoadingNextPage={isLoadingNextPage}
          onBottomReached={onBottomReached}
        />
      </div>
    </div>
  );
}
