import Image from '@src/components/Image';

type CapturedPictureProps = {
  photoDataUrl: string | null;
};

export default function CapturedPicture(props: CapturedPictureProps) {
  const { photoDataUrl } = props;

  return (
    <div className='w-auto space-y-3'>
      <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>2. Still image output</h3>

      <div className='flex min-h-45 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800'>
        {photoDataUrl ? (
          <Image src={photoDataUrl} alt='Captured still' className='size-full object-contain rounded-lg' />
        ) : (
          <span className='text-sm text-gray-500 dark:text-gray-400'>The captured photo will appear here.</span>
        )}
      </div>
    </div>
  );
}
