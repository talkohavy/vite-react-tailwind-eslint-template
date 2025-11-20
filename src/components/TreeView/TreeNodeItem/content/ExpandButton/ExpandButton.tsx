import RightArrow from '../../../../svgs/RightArrow';
import styles from './ExpandButton.module.scss';

type ExpandButtonProps = {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  disabled: boolean;
  className?: string;
  testId?: string;
};

/**
 * @description
 * This component is meant to rendered inside of a <button> element.
 * Ergo, it uses a <div> instead of a <button> element to avoid nested button issues.
 * Nested buttons are invalid HTML and can lead to unexpected behavior in browsers and assistive technologies.
 */
export default function ExpandButton(props: ExpandButtonProps) {
  const { onClick, disabled, className, testId = '' } = props;

  /**
   * Mimicking button's default disabled behavior on our div element
   */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick(e);
  };

  /**
   * Mimicking button's default keyboard behavior on our div element
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    // Trigger on Enter or Space (standard button behavior)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent space from scrolling
      onClick(e as any);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-expand-button=''
      data-test-id={`${testId}-expand-button`}
      className={className}
      // attributes that mimic default button behavior:
      role='button'
      data-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label='Expand/collapse folder'
    >
      <RightArrow className={styles.expandButtonArrow} />
    </div>
  );
}
