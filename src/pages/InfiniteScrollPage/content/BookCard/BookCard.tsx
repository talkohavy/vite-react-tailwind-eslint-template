import type { Book } from '../../types';

type BookCardProps = Book;

export default function BookCard(props: BookCardProps) {
  const { author, coverImageUrl, name, description, genre, rating, publishedYear, pageCount } = props;

  return (
    <div className='flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-100'>
      {/* Image */}
      {coverImageUrl ? (
        <img src={coverImageUrl} alt={name} className='w-full h-48 object-cover' />
      ) : (
        <div className='w-full h-48 bg-gray-200 flex items-center justify-center'>
          <span className='text-gray-400 text-sm'>No Image</span>
        </div>
      )}

      {/* Content */}
      <div className='p-4 flex flex-col flex-1 overflow-auto'>
        {/* Title */}
        <h3 className='text-base font-semibold text-black mb-2 line-clamp-2'>{name}</h3>

        {/* Author */}
        <div className='mb-2'>
          <span className='text-sm text-gray-600 font-medium'>Author:</span>
          <p className='text-sm text-gray-700 mt-1'>{author}</p>
        </div>

        {/* Description */}
        <div className='mb-2'>
          <span className='text-sm text-gray-600 font-medium'>Description:</span>
          <p className='text-sm text-gray-700 mt-1 line-clamp-2'>{description || 'No description available'}</p>
        </div>

        {/* Additional Info */}
        <div className='mt-auto pt-2 space-y-1'>
          <div className='flex justify-between text-xs text-gray-500'>
            <span>Genre: {genre}</span>
            <span>Rating: {rating}⭐</span>
          </div>

          <div className='flex justify-between text-xs text-gray-500'>
            <span>{publishedYear}</span>
            <span>{pageCount} pages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
