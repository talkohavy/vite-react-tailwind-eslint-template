import { useMemo } from 'react';
import { PinInput as PinInputOriginal, type PinInputValueChangeDetails } from '@ark-ui/react/pin-input';
import styles from './PinInput.module.scss';

const { Root, Label, Control, Input, HiddenInput } = PinInputOriginal;

type PinInputProps = {
  pinLength: number;
  onDone?: (value: PinInputValueChangeDetails) => void;
  defaultValue?: Array<string>;
  label?: string;
};

export default function PinInput(props: PinInputProps) {
  const { pinLength, onDone, defaultValue, label } = props;

  const timesArr = useMemo(() => {
    return Array.from({ length: pinLength });
  }, [pinLength]);

  return (
    <Root onValueComplete={onDone} defaultValue={defaultValue} className={styles.root}>
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
