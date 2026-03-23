import { parseJson } from '@src/common/utils/parseJson';

export function payloadPreview(payload: unknown): string {
  if (payload == null) return '—';

  let updatedPayload: any = '';

  if (typeof payload === 'string') {
    updatedPayload = parseJson(payload);
  }

  if (updatedPayload === null) return '-';

  const prettyJson = JSON.stringify(updatedPayload, null, 2);

  return prettyJson;
}
