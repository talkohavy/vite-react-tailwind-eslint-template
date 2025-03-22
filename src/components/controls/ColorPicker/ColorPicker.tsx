import { useState } from 'react';
import { ColorPicker as ColorPickerOriginal, parseColor } from '@ark-ui/react/color-picker';
import styles from './ColorPicker.module.scss';

const {
  Root,
  Label,
  Control,
  ChannelInput,
  ValueText,
  Trigger,
  TransparencyGrid,
  ValueSwatch,
  Positioner,
  Content,
  Area,
  AreaBackground,
  AreaThumb,
  ChannelSlider,
  ChannelSliderTrack,
  ChannelSliderThumb,
  Swatch,
  SwatchGroup,
  SwatchTrigger,
  SwatchIndicator,
  EyeDropperTrigger,
  View,
  HiddenInput,
} = ColorPickerOriginal;

type ColorPickerProps = {
  format?: 'hsla' | 'hsba' | 'rgba';
};

export default function ColorPicker(props: ColorPickerProps) {
  const { format } = props;

  const [color, setColor] = useState(() => parseColor('hsl(20, 100%, 50%)'));

  return (
    <Root format={format} value={color} onValueChange={(e) => setColor(e.value)} className={styles.root}>
      <Label className={styles.label}>Color</Label>
      <Control className={styles.control}>
        <ChannelInput channel='hex' className={styles.channelInput} />
        <ChannelInput channel='alpha' />

        <ValueText />

        <Trigger>
          <TransparencyGrid />
          <ValueSwatch />
        </Trigger>
      </Control>

      <Positioner>
        <Content>
          <Area>
            <AreaBackground />
            <AreaThumb />
          </Area>

          <ChannelSlider channel='hue'>
            <ChannelSliderTrack />
            <ChannelSliderThumb />
          </ChannelSlider>
          <ChannelSlider channel='alpha'>
            <TransparencyGrid />
            <ChannelSliderTrack />
            <ChannelSliderThumb />
          </ChannelSlider>

          <SwatchGroup>
            <SwatchTrigger value='red'>
              <Swatch value='red'>
                <SwatchIndicator>✓</SwatchIndicator>
              </Swatch>
            </SwatchTrigger>
            <SwatchTrigger value='blue'>
              <Swatch value='blue'>
                <SwatchIndicator>✓</SwatchIndicator>
              </Swatch>
            </SwatchTrigger>
            <SwatchTrigger value='green'>
              <Swatch value='green'>
                <SwatchIndicator>✓</SwatchIndicator>
              </Swatch>
            </SwatchTrigger>
          </SwatchGroup>

          <View format='rgba'>
            <ChannelInput channel='hex' />
            <ChannelInput channel='alpha' />
          </View>

          <View format='hsla'>
            <ChannelInput channel='hue' />
            <ChannelInput channel='saturation' />
            <ChannelInput channel='lightness' />
          </View>

          <EyeDropperTrigger>Pick color</EyeDropperTrigger>
        </Content>
      </Positioner>

      <HiddenInput />
    </Root>
  );
}
