import Picture from '../../components/Picture/Picture';

export default function PicturePage() {
  return (
    <div>
      <Picture
        srcSet={['/heart-256x256.png', '/heart-144x144.png', '/heart-128x128.png']}
        alt='heart'
        className='flex items-center justify-between border border-black h-[200px] rounded-2xl w-[500px] overflow-hidden'
        imgClassName='size-full object-fill'
      >
        <div>fallback</div>
      </Picture>
    </div>
  );
}
