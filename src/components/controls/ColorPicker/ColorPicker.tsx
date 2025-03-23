import { type Color, ColorPicker as ColorPickerOriginal } from '@ark-ui/react/color-picker';
import EyeDropIcon from '../../svgs/EyeDropIcon';
import styles from './ColorPicker.module.scss';

const {
  Root,
  Label,
  Control,
  ChannelInput,
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
  color: Color;
  setColor: (value: any) => void;
  format?: 'hsla' | 'hsba' | 'rgba';
};

export default function ColorPicker(props: ColorPickerProps) {
  const { color, setColor, format } = props;

  return (
    <Root format={format} value={color} onValueChange={(e) => setColor(e.value)} className={styles.root}>
      <Label className={styles.label}>Color</Label>

      <Control className={styles.control}>
        <ChannelInput channel='hex' className={styles.channelInput} />

        {/* <ChannelInput channel='alpha' /> */}
        {/* <ValueText /> */}

        <Trigger className={styles.trigger}>
          {/* <TransparencyGrid /> */}
          <ValueSwatch className={styles.valueSwatch} />
        </Trigger>
      </Control>

      <Positioner className={styles.positioner}>
        <Content className={styles.content}>
          <Area className={styles.area}>
            <AreaBackground className={styles.areaBackground} />
            <AreaThumb className={styles.areaThumb} />
          </Area>

          <div className={styles.sectionA}>
            <EyeDropperTrigger className={styles.eyeDropperTrigger}>
              <EyeDropIcon className='size-3' />
            </EyeDropperTrigger>

            <div className={styles.sectionAPart1}>
              <ChannelSlider channel='hue' className={styles.channelSlider}>
                <ChannelSliderTrack className={styles.channelSliderTrack} />
                <ChannelSliderThumb className={styles.channelSliderThumb} />
              </ChannelSlider>

              <ChannelSlider channel='alpha' className={styles.channelSlider}>
                <TransparencyGrid className={styles.transparencyGrid} />
                <ChannelSliderTrack className={styles.channelSliderTrack} />
                <ChannelSliderThumb className={styles.channelSliderThumb} />
              </ChannelSlider>
            </div>
          </div>

          <View format='rgba' className={styles.sectionB}>
            <ChannelInput channel='hex' className={styles.hexInput} />
            <ChannelInput channel='alpha' className={styles.alphaInput} />
          </View>

          <div className={styles.sectionC}>
            <Label className={styles.smallLabel}>Saved Colors</Label>

            <SwatchGroup className={styles.swatchGroup}>
              <SwatchTrigger value='rgba(235, 94, 66, 1)' className={styles.savedColorTrigger}>
                <Swatch value='rgba(235, 94, 66, 1)' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#EBEB42' className={styles.savedColorTrigger}>
                <Swatch value='#EBEB42' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#7AEB42' className={styles.savedColorTrigger}>
                <Swatch value='#7AEB42' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#42EBDD' className={styles.savedColorTrigger}>
                <Swatch value='#42EBDD' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#42CFEB' className={styles.savedColorTrigger}>
                <Swatch value='#42CFEB' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#42A5EB' className={styles.savedColorTrigger}>
                <Swatch value='#42A5EB' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#427AEB' className={styles.savedColorTrigger}>
                <Swatch value='#427AEB' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#5E42EB' className={styles.savedColorTrigger}>
                <Swatch value='#5E42EB' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#B342EB' className={styles.savedColorTrigger}>
                <Swatch value='#B342EB' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='#EB425E' className={styles.savedColorTrigger}>
                <Swatch value='#EB425E' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='red' className={styles.savedColorTrigger}>
                <Swatch value='red' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='blue' className={styles.savedColorTrigger}>
                <Swatch value='blue' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>

              <SwatchTrigger value='green' className={styles.savedColorTrigger}>
                <Swatch value='green' className={styles.savedColorTriggerBtn}>
                  <SwatchIndicator>✓</SwatchIndicator>
                </Swatch>
              </SwatchTrigger>
            </SwatchGroup>
          </div>
        </Content>
      </Positioner>

      <HiddenInput />
    </Root>
  );
}
