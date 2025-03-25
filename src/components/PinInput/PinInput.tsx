import { useMemo } from 'react';
import { PinInput as PinInputOriginal, type PinInputValueChangeDetails } from '@ark-ui/react/pin-input';
import styles from './PinInput.module.scss';

const { Root, Label, Control, Input, HiddenInput } = PinInputOriginal;

type PinInputProps = {
  pinLength: number;
  onDone?: (value: PinInputValueChangeDetails) => void;
  defaultValue?: Array<string>;
  placeholder?: string;
  /**
   * makes the last input element lose focus on complete.
   *
   * @default false
   */
  blurOnComplete?: boolean;
  label?: string;
};

export default function PinInput(props: PinInputProps) {
  const { pinLength, onDone, defaultValue, placeholder, blurOnComplete, label } = props;

  const timesArr = useMemo(() => {
    return Array.from({ length: pinLength });
  }, [pinLength]);

  return (
    <Root
      defaultValue={defaultValue}
      onValueComplete={onDone}
      placeholder={placeholder}
      blurOnComplete={blurOnComplete}
      className={styles.root}
    >
      {label && <Label className={styles.label}>{label}</Label>}

      <Control className={styles.control}>
        {timesArr.map((_, index) => (
          <Input key={index} index={index} className={styles.input} />
        ))}
      </Control>
      <HiddenInput />
    </Root>
  );
}
