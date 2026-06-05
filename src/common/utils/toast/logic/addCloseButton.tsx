import CloseButton from '../content/CloseButton';
import type { ExternalToast } from 'sonner';

export function addCloseButton(data: ExternalToast, onClick?: () => void) {
  data.action = <CloseButton onClick={onClick} />;
}
