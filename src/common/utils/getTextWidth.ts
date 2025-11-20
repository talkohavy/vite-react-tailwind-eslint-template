const canvas = document.createElement('canvas');

type GetTextWidthProps = {
  text: string;
  fontSize?: number;
  fontFamily?: string;
};

export function getTextWidth(props: GetTextWidthProps) {
  const { text, fontSize = 16, fontFamily = 'Hiragino Sans GB' } = props;

  const context = canvas.getContext('2d')!;
  context.font = `${fontSize}px ${fontFamily}`;

  return context.measureText(text).width;
}
