import { useState } from 'react';

export function useQueryInputLogic() {
  const [query, setQuery] = useState('status: active AND role: admin');

  return { query, setQuery };
}
