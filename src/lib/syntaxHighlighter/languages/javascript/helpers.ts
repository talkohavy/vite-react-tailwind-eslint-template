/**
 * @description
 * Takes a string like "<Booger" and checks to see
 * if we can find a matching "</Booger" later in the
 * content.
 */
export const hasClosingTag = (match: RegExpMatchArray, { after }: { after: number }) => {
  const tag = `</${match[0].slice(1)}`;
  const pos = match.input!.indexOf(tag, after);
  return pos !== -1;
};
