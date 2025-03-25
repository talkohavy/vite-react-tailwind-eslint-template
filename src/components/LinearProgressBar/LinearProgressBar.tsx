import ProgressBarBackground from './ProgressBarBackground';
import ProgressBarThumb from './ProgressBarThumb';
import ProgressBarTrack from './ProgressBarTrack';
import ProgressCompletedText from './ProgressCompletedText';

type LinearProgressBarProps = {
  /**
   * A number in range between 0 - 100.
   */
  completed: number;
  className?: string;
};

export default function LinearProgressBar(props: LinearProgressBarProps) {
  const { className, completed = 50 } = props;

  return (
    <ProgressBarBackground className={className}>
      <ProgressBarTrack>
        <ProgressBarThumb completed={completed} />
        <ProgressCompletedText completed={completed} />
      </ProgressBarTrack>
    </ProgressBarBackground>
  );
}
