import { PinInput as PinInputOriginal, usePinInput, type PinInputValueChangeDetails } from '@ark-ui/react/pin-input';
import styles from './PinInput.module.scss';

const { RootProvider, Label, Control, Input, HiddenInput } = PinInputOriginal;

type PinInputProps = {
  /**
   * @default 'numeric'
   */
  type?: 'numeric' | 'alphabetic' | 'alphanumeric';
  pinLength: number;
  onDone?: (value: PinInputValueChangeDetails) => void;
  defaultValue?: Array<string>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
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
  /**
   * The regular expression that the user-entered input value is checked against.
   */
  pattern?: string;
};

export default function PinInput(props: PinInputProps) {
  const {
    type,
    pinLength,
    onDone,
    defaultValue,
    placeholder,
    disabled,
    required,
    blurOnComplete,
    label,
    isOtp,
    isSecureMask,
    autoFocus,
    pattern,
  } = props;

  const pinInput = usePinInput({
    type,
    count: pinLength,
    defaultValue: defaultValue,
    onValueComplete: onDone,
    placeholder: placeholder,
    disabled,
    required,
    blurOnComplete: blurOnComplete,
    otp: isOtp,
    mask: isSecureMask,
    autoFocus,
    pattern,
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
