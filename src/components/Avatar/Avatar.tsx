import { Fallback, Image, Root } from '@radix-ui/react-avatar';
import { SIZES } from './constants';

type AvatarProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  imgSrc: any;
  imgAlt?: string;
  initialsFallback?: string;
};

export default function Avatar(props: AvatarProps) {
  const { size = 'sm', imgSrc, imgAlt, initialsFallback = '' } = props;

  return (
    <Root>
      <Image
        src={imgSrc}
        alt={imgAlt}
        className='inline-flex items-center justify-center rounded-full border-2 border-orange-500'
        style={{ width: SIZES[size] ?? SIZES.sm, height: SIZES[size] ?? SIZES.sm }}
      />
      <Fallback
        delayMs={250}
        className='inline-flex items-center justify-center rounded-full border-2 border-orange-500 bg-blue-300'
        style={{ width: SIZES[size] ?? SIZES.sm, height: SIZES[size] ?? SIZES.sm }}
      >
        {initialsFallback}
      </Fallback>
    </Root>
  );
}
