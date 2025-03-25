import { PinInput as PinInputOriginal, usePinInput, type PinInputValueChangeDetails } from '@ark-ui/react/pin-input';
import styles from './PinInput.module.scss';

const { RootProvider, Label, Control, Input, HiddenInput } = PinInputOriginal;

type PinInputProps = {
  pinLength: number;
  onDone?: (value: PinInputValueChangeDetails) => void;
  defaultValue?: Array<string>;
  placeholder?: string;
  disabled?: boolean;
  /**
   * makes the last input element lose focus on complete.
   *
   * @default false
   */
  blurOnComplete?: boolean;
  /**
   * To trigger smartphone OTP auto-suggestion, it is recommended to set the autocomplete attribute to "one-time-code". The pin input component provides support for this automatically when you set the otp prop to true.
   *
   * @default false
   */
  isOtp?: boolean;
  /**
   * When collecting private or sensitive information using the pin input, you might need to mask the value entered.
   *
   * @default false
   */
  isSecureMask?: boolean;
  /**
   * auto focus the first input element.
   *
   * If `blurOnComplete` is set to true, this option is negated.
   *
   * @default false
   */
  autoFocus?: boolean;
  label?: string;
};

export default function PinInput(props: PinInputProps) {
  const {
    pinLength,
    onDone,
    defaultValue,
    placeholder,
    disabled,
    blurOnComplete,
    label,
    isOtp,
    isSecureMask,
    autoFocus,
  } = props;

  const pinInput = usePinInput({
    defaultValue: defaultValue,
    onValueComplete: onDone,
    placeholder: placeholder,
    disabled,
    blurOnComplete: blurOnComplete,
    otp: isOtp,
    mask: isSecureMask,
    autoFocus,
    count: pinLength,
  });

  return (
    <RootProvider value={pinInput} className={styles.root}>
      {label && <Label className={styles.label}>{label}</Label>}

      <Control className={styles.control}>
        {pinInput.items.map((index) => (
          <Input key={index} index={index} className={styles.input} />
        ))}
      </Control>
      <HiddenInput />
    </RootProvider>
  );
}
