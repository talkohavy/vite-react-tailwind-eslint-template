import { useState } from 'react';

type UseQueryInputLogicProps = {
  setCursorPosition: (pos: number) => void;
};

export function useQueryInputLogic(props: UseQueryInputLogicProps) {
  const { setCursorPosition } = props;

  const [query, setQuery] = useState('status: active AND role: admin');

  function handleInputChange(newQuery: string, newCursorPosition?: number) {
    setQuery(newQuery);
    if (newCursorPosition !== undefined) {
      setCursorPosition(newCursorPosition);
    }
  }

  return { query, handleInputChange };
}
