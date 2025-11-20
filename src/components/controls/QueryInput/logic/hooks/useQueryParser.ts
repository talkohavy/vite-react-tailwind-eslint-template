import { useMemo } from 'react';
import { QueryParser } from 'create-query-language';

const queryParser = new QueryParser();

type UseQueryParserProps = {
  query: string;
};

export function useQueryParser(props: UseQueryParserProps) {
  const { query } = props;

  const parseResult = useMemo(() => {
    return queryParser.parse(query);
  }, [query]);

  return parseResult;
}
