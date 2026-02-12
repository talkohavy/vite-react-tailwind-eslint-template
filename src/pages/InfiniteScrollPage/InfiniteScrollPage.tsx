import Button from '../../components/controls/Button';
import Input from '../../components/controls/Input';
import BooksErrorLoadingContent from './content/BooksErrorLoadingContent';
import { useInfiniteScrollPageLogic } from './logic/useInfiniteScrollPageLogic';

export default function InfiniteScrollPage() {
  const { setQuery, handleFetchBooks, books, booksHookResult, onBottomReached, isLoadingNextPage } =
    useInfiniteScrollPageLogic();

  return (
    <div className='size-full bg-gray-50'>
      <div className='flex flex-col gap-6 max-w-md h-full md:max-w-7xl mx-auto bg-white px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 shadow-sm'>
        <header>
          <h1 className='text-3xl sm:text-4xl font-bold'>
            <span className='text-[#7F56D9]'>LuckyLove</span>&nbsp;
            <span className='text-gray-800 font-normal'>Book Library</span>
          </h1>
        </header>

        <div className='flex flex-col shrink-0 md:flex-row md:items-end gap-4 sm:gap-6 w-full overflow-auto p-1'>
          <Input onChange={setQuery} />

          <Button onClick={handleFetchBooks} className='h-10 whitespace-nowrap'>
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
