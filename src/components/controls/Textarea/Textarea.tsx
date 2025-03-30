import clsx from 'clsx';
import styles from './Textarea.module.scss';

type TextareaProps = {
  value: string;
  setValue: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: React.HTMLInputTypeAttribute /**
   * Determines the height of the textarea in rows. 1 rows is equal to the average character height.
   *
   * If both height and `rows` are defined (height can be defined through `className`), height wins.
   *
   * @default 4
   */;
  rows?: number;
  /**
   * @description
   *
   * Specifies the width of the text area, in average character width. Default value is 20.
   *
   * @default 20
   */
  cols?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  testId?: string;
};

export default function Textarea(props: TextareaProps) {
  const {
    value,
    setValue,
    placeholder = '',
    disabled,
    rows = 4,
    cols,
    resize = 'none',
    autoFocus,
    className,
    testId = '',
    ...rest
  } = props;

  return (
    <textarea
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      cols={cols}
      autoFocus={autoFocus}
      className={clsx(styles.textarea, styles[`resize_${resize}`], className)}
      data-test-id={`${testId}Textarea`}
      {...rest}
    />
  );
}
