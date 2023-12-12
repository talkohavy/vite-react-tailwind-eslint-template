import { Fallback, Image, Root } from '@radix-ui/react-avatar';

const SIZES = {
  xs: 15,
  sm: 25,
  md: 35,
  lg: 45,
  xl: 60,
};

/**
 * @param {{
 *   size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
 *   imgSrc: any,
 *   imgAlt?: string,
 *   initialsFallback?: string
 * }} props
 * @returns {any}
 */
export default function Avatar({ size = 'sm', imgSrc, imgAlt, initialsFallback = '' }) {
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
