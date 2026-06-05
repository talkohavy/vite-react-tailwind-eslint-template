type CloseButtonProps = {
  onClick?: () => void;
};

export default function CloseButton(props: CloseButtonProps) {
  const { onClick } = props;

  return (
    <button type='button' onClick={onClick}>
      X
    </button>
  );
}
