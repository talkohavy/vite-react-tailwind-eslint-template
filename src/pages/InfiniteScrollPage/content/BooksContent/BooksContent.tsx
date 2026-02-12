import BookCard from '../BookCard';
import FillerEmptyCard from '../FillerEmptyCard';
import LoadingMoreBooks from '../LoadingMoreBooks';
import { GAP, ROW_HEIGHT } from './logic/constants';
import { useNewsDisplayLogic } from './logic/useNewsDisplayLogic';
import type { Book } from '../../types';

export type BooksContentProps = {
  books: Book[];
  isLoadingNextPage: boolean;
  onBottomReached: (val?: any) => void;
};

export default function BooksContent(props: BooksContentProps) {
  const { books, isLoadingNextPage } = props;

  const { columnCount, columnWidth, parentRef, handleScroll, totalSize, virtualRows } = useNewsDisplayLogic(props);

  return (
    <div ref={parentRef} className='size-full overflow-auto' onScroll={handleScroll}>
      <div style={{ height: totalSize }} className='relative w-full'>
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * columnCount;

          return (
            <div
              key={virtualRow.key}
              className='absolute w-full flex top-0 left-0'
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
                gap: GAP,
                paddingLeft: GAP,
                paddingRight: GAP,
              }}
            >
              {Array.from({ length: columnCount }).map((_, colIndex) => {
                const index = startIndex + colIndex;
                const book = books[index];

                if (!book) return <FillerEmptyCard key={`empty-${colIndex}`} columnWidth={columnWidth} />;

                return (
                  <div key={book.id} style={{ width: columnWidth, height: ROW_HEIGHT }}>
                    <BookCard {...book} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {isLoadingNextPage && <LoadingMoreBooks />}
    </div>
  );
}
