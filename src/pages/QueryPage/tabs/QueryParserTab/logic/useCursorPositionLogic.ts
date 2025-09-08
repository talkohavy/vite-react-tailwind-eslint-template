import { useState } from 'react';

export function useCursorPositionLogic() {
  const [cursorPosition, setCursorPosition] = useState(0);

  return { cursorPosition, setCursorPosition };
}
